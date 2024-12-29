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
import {deleteIncome, getAll, addIncome, editIncome} from "Frontend/generated/IncomeServiceImpl";
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

const buttonRenderer = (income: IncomeDto, onEdit: (income: IncomeDto) => void, onDelete: (income: IncomeDto) => void) => (
    <div>
        <Button theme="icon" onClick={() => onEdit(income)}>
            <Icon icon="vaadin:edit"/>
        </Button>
        <Button theme="icon" onClick={() => onDelete(income)}>
            <Icon icon="vaadin:trash"/>
        </Button>
    </div>
);

interface IncomeDto {
    id?: string,
    amount: string;
    currency: string;
    category: string;
    date?: string;
}

const categoriesMap: Record<string, string> = {
    'SALARY': 'Salary',
    'SAVINGS': 'Savings',
    'DEPOSIT': 'Deposit',
    'OTHER': 'Other'
};

const currencyCodesToSigns: Record<string, string> = {
    'BGN': 'лв.',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'OTHER': 'Other'
};

const currencySignsToCodes: Record<string, string> = {
    'лв.': 'BGN',
    '$': 'USD',
    '€': 'EUR',
    '£': 'GBP',
    'Other': 'OTHER'
};

const formtatCurrency = (currency: string): string => {
    return currencyCodesToSigns[currency] || currency;
}

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
        currency: formtatCurrency(income.currency),
        category: formatCategory(income.category),
        date: income.date ? formatDate(income.date) : ''
    };
};

const currencyOptions: SelectItem[] = Object.values(currencyCodesToSigns).map(value => ({
    label: value,
    value: value
}));

const categoryOptions: SelectItem[] = Object.values(categoriesMap).map(value => ({
    label: value,
    value: value
}));

export default function IncomeView() {
    const gridRef = React.useRef<any>(null);
    const [incomes, setIncomes] = useState<IncomeDto[]>([]);
    const [newIncome, setNewIncome] = useState<IncomeDto>({id: '', amount: '', currency: 'Other', category: 'Other', date: ''});
    const [editedIncome, setEditedIncome] = useState<IncomeDto>({id: '', amount: '', currency: 'Other', category: 'Other', date: ''});
    const [confirmDialogOpened, setConfirmDialogOpened] = useState(false);
    const [addDialogOpened, setAddDialogOpened] = useState(false);
    const [editDialogOpened, setEditDialogOpened] = useState(false);
    const [selectedIncome, setSelectedIncome] = useState<IncomeDto | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = (income: IncomeDto) => {

        // TODO: setNewIncome should be enough.. something with the state and the dialog is not working good and it's not synced
        editedIncome.id = income.id;
        editedIncome.amount = income.amount;
        editedIncome.category = income.category;
        editedIncome.date = income.date;

        setEditedIncome({
            id: income.id,
            amount: income.amount,
            currency: income.currency,
            category: income.category,
            date: income.date
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
        };

        const previousIncomes = [...incomes];

        income.date = format(new Date(), "dd MMM yyyy HH:mm:ss");
        setIncomes([...incomes, income]);

        setNewIncome({id: '', amount: '', currency: 'Other', category: 'Other', date: ''});
        setAddDialogOpened(false);

        addIncome(income.amount, currencySignsToCodes[income.currency], income.category.toUpperCase())
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

    const editCustomIncome = () => {
        const income: IncomeDto = {
            amount: editedIncome.amount,
            currency: editedIncome.currency,
            category: editedIncome.category,
        };

        const previousIncomes = [...incomes];

        income.id = editedIncome.id;
        income.date = editedIncome.date;
        setIncomes(incomes.map(i => i.id === income.id ? income : i));

        // setEditedIncome({id: '', amount: '', category: 'Other', date: ''});
        setEditDialogOpened(false);

        editIncome(income.id!, income.amount, currencySignsToCodes[income.currency], income.category.toUpperCase())
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
            // TODO: setNewIncome should be enough.. something with the state and the dialog is not working good and it's not synced
            newIncome.id = '';
            newIncome.amount = '';
            newIncome.currency = 'Other';
            newIncome.category = 'Other';
            newIncome.date = '';

            setNewIncome({...newIncome, id: '', amount: '', currency: 'Other', category: 'Other', date: ''});
        }
    };

    const handleEditDialogOpenedChanged = (detailValue: boolean) => {
        setEditDialogOpened(detailValue);
    };

    return (
        <>
            <Grid items={incomes} ref={gridRef}>
                <GridColumn header="Amount" autoWidth>
                    {({item}) => amountRenderer(item)}
                </GridColumn>

                <GridColumn header="Currency" autoWidth>
                    {({item}) => item.currency}
                </GridColumn>

                <GridColumn header="Date" autoWidth>
                    {({item}) => item.date}
                </GridColumn>

                <GridColumn header="Category" autoWidth>
                    {({item}) => item.category}
                </GridColumn>

                <GridColumn autoWidth>
                    {({item}) => buttonRenderer(item, handleEdit, handleDelete)}
                </GridColumn>
            </Grid>

            <div style={{display: 'flex', justifyContent: 'center', marginTop: '1rem'}}>
                <Button
                    theme="primary"
                    className={styles.addButton}
                    onClick={() => setAddDialogOpened(true)}
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
                headerTitle="Add Income"
                opened={addDialogOpened}
                onOpenedChanged={({detail}) => handleAddDialogOpenedChanged(detail.value)}
                footerRenderer={() => (
                    <>
                        <Button onClick={() => handleAddDialogOpenedChanged(false)}>Cancel</Button>
                        <Button theme="primary" onClick={addNewIncome}>
                            Add
                        </Button>
                    </>
                )}
            >
                <VerticalLayout style={{alignItems: 'stretch', width: '18rem', maxWidth: '100%'}}>
                    <TextField
                        // key={newIncome.id} // todo: was not making any difference - delete?
                        label="Amount"
                        value={newIncome.amount}
                        onChange={e => setNewIncome({...newIncome, amount: e.target.value})}
                    />
                    <Select
                        label="Currency"
                        value={newIncome.currency}
                        items={currencyOptions}
                        onValueChanged={e => setNewIncome({...newIncome, currency: e.detail.value})}
                    />
                    <Select
                        label="Category"
                        value={newIncome.category}
                        items={categoryOptions}
                        onValueChanged={e => setNewIncome({...newIncome, category: e.detail.value})}
                    />
                </VerticalLayout>
            </Dialog>


            <Dialog
                headerTitle="Edit Income"
                opened={editDialogOpened}
                onOpenedChanged={({detail}) => handleEditDialogOpenedChanged(detail.value)}
                footerRenderer={() => (
                    <>
                        <Button onClick={() => handleEditDialogOpenedChanged(false)}>Cancel</Button>
                        <Button theme="primary" onClick={editCustomIncome}>
                            Edit
                        </Button>
                    </>
                )}
            >
                <VerticalLayout style={{alignItems: 'stretch', width: '18rem', maxWidth: '100%'}}>
                    <TextField
                        // key={newIncome.id} // todo: was not making any difference - delete?
                        label="Amount"
                        value={editedIncome.amount}
                        onChange={e => setEditedIncome({...editedIncome, amount: e.target.value})}
                    />
                    <Select
                        label="Currency"
                        value={editedIncome.currency}
                        items={currencyOptions}
                        onValueChanged={e => setEditedIncome({...editedIncome, currency: e.detail.value})}
                    />
                    <Select
                        label="Category"
                        value={editedIncome.category}
                        items={categoryOptions}
                        onValueChanged={e => setEditedIncome({...editedIncome, category: e.detail.value})}
                    />
                </VerticalLayout>
            </Dialog>

        </>
    );
}