import { Grid, GridColumn, Icon } from "@vaadin/react-components";
import TransactionButtonRenderer from "./TransactionButtonRenderer";
import { Transaction } from "Frontend/types/Transaction";
import { useState } from "react";
import { Signal } from "@vaadin/hilla-react-signals";
import { getDateWithoutTime} from "Frontend/util/incomeUtils";
import { visualizeDocument } from "Frontend/util/documentUtils";

interface Props {
    buttonTheme: string,
    transactions: Transaction[];
    selectedCategory: string;
    selectedCurrency: string;
    selectedByUsuality: string;
    amountFilterType: string;
    amountFilterValue: number | null;
    startDate: Signal<string>
    isStartDateSelected: boolean;
    endDate: Signal<string>;
    isEndDateSelected: boolean;
    handleEdit: (transaction: Transaction) => void;
    handleDelete: (transaction: Transaction) => void;
    handleRemoveDocument: (transaction: Transaction) => void;
    gridRef: React.MutableRefObject<any>
  }

export default function TransactionGrid({
    buttonTheme,
    transactions,
    selectedCategory,
    selectedCurrency,
    selectedByUsuality,
    amountFilterType,
    amountFilterValue,
    startDate,
    isStartDateSelected,
    endDate,
    isEndDateSelected,
    handleEdit,
    handleDelete,
    handleRemoveDocument,
    gridRef
  }: Props) {

    const [sortConfig, setSortConfig] = useState({key: '', direction: ''});
    

    const handleSort = (key: string) => {
        // when we click on a column header for a first time, we sort in ascending order
        let direction = 'ascending';

        if(sortConfig.key === key && sortConfig.direction === 'ascending') {
            // if the last sort was with the same key and it was in ascending order, we change the sort to descending order
            direction = 'descending';
        } else if(sortConfig.key  === key && sortConfig.direction === 'descending') {
            // if the last sort was with the same key and it was in descending order, we change the sort to default order
            direction = '';
        }

        setSortConfig({key, direction});   
    }

    return (
        <>
        <Grid items={transactions.filter(i => {
                const categoryFilter = selectedCategory === 'All' || i.category === selectedCategory
                const currencyFilter = selectedCurrency === 'All' || i.currency === selectedCurrency
                const usualityFilter = selectedByUsuality === 'All' || 
                     (selectedByUsuality === 'usual' && !i.unusual) || 
                     (selectedByUsuality === 'unusual' && i.unusual);

                let amountFilter = true;
                let dateFilter = true;

                if (amountFilterValue !== null) {
                    switch (amountFilterType) {
                        case ">":
                            amountFilter = i.amount > amountFilterValue;
                            break;
                        case "<":
                            amountFilter = i.amount < amountFilterValue;
                            break;
                        case "=":
                            amountFilter = i.amount === amountFilterValue;
                            break;
                    }
                }

                if (startDate.value || endDate.value) {
                    const transactionDate = getDateWithoutTime(new Date(i.date!));

                    if (isStartDateSelected && startDate && transactionDate < getDateWithoutTime(new Date(startDate.value))) {
                        dateFilter = false;
                    }

                    if (isEndDateSelected && endDate && transactionDate > getDateWithoutTime(new Date(endDate.value))) {
                        dateFilter = false;
                    }
                }

                return categoryFilter && currencyFilter && amountFilter && dateFilter && usualityFilter

            }).sort((a, b) => {
                if(sortConfig.direction === '') {
                    return 0;
                }

                if(sortConfig.key === 'amount') {
                    return sortConfig.direction === 'ascending'
                        ? a.amount - b.amount
                        : b.amount - a.amount
                }

                if(sortConfig.key === 'currency') {
                    return sortConfig.direction === 'ascending'
                        ? a.currency.localeCompare(b.currency)
                        : b.currency.localeCompare(a.currency);
                }

                if (sortConfig.key === 'category') {
                    return sortConfig.direction === 'ascending'
                    ? a.category.localeCompare(b.category)
                    : b.category.localeCompare(a.category);
                }

                if(sortConfig.key === 'date') {
                    return sortConfig.direction === 'ascending'
                        ? new Date(a.date!).getTime() - new Date(b.date!).getTime()
                        : new Date(b.date!).getTime() - new Date(a.date!).getTime()
                }

                return 0;
            })
            } ref={gridRef}>
                <GridColumn header={<div onClick={() => handleSort('amount')}>Amount <Icon icon="vaadin:sort"/></div>} autoWidth>
                    {({item}) => (
                        <div>
                            <span
                                {...({
                                    theme: `badge ${buttonTheme}`,
                                } satisfies object)}
                            >
                                {Number(item.amount).toFixed(2)}
                            </span>
                            {item.unusual && 
                                <Icon 
                                    icon="vaadin:star" 
                                    style={{marginLeft: '0.5rem', fontSize: '0.8rem', color: 'gold'}}
                                    title="This transaction is unusual"
                                />
                            }
                        </div>
                    )}
                </GridColumn>

                <GridColumn header={<div onClick={() => handleSort('currency')}>Currency <Icon icon="vaadin:sort"/></div>} autoWidth>
                    {({item}) => item.currency}
                </GridColumn>

                <GridColumn header={<div onClick={() => handleSort('category')}>Category <Icon icon="vaadin:sort"/></div>} autoWidth>
                    {({item}) => item.category}
                </GridColumn>

                <GridColumn header={<div onClick={() => handleSort('date')}>Date <Icon icon="vaadin:sort"/></div>} autoWidth>
                    {({item}) => item.date}
                </GridColumn>

                <GridColumn autoWidth>
                  {({ item }) => (
                    <TransactionButtonRenderer
                      transaction={item}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      visualizeDocument={visualizeDocument}
                      onRemoveDocument={handleRemoveDocument}
                    />
                  )}
                </GridColumn>
            </Grid>
        </>
    )
}