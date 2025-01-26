import {
    Checkbox,
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
    Upload,
    UploadFile,
    VerticalLayout
} from "@vaadin/react-components";
import React, {useEffect, useRef, useState} from "react";
import IncomeEntity from "Frontend/generated/com/example/application/data/IncomeEntity";
import {deleteIncome, getAll, addIncome, editIncome} from "Frontend/generated/IncomeServiceImpl";
import {ViewConfig} from "@vaadin/hilla-file-router/types.js";
import {Button} from "@vaadin/react-components/Button.js";
import {TextField} from "@vaadin/react-components/TextField.js";
import {format, parse} from 'date-fns';
import { useSignal } from "@vaadin/hilla-react-signals";
import { IncomeDto } from "Frontend/types/IncomeDto";
import IncomeButtonRenderer from "Frontend/components/IncomeButtonRenderer";
import { visualizeDocument } from "Frontend/util/documentUtils";

export const config: ViewConfig = {
    menu: {order: 1, icon: 'line-awesome/svg/file.svg'},
    title: 'Incomes',
    loginRequired: true,
};

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

const usualityFilteringOptions : SelectItem[] = [
    { label: 'All', value: 'All' },
    { label: 'Usual', value: 'usual' },
    { label: 'Unusual', value: 'unusual' }
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
        date: income.date ? formatDate(income.date) : '',
        document: income.document,
        unusual: income.unusual
    };
};

const currencyOptions: SelectItem[] = Object.values(currencyCodesToSigns).map(value => ({
    label: value,
    value: value
}));

export default function IncomeView() {
    const gridRef = React.useRef<any>(null);
    const [incomes, setIncomes] = useState<IncomeDto[]>([]);
    const [newIncome, setNewIncome] = useState<IncomeDto>({id: '', amount: 0, currency: 'Other', category: 'Other', date: '', document: '', unusual: false});
    const [editedIncome, setEditedIncome] = useState<IncomeDto>({id: '', amount: 0, currency: 'Other', category: 'Other', date: '', unusual: false});
    const [confirmDialogOpened, setConfirmDialogOpened] = useState(false);
    const [addDialogOpened, setAddDialogOpened] = useState(false);
    const [editDialogOpened, setEditDialogOpened] = useState(false);
    const [selectedIncome, setSelectedIncome] = useState<IncomeDto | null>(null);

    const [filtersVisible, setFiltersVisible] = useState(false);

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
        editedIncome.unusual = income.unusual

        setEditedIncome({
            id: income.id,
            amount: income.amount,
            currency: income.currency,
            category: income.category,
            date: income.date,
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
        setNewIncome({id: '', amount: 0, currency: 'Other', category: 'Other', date: '', document: '', unusual: false});
        setAddDialogOpened(false);

        addIncome(income.amount, currencySignsToCodes[income.currency], income.category.toUpperCase(), income.document!, income.unusual)
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
            id: editedIncome.id,
            amount: editedIncome.amount,
            currency: editedIncome.currency,
            category: editedIncome.category,
            date: editedIncome.date,
            unusual: editedIncome.unusual
        };

        const previousIncomes = [...incomes];

        setIncomes(incomes.map(i => i.id === income.id ? income : i));

        // setEditedIncome({id: '', amount: '', category: 'Other', date: ''});
        setEditDialogOpened(false);

        editIncome(income.id!, income.amount, currencySignsToCodes[income.currency], income.category.toUpperCase(), income.unusual)
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
            newIncome.document = '';
            newIncome.unusual = false;

            setNewIncome({...newIncome, id: '', amount: 0, currency: 'Other', category: 'Other', date: '', document: '', unusual: false});
            setDocumentFile([]);
        }
    };

    const handleEditDialogOpenedChanged = (detailValue: boolean) => {
        setEditDialogOpened(detailValue);
    };

    const handleUploadBefore = async (e: CustomEvent) => {
        const file = e.detail.file as UploadFile;
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = () => {
            setDocumentFile(Array.of(file))
            setNewIncome({...newIncome, document: reader.result as string});
        };
        reader.readAsDataURL(file);
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

            <Button 
                theme="success" 
                onClick={() => setFiltersVisible(!filtersVisible)} 
                style={{marginLeft: '1rem', marginTop: '1rem', marginBottom: '1rem'}}
            >
                {filtersVisible ? 'Hide Filters' : 'Show Filters'}
                <Icon icon={`vaadin:${filtersVisible ? 'angle-down' : 'angle-right'}`}/>
            </Button>

            <Button 
                theme="success" 
                disabled={areFiltersDefault()} 
                onClick={() => clearFilters()} 
                style={{marginLeft: '1rem', marginTop: '1rem', marginBottom: '1rem'}}
            >
                Clear Filters
                <i className="fa-solid fa-broom" style={{ marginLeft: '0.5rem' }}></i>
            </Button>

            {filtersVisible && (

                <div style={{display: 'flex', alignItems: 'start', marginBottom: '1rem'}}>
                    <div style={{display: 'flex', flexDirection: 'column', marginLeft: '1rem'}}>
                        <label style={{marginRight: '0.5rem'}}>Filter by amount:</label>
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

                    <div style={{display: 'flex', flexDirection: 'column', marginLeft: '1rem'}}>

                        <label style={{marginRight: '0.5rem'}}>Filter by currency:</label>

                        <Select
                            items={currencyFilteringOptions}
                            value={selectedCurrency}
                            onValueChanged={e => setSelectedCurrency(e.detail.value)}
                            style={{maxWidth: '200px'}}

                        />
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column', marginLeft: '1rem'}}>
                        <label style={{marginRight: '0.5rem'}}>Filter by catergory:</label>
                        <Select
                            items={categoryFilteringOptions}
                            value={selectedCategory}
                            onValueChanged={e => setSelectedCategory(e.detail.value)}
                            style={{maxWidth: '200px'}}
                        />
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', marginLeft: '1rem'}}>
                        <label style={{marginRight: '0.5rem'}}>Filter by date:</label>
                        <DatePicker
                            ref={startDatePickerRef}
                            placeholder="From"
                            value={startDate.value}
                            onValueChanged={(e) => {
                                startDate.value = e.detail.value;
                                setIsStartDateSelected(!!e.detail.value);
                            }}
                            style={{maxWidth: '200px'}}
                        />
                        <DatePicker
                            ref={endDatePickerRef}
                            placeholder="To"
                            value={endDate.value}
                            onValueChanged={(e) => {
                                endDate.value = e.detail.value;
                                setIsEndDateSelected(!!e.detail.value);
                            }}
                            style={{maxWidth: '200px'}}
                        />
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', marginLeft: '1rem'}}>
                        <label style={{marginRight: '0.5rem'}}>Filter by usuality:</label>
                        <Select
                            items={usualityFilteringOptions}
                            value={selectedByUsuality}
                            onValueChanged={e => setSelectedByUsuality(e.detail.value)}
                            style={{maxWidth: '200px'}}
                        />
                    </div>
                </div>
            )}
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
                    />
                  )}
                </GridColumn>
            </Grid>

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
                    <Upload
                        files={documentFile}
                        accept=".pdf"
                        maxFiles={1}
                        onUploadBefore={handleUploadBefore}
                    />
                    <Checkbox 
                        label="This income is unusual" 
                        checked={newIncome.unusual}
                        onChange={e => setNewIncome({...newIncome, unusual: e.target.checked})}/>
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
                    <Checkbox 
                        label="This income is unusual" 
                        checked={editedIncome.unusual}
                        onChange={e => setEditedIncome({...editedIncome, unusual: e.target.checked})}
                    />
                </VerticalLayout>
            </Dialog>

        </>
    );
}