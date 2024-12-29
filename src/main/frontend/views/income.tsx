import {
    ConfirmDialog,
    DatePicker,
    DatePickerDate,
    DatePickerElement,
    Dialog,
    Grid,
    GridColumn,
    Icon,
    Select,
    SelectItem,
    VerticalLayout
} from "@vaadin/react-components";
import React, {useEffect, useRef, useState} from "react";
import IncomeEntity from "Frontend/generated/com/example/application/data/IncomeEntity";
import {deleteIncome, getAll, addIncome, editIncome} from "Frontend/generated/IncomeServiceImpl";
import {ViewConfig} from "@vaadin/hilla-file-router/types.js";
import {Button} from "@vaadin/react-components/Button.js";
import {TextField} from "@vaadin/react-components/TextField.js";
import styles from "./income.module.css";
import {format, parse} from 'date-fns';
import { useSignal } from "@vaadin/hilla-react-signals";

export const config: ViewConfig = {
    menu: {order: 2, icon: 'line-awesome/svg/file.svg'},
    title: 'Incomes',
    loginRequired: true,
};

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
    amount: number;
    currency: string;
    category: string;
    date?: string;
}

const amountFilterOptions = [
    { label: 'Greater than', value: '>' },
    { label: 'Less than', value: '<' },
    { label: 'Equals', value: '=' }
]

const categoriesMap: Record<string, string> = {
    'SALARY': 'Salary',
    'SAVINGS': 'Savings',
    'DEPOSIT': 'Deposit',
    'OTHER': 'Other'
};

const categoryOptions: SelectItem[] = Object.values(categoriesMap).map(value => ({
    label: value,
    value: value
}));

const categoryFilteringOptions : SelectItem[] = [
    { label: 'All', value: 'All' },
    ...Object.values(categoriesMap).map(v => ({ label: v, value: v }))
];

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

const currencyFilteringOptions : SelectItem[] = [
    { label: 'All', value: 'All' },
    ...Object.keys(currencySignsToCodes).map(k => ({ label: k, value: k }))
];

const formtatCurrency = (currency: string): string => {
    return currencyCodesToSigns[currency] || currency;
}

const formatCategory = (category: string): string => {
    return categoriesMap[category] || category;
};

const formatDate = (dateString: string): string => {
    return format(new Date(dateString), "dd MMM yyyy HH:mm:ss");
};


const formatDateForDatePicker = (dateParts: DatePickerDate) => {
    const { year, month, day } = dateParts;
    const date = new Date(year, month, day);
  
    return format(date, 'dd/MM/yyyy');
  }

const parseDateForDatePicker = (inputValue: string) => {
    const date = parse(inputValue, 'dd/MM/yyyy', new Date());
  
    return { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
  }

const getDateWithoutTime = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const mapIncomeEntityToDto = (income: IncomeEntity): IncomeDto => {
    return {
        id: income.id,
        amount: income.amount,
        currency: formtatCurrency(income.currency),
        category: formatCategory(income.category),
        date: income.date ? formatDate(income.date) : ''
    };
};

const currencyOptions: SelectItem[] = Object.values(currencyCodesToSigns).map(value => ({
    label: value,
    value: value
}));

export default function IncomeView() {
    const gridRef = React.useRef<any>(null);
    const [incomes, setIncomes] = useState<IncomeDto[]>([]);
    const [newIncome, setNewIncome] = useState<IncomeDto>({id: '', amount: 0, currency: 'Other', category: 'Other', date: ''});
    const [editedIncome, setEditedIncome] = useState<IncomeDto>({id: '', amount: 0, currency: 'Other', category: 'Other', date: ''});
    const [confirmDialogOpened, setConfirmDialogOpened] = useState(false);
    const [addDialogOpened, setAddDialogOpened] = useState(false);
    const [editDialogOpened, setEditDialogOpened] = useState(false);
    const [selectedIncome, setSelectedIncome] = useState<IncomeDto | null>(null);

    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedCurrency, setSelectedCurrency] = useState<string>('All');

    const [amountFilterType, setAmountFilterType] = useState<string>('>');
    const [amountFilterValue, setAmountFilterValue] = useState<number>(0);

    const startDate = useSignal(format(new Date(), 'dd/MM/yyyy'));
    const endDate = useSignal(format(new Date(), 'dd/MM/yyyy'));

    const startDatePickerRef = useRef<DatePickerElement>(null);
    useEffect(() => {
        const datePicker = startDatePickerRef.current;

        if(datePicker) {
            datePicker.i18n = {
                ...datePicker.i18n,
                formatDate: formatDateForDatePicker,
                parseDate: parseDateForDatePicker
            }
        }
    }, [startDatePickerRef.current])

    const endDatePickerRef = useRef<DatePickerElement>(null);
    useEffect(() => {
        const datePicker = endDatePickerRef.current;

        if(datePicker) {
            datePicker.i18n = {
                ...datePicker.i18n,
                formatDate: formatDateForDatePicker,
                parseDate: parseDateForDatePicker
            }
        }
    }, [endDatePickerRef.current])

    const handleEdit = (income: IncomeDto) => {

        // TODO: setNewIncome should be enough.. something with the state and the dialog is not working good and it's not synced
        editedIncome.id = income.id;
        editedIncome.amount = income.amount;
        editedIncome.currency = income.currency;
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

        setNewIncome({id: '', amount: 0, currency: 'Other', category: 'Other', date: ''});
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
            newIncome.amount = 0;
            newIncome.currency = 'Other';
            newIncome.category = 'Other';
            newIncome.date = '';

            setNewIncome({...newIncome, id: '', amount: 0, currency: 'Other', category: 'Other', date: ''});
        }
    };

    const handleEditDialogOpenedChanged = (detailValue: boolean) => {
        setEditDialogOpened(detailValue);
    };

    return (
        <>
        <div style={{ display: 'flex', alignItems: 'start', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '1rem' }}>
            <label style={{ marginRight: '0.5rem' }}>Filter by amount:</label>
                <Select 
                        items={amountFilterOptions}
                        value={amountFilterType}
                        onValueChanged={(e => setAmountFilterType(e.detail.value))}
                        style={{maxWidth: '200px'}}
                        />

                <TextField 
                        value={amountFilterValue !== null ? amountFilterValue.toString() : ''}
                        onChange={(e) => setAmountFilterValue(e.target.value ? Number(e.target.value) : 0)}
                        style={{maxWidth: '200px'}}
                        />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '1rem' }}>

                    <label style={{ marginRight: '0.5rem' }}>Filter by currency:</label>

                    <Select
                        items={currencyFilteringOptions}
                        value={selectedCurrency}
                        onValueChanged={e => setSelectedCurrency(e.detail.value)}
                        style={{maxWidth: '200px'}}

                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '1rem' }}>
                    <label style={{ marginRight: '0.5rem' }}>Filter by catergory:</label>
                    <Select
                        items={categoryFilteringOptions}
                        value={selectedCategory}
                        onValueChanged={e => setSelectedCategory(e.detail.value)}
                        style={{maxWidth: '200px'}}

                    />
                </div>
                 <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '1rem' }}>
                    <label style={{ marginRight: '0.5rem' }}>Filter by date:</label>
                    <DatePicker
                        ref={startDatePickerRef}
                        placeholder="From"
                        value={startDate.value}
                        onValueChanged={(e) => startDate.value = e.detail.value}
                        style={{maxWidth: '200px'}}
                    />
                    <DatePicker
                        ref={endDatePickerRef}
                        placeholder="To"
                        value={endDate.value}
                        onValueChanged={(e) => endDate.value = e.detail.value}
                        style={{maxWidth: '200px'}}
                    />
                </div>
            </div>

            <Grid style={{maxHeight: '300px'}} items={incomes.filter(i => {
                const categoryFilter = selectedCategory === 'All' || i.category === selectedCategory
                const currencyFilter = selectedCurrency === 'All' || i.currency === selectedCurrency

                let amountFilter = true;
                let dateFilter = true;

                if(amountFilterValue !== null) {
                    switch(amountFilterType) {
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

                if(startDate.value || endDate.value) {
                    const incomeDate = getDateWithoutTime(new Date(i.date!));

                    if(startDate && incomeDate < getDateWithoutTime(new Date(startDate.value))) {
                        dateFilter = false;
                    }

                    if(endDate && incomeDate > getDateWithoutTime(new Date(endDate.value))) {
                        dateFilter = false;
                    }
                }

                return categoryFilter && currencyFilter && amountFilter && dateFilter

            })} ref={gridRef}>
                <GridColumn header="Amount" autoWidth>
                {({ item }) => (
                    <span
                        {...({
                            theme: 'badge success',
                        } satisfies object)}
                    >
                        {Number(item.amount).toFixed(2)}
                    </span>
                )}
                </GridColumn>

                <GridColumn header="Currency" autoWidth>
                    {({item}) => item.currency}
                </GridColumn>

                <GridColumn header="Category" autoWidth>
                    {({item}) => item.category}
                </GridColumn>

                <GridColumn header="Date" autoWidth>
                    {({item}) => item.date}
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
                        value={newIncome.amount.toFixed(2).toString()}
                        onChange={e => setNewIncome({...newIncome, amount: Number(e.target.value)})}
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
                        value={editedIncome.amount.toFixed(2).toString()}
                        onChange={e => setEditedIncome({...editedIncome, amount: Number(e.target.value)})}
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