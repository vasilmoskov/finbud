import {
    Grid,
    GridColumn,
    Icon,
    UploadFile,
} from "@vaadin/react-components";
import React, {useEffect, useState} from "react";
import {deleteIncome, getAll, addIncome, editIncome, deleteIncomeDocument} from "Frontend/generated/IncomeServiceImpl";
import {ViewConfig} from "@vaadin/hilla-file-router/types.js";
import {Button} from "@vaadin/react-components/Button.js";
import {format} from 'date-fns';
import { useSignal } from "@vaadin/hilla-react-signals";
import { IncomeDto } from "Frontend/types/IncomeDto";
import IncomeButtonRenderer from "Frontend/components/IncomeButtonRenderer";
import { visualizeDocument } from "Frontend/util/documentUtils";
import { getDateWithoutTime, mapIncomeEntityToDto} from "Frontend/util/incomeUtils";
import { currencySignsToCodes } from "Frontend/constants/incomeConstants";
import ConfirmDeleteDialog from "Frontend/components/ConfirmDeleteDialog";
import AddEditDialog from "Frontend/components/AddEditDialog";
import IncomeFilters from "Frontend/components/IncomeFilters";

export const config: ViewConfig = {
    menu: {order: 1, icon: 'line-awesome/svg/file.svg'},
    title: 'Incomes',
    loginRequired: true,
};

export default function IncomeView() {
    const gridRef = React.useRef<any>(null);
    const [incomes, setIncomes] = useState<IncomeDto[]>([]);
    const [newIncome, setNewIncome] = useState<IncomeDto>({id: '', amount: 0, currency: 'Other', category: 'Other', date: '', document: null, unusual: false});
    const [editedIncome, setEditedIncome] = useState<IncomeDto>({id: '', amount: 0, currency: 'Other', category: 'Other', date: '', document: null, unusual: false});
    const [confirmDialogOpened, setConfirmDialogOpened] = useState(false);
    const [confirmDocumentDialogOpened, setConfirmDocumentDialogOpened] = useState(false);
    const [addDialogOpened, setAddDialogOpened] = useState(false);
    const [editDialogOpened, setEditDialogOpened] = useState(false);
    const [selectedIncome, setSelectedIncome] = useState<IncomeDto | null>(null);

    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedCurrency, setSelectedCurrency] = useState<string>('All');

    const [amountFilterType, setAmountFilterType] = useState<string>('>');
    const [amountFilterValue, setAmountFilterValue] = useState<number>(0);

    const startDate = useSignal(format(new Date(), 'dd/MM/yyyy'));
    const endDate = useSignal(format(new Date(), 'dd/MM/yyyy'));

    const [isStartDateSelected, setIsStartDateSelected] = useState(false);
    const [isEndDateSelected, setIsEndDateSelected] = useState(false);

    const [selectedByUsuality, setSelectedByUsuality] = useState<string>('All');

    const [sortConfig, setSortConfig] = useState({key: '', direction: ''});

    const [documentFile, setDocumentFile] = useState<UploadFile[]>([]);

    const [incomeWithDocumentToRemove, setIncomeWithDocumentToRemove] = useState<IncomeDto | null>(null);

    const areFiltersDefault = () => {
      return (
        amountFilterType === '>' &&
        amountFilterValue === 0 &&
        selectedCurrency === 'All' &&
        selectedCategory === 'All' &&
        selectedByUsuality === 'All' &&
        !isStartDateSelected && 
        !isEndDateSelected
      );
    }

    const clearFilters = () => {
      setAmountFilterType('>');
      setAmountFilterValue(0);
      setSelectedCurrency('All');
      setSelectedCategory('All');
      setSelectedByUsuality('All');
      setIsStartDateSelected(false);
      setIsEndDateSelected(false);
      startDate.value = '';
      endDate.value = '';
    }

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

    const handleEdit = (income: IncomeDto) => {

        // TODO: setNewIncome should be enough.. something with the state and the dialog is not working good and it's not synced
        editedIncome.id = income.id;
        editedIncome.amount = income.amount;
        editedIncome.currency = income.currency;
        editedIncome.category = income.category;
        editedIncome.date = income.date;
        editedIncome.document = income.document;
        editedIncome.unusual = income.unusual

        setEditedIncome({
            id: income.id,
            amount: income.amount,
            currency: income.currency,
            category: income.category,
            date: income.date,
            document: income.document,
            unusual: income.unusual
        });

        setEditDialogOpened(true);
    };

    const handleDelete = (income: IncomeDto) => {
        setSelectedIncome(income);
        setConfirmDialogOpened(true);
    };

    const confirmDelete = () => {
        if (selectedIncome) {
            const previousIncomes = [...incomes];
            const updatedIncomes = incomes.filter(i => i.id !== selectedIncome.id);
            setIncomes(updatedIncomes);
            deleteIncome(selectedIncome.id!).catch(() => setIncomes(previousIncomes));

            setSelectedIncome(null);
            setConfirmDialogOpened(false);
        }
    };

    const addNewIncome = () => {
        const income: IncomeDto = {
            amount: newIncome.amount,
            currency: newIncome.currency,
            category: newIncome.category,
            date: format(new Date(), "dd MMM yyyy HH:mm:ss"),
            document: newIncome.document,
            unusual: newIncome.unusual
        };

        const previousIncomes = [...incomes];

        setIncomes([...incomes, income]);

        setDocumentFile([]);
        setNewIncome({id: '', amount: 0, currency: 'Other', category: 'Other', date: '', document: null, unusual: false});
        setAddDialogOpened(false);

        addIncome(income.amount, currencySignsToCodes[income.currency], income.category.toUpperCase(), income.document?.content!, income.unusual)
            .then((savedIncome) => {
                    income.id = savedIncome.id

                    if(income.document != null) {
                        income.document.id = savedIncome.document.id;
                    }

                    setIncomes([...incomes, income]);
                }
            )
            .catch(() => {
                setIncomes(previousIncomes);
                setNewIncome(income);
                setAddDialogOpened(true);
            })
        
    };

    const editCustomIncome = () => {
        const income: IncomeDto = {
            id: editedIncome.id,
            amount: editedIncome.amount,
            currency: editedIncome.currency,
            category: editedIncome.category,
            date: editedIncome.date,
            document: editedIncome.document,
            unusual: editedIncome.unusual
        };


        const previousIncomes = [...incomes];

        setIncomes(incomes.map(i => i.id === income.id ? income : i));

        setEditDialogOpened(false);

        editIncome(income.id!, income.amount, currencySignsToCodes[income.currency], income.category.toUpperCase(), income.document?.content!, income.unusual)
            .then(() => {
                setDocumentFile([]);
            })
            .catch(() => {
                setIncomes(previousIncomes);
                setEditedIncome(income);
                setEditDialogOpened(true);
            })
    };

    useEffect(() => {
        getAll().then(incomes => {
            const mappedIncomes = incomes.map(mapIncomeEntityToDto);
            setIncomes(mappedIncomes)
        });

        setTimeout(() => {
            gridRef.current?.recalculateColumnWidths();
        }, 100);
    }, []);

    const handleAddDialogOpenedChanged = (detailValue: boolean) => {
        setAddDialogOpened(detailValue);

        if (!detailValue) {
            setNewIncome({...newIncome, id: '', amount: 0, currency: 'Other', category: 'Other', date: '', document: null, unusual: false});
            setDocumentFile([]);
        }
    };

    const handleEditDialogOpenedChanged = (detailValue: boolean) => {
        setEditDialogOpened(detailValue);

        if (!detailValue) {
            setDocumentFile([]);
        }
    };

    const handleUploadBefore = async (e: CustomEvent, context: 'add' | 'edit') => {
        const file = e.detail.file as UploadFile;
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = () => {
            setDocumentFile(Array.of(file))

            if(context === 'add') {
                setNewIncome({...newIncome, document: {content: reader.result as string}});
            } else if (context === 'edit') {
                setEditedIncome({...editedIncome, document: {content: reader.result as string}});
            }

        };
        reader.readAsDataURL(file);
    };

    const handleRemoveDocument = (income: IncomeDto) => {
        setIncomeWithDocumentToRemove(income);
        setConfirmDocumentDialogOpened(true);
      };
    
    const confirmRemoveDocument = () => {
        if(incomeWithDocumentToRemove == null) {
            return;
        }

        incomeWithDocumentToRemove.document = null;

        const previousIncomes = [...incomes];

        setIncomes(incomes.map(i => i.id === incomeWithDocumentToRemove.id ? incomeWithDocumentToRemove : i));

        setConfirmDocumentDialogOpened(false);

        deleteIncomeDocument(incomeWithDocumentToRemove.id!)
            .catch(() => {
                setIncomes(previousIncomes);
                setConfirmDocumentDialogOpened(true);
            })
    };

    return (
        <>
            <Button
                theme="success"
                onClick={() => setAddDialogOpened(true)}
                style={{marginLeft: '1rem', marginTop: '1rem', marginBottom: '1rem'}}
            >
                Add Income
                <Icon icon="vaadin:plus"/>
            </Button>

            <IncomeFilters
                areFiltersDefault={areFiltersDefault}
                clearFilters={clearFilters}
                amountFilterType={amountFilterType}
                setAmountFilterType={setAmountFilterType}
                amountFilterValue={amountFilterValue}
                setAmountFilterValue={setAmountFilterValue}
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                startDate={startDate}
                setIsStartDateSelected={setIsStartDateSelected}
                endDate={endDate}
                setIsEndDateSelected={setIsEndDateSelected}
                selectedByUsuality={selectedByUsuality}
                setSelectedByUsuality={setSelectedByUsuality}
            ></IncomeFilters>

            <Grid items={incomes.filter(i => {
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
                    const incomeDate = getDateWithoutTime(new Date(i.date!));

                    if (isStartDateSelected && startDate && incomeDate < getDateWithoutTime(new Date(startDate.value))) {
                        dateFilter = false;
                    }

                    if (isEndDateSelected && endDate && incomeDate > getDateWithoutTime(new Date(endDate.value))) {
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
                                    theme: 'badge success',
                                } satisfies object)}
                            >
                                {Number(item.amount).toFixed(2)}
                            </span>
                            {item.unusual && 
                                <Icon 
                                    icon="vaadin:star" 
                                    style={{marginLeft: '0.5rem', fontSize: '0.8rem', color: 'gold'}}
                                    title="This income is unusual"
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
                    <IncomeButtonRenderer
                      income={item}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      visualizeDocument={visualizeDocument}
                      onRemoveDocument={handleRemoveDocument}
                    />
                  )}
                </GridColumn>
            </Grid>

            <ConfirmDeleteDialog
                message="Are you sure you want to delete this income?"
              opened={confirmDialogOpened} onConfirm={confirmDelete} onCancel={() => setConfirmDialogOpened(false)}>
            </ConfirmDeleteDialog>

            <ConfirmDeleteDialog
                message="Are you sure you want to delete the document attached to this income?"
              opened={confirmDocumentDialogOpened} onConfirm={confirmRemoveDocument} onCancel={() => setConfirmDocumentDialogOpened(false)}>
            </ConfirmDeleteDialog>

            <AddEditDialog
                opened={addDialogOpened}
                income={newIncome}
                onIncomeChange={setNewIncome}
                onSave={addNewIncome}
                handleOpenChanged={(value) => handleAddDialogOpenedChanged(value)}
                isEdit={false}
                documentFile={documentFile}
                handleUploadBefore={(e) => handleUploadBefore(e, 'add')}
            ></AddEditDialog>

            <AddEditDialog
                opened={editDialogOpened}
                income={editedIncome}
                onIncomeChange={setEditedIncome}
                onSave={editCustomIncome}
                handleOpenChanged={(value) => handleEditDialogOpenedChanged(value)}
                isEdit={true}
                documentFile={documentFile}
                handleUploadBefore={(e) => handleUploadBefore(e, 'edit')}
            ></AddEditDialog>
        </>
    );
}