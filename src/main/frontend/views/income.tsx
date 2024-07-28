import {
    ConfirmDialog,
    Dialog,
    Grid,
    GridColumn,
    Icon,
    Select,
    SelectItem,
    VerticalLayout
} from "@vaadin/react-components";
import React, {useEffect, useState} from "react";
import IncomeEntity from "Frontend/generated/com/example/application/data/IncomeEntity";
import {deleteIncome, getAll, create} from "Frontend/generated/IncomeServiceImpl";
import {ViewConfig} from "@vaadin/hilla-file-router/types.js";
import {Button} from "@vaadin/react-components/Button.js";
import {TextField} from "@vaadin/react-components/TextField.js";
import styles from "./income.module.css";
import {format} from 'date-fns';

export const config: ViewConfig = {
    menu: {order: 2, icon: 'line-awesome/svg/file.svg'},
    title: 'Incomes',
    loginRequired: true,
};

const amountRenderer = (income: IncomeDto) => (
    <span
        {...({
            theme: `badge ${+income.amount >= 1000 ? 'success' : 'error'}`,
        } satisfies object)}
    >
        {Number(income.amount).toFixed(2)} $
         </span>
);

const buttonRenderer = (income: IncomeDto, onDelete: (income: IncomeDto) => void) => (
    <Button theme="icon" onClick={() => onDelete(income)}>
        <Icon icon="vaadin:trash"/>
    </Button>
);

interface IncomeDto {
    id?: string,
    amount: string;
    category: string;
    date?: string;
}

const categoriesMap: Record<string, string> = {
    'SALARY': 'Salary',
    'SAVINGS': 'Savings',
    'DEPOSIT': 'Deposit',
    'OTHER': 'Other'
};

const formatCategory = (category: string): string => {
    return categoriesMap[category] || category;
};

const formatDate = (dateString: string): string => {
    return format(new Date(dateString), "dd MMM yyyy HH:mm:ss");
};

const mapIncomeEntityToDto = (income: IncomeEntity): IncomeDto => {
    return {
        id: income.id,
        amount: income.amount + "",
        category: formatCategory(income.category),
        date: income.date ? formatDate(income.date) : ''
    };
};

const categoryOptions: SelectItem[] = Object.values(categoriesMap).map(value => ({
    label: value,
    value: value
}));

export default function IncomeView() {
    const gridRef = React.useRef<any>(null);
    const [incomes, setIncomes] = useState<IncomeDto[]>([]);
    const [confirmDialogOpened, setConfirmDialogOpened] = useState(false);
    const [addDialogOpened, setAddDialogOpened] = useState(false);
    const [selectedIncome, setSelectedIncome] = useState<IncomeDto | null>(null);
    const [newIncome, setNewIncome] = useState<IncomeDto>({amount: '', category: 'Other'});

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

    const openAddDialog = () => {
        setAddDialogOpened(true);
    };

    const addIncome = () => {
        const income: IncomeDto = {
            amount: newIncome.amount, // parseFloat(newIncome.amount),
            category: newIncome.category,
            date: format(new Date(), "dd MMM yyyy HH:mm:ss")
        };

        const previousIncomes = [...incomes];

        setIncomes([...incomes, income]);
        setNewIncome({amount: '', category: 'Other'});
        setAddDialogOpened(false);

        create(newIncome.amount, newIncome.category.toUpperCase())
            .then((savedIncome) => {
                    income.id = savedIncome.id
                    setIncomes([...incomes, income]);
                }
            )
            .catch(() => {
                setIncomes(previousIncomes);
                setNewIncome(income);
                setAddDialogOpened(true);
            })
    };

    useEffect(() => {
        getAll().then(incomes => {
            const mappedIncomes = incomes.map(mapIncomeEntityToDto);
            setIncomes(mappedIncomes)
        });

        // Workaround for https://github.com/vaadin/react-components/issues/129
        setTimeout(() => {
            gridRef.current?.recalculateColumnWidths();
        }, 100);
    }, []);

    const handleDialogOpenedChanged = (detailValue: boolean) => {
        if (!detailValue) {
            setNewIncome({amount: '', category: 'Other'});
        }
        setAddDialogOpened(detailValue);
    };

    return (
        <>
            <Grid items={incomes} ref={gridRef}>
                {/*<GridSelectionColumn/>*/}

                <GridColumn header="Amount" autoWidth>
                    {({item}) => amountRenderer(item)}
                </GridColumn>

                <GridColumn header="Date" autoWidth>
                    {({item}) => item.date}
                </GridColumn>

                <GridColumn header="Category" autoWidth>
                    {({item}) => item.category}
                </GridColumn>

                <GridColumn autoWidth>
                    {({item}) => buttonRenderer(item, handleDelete)}
                </GridColumn>
            </Grid>

            <div style={{display: 'flex', justifyContent: 'center', marginTop: '1rem'}}>
                <Button
                    theme="primary"
                    className={styles.addButton}
                    onClick={openAddDialog}
                >
                    <Icon icon="vaadin:plus" className={styles.addButtonIcon}/>
                </Button>
            </div>

            <ConfirmDialog
                header="Confirm Delete"
                cancelButtonVisible
                confirmText="Delete"
                opened={confirmDialogOpened}
                onConfirm={confirmDelete}
                onCancel={() => setConfirmDialogOpened(false)}
            >
                Are you sure you want to delete this income?
            </ConfirmDialog>

            <Dialog
                headerTitle="New Income"
                opened={addDialogOpened}
                onOpenedChanged={({detail}) => handleDialogOpenedChanged(detail.value)}
                footerRenderer={() => (
                    <>
                        <Button onClick={() => setAddDialogOpened(false)}>Cancel</Button>
                        <Button theme="primary" onClick={addIncome}>
                            Add
                        </Button>
                    </>
                )}
            >
                <VerticalLayout style={{alignItems: 'stretch', width: '18rem', maxWidth: '100%'}}>
                    <TextField
                        label="Amount"
                        value={newIncome.amount}
                        onChange={e => setNewIncome({...newIncome, amount: e.target.value})}
                    />
                    <Select
                        label="Category"
                        value={newIncome.category}
                        items={categoryOptions}
                        onValueChanged={e => setNewIncome({...newIncome, category: e.detail.value})}
                    />
                </VerticalLayout>
            </Dialog>
        </>
    );
}