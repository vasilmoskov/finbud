import { UploadFile } from "@vaadin/react-components";
import React, {useEffect, useState} from "react";
import {deleteExpense, getAll, addExpense, editExpense, deleteExpenseDocument, getAllByDatesBetween} from "Frontend/generated/ExpenseServiceImpl";
import {format} from 'date-fns';
import { useSignal } from "@vaadin/hilla-react-signals";
import { mapIncomeEntityToDto} from "Frontend/util/incomeUtils";
import { currencySignsToCodes } from "Frontend/constants/constants";
import { Transaction } from "Frontend/types/Transaction";
import TransactionDto from "Frontend/generated/com/example/application/dto/TransactionDto";
import DocumentDto from "Frontend/generated/com/example/application/dto/DocumentDto";

export const useExpenseViewState = () => {
    const gridRef = React.useRef<any>(null);
    const [expenses, setExpenses] = useState<Transaction[]>([]);
    const [newExpense, setNewExpense] = useState<Transaction>({id: '', amount: 0, currency: 'лв.', category: 'Other', date: '', document: null, unusual: false});
    const [editedExpense, setEditedExpense] = useState<Transaction>({id: '', amount: 0, currency: 'лв.', category: 'Other', date: '', document: null, unusual: false});
    const [confirmDialogOpened, setConfirmDialogOpened] = useState(false);
    const [confirmDocumentDialogOpened, setConfirmDocumentDialogOpened] = useState(false);
    const [addDialogOpened, setAddDialogOpened] = useState(false);
    const [editDialogOpened, setEditDialogOpened] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<Transaction | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedCurrency, setSelectedCurrency] = useState<string>('All');
    const [amountFilterType, setAmountFilterType] = useState<string>('>');
    const [amountFilterValue, setAmountFilterValue] = useState<number>(0);
    const startDate = useSignal(format(new Date(), 'dd/MM/yyyy'));
    const endDate = useSignal(format(new Date(), 'dd/MM/yyyy'));
    const [isStartDateSelected, setIsStartDateSelected] = useState(false);
    const [isEndDateSelected, setIsEndDateSelected] = useState(false);
    const [selectedByUsuality, setSelectedByUsuality] = useState<string>('All');
    const [documentFile, setDocumentFile] = useState<UploadFile[]>([]);
    const [expenseWithDocumentToRemove, setExpenseWithDocumentToRemove] = useState<Transaction | null>(null);
    
    useEffect(() => {
        getAll().then(expenses => {
            const mappedIncomes = expenses.map(toDto);
            
            setExpenses(mappedIncomes)
        });

        setTimeout(() => {
            gridRef.current?.recalculateColumnWidths();
        }, 100);
    }, []);

    const toDto = (dto: TransactionDto): Transaction => {
        let doc: DocumentDto | null = null;

        if(dto.document) {
            doc = {
                id: dto.document.id,
                content: dto.document.content
            }
        }

        return {
            id: dto.id,
            amount: dto.amount!,
            currency: dto.currency!,
            category: dto.category!,
            date: dto.date,
            document: doc,
            unusual: dto.unusual
        };
    };
    

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

    const handleEdit = (expense: Transaction) => {
        editedExpense.id = expense.id;
        editedExpense.amount = expense.amount;
        editedExpense.currency = expense.currency;
        editedExpense.category = expense.category;
        editedExpense.date = expense.date;
        editedExpense.document = expense.document;
        editedExpense.unusual = expense.unusual

        setEditedExpense({
            id: expense.id,
            amount: expense.amount,
            currency: expense.currency,
            category: expense.category,
            date: expense.date,
            document: expense.document,
            unusual: expense.unusual
        });

        setEditDialogOpened(true);
    };

    const handleDelete = (expense: Transaction) => {
        setSelectedExpense(expense);
        setConfirmDialogOpened(true);
    };

    const confirmDelete = () => {
        if (selectedExpense) {
            const previousExpenses = [...expenses];
            const updatedExpenses = expenses.filter(i => i.id !== selectedExpense.id);
            setExpenses(updatedExpenses);
            deleteExpense(selectedExpense.id!).catch(() => setExpenses(previousExpenses));

            setSelectedExpense(null);
            setConfirmDialogOpened(false);
        }
    };

    const addNewExpense = () => {
        const expense: Transaction = {
            amount: newExpense.amount,
            currency: newExpense.currency,
            category: newExpense.category,
            date: format(new Date(), "dd MMM yyyy HH:mm:ss"),
            document: newExpense.document,
            unusual: newExpense.unusual
        };

        const previousExpenses = [...expenses];

        setExpenses([...expenses, expense]);

        setDocumentFile([]);
        setNewExpense({id: '', amount: 0, currency: 'лв.', category: 'Other', date: '', document: null, unusual: false});
        setAddDialogOpened(false);

        addExpense(expense.amount, expense.currency, expense.category, expense.document?.content!, expense.unusual)
            .then((savedExpense) => {
                    expense.id = savedExpense.id

                    if(expense.document != null) {
                        expense.document.id = savedExpense.document.id;
                    }

                    setExpenses([...expenses, expense]);
                }
            )
            .catch(() => {
                setExpenses(previousExpenses);
                setNewExpense(expense);
                setAddDialogOpened(true);
            })
        
    };

    const editExistingExpense = () => {
        const expense: Transaction = {
            id: editedExpense.id,
            amount: editedExpense.amount,
            currency: editedExpense.currency,
            category: editedExpense.category,
            date: editedExpense.date,
            document: editedExpense.document,
            unusual: editedExpense.unusual
        };


        const previousExpenses = [...expenses];

        setExpenses(expenses.map(i => i.id === expense.id ? expense : i));

        setEditDialogOpened(false);

        editExpense(expense.id!, expense.amount, expense.currency, expense.category, expense.document?.content!, expense.unusual)
            .then(() => {
                setDocumentFile([]);
            })
            .catch(() => {
                setExpenses(previousExpenses);
                setEditedExpense(expense);
                setEditDialogOpened(true);
            })
    };

    const handleAddDialogOpenedChanged = (detailValue: boolean) => {
        console.log(detailValue);
        
        setAddDialogOpened(detailValue);

        if (!detailValue) {
            setNewExpense({...newExpense, id: '', amount: 0, currency: 'лв.', category: 'Other', date: '', document: null, unusual: false});
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
                setNewExpense({...newExpense, document: {content: reader.result as string}});
            } else if (context === 'edit') {
                setEditedExpense({...editedExpense, document: {content: reader.result as string}});
            }

        };
        reader.readAsDataURL(file);
    };

    const handleRemoveDocument = (expense: Transaction) => {
        setExpenseWithDocumentToRemove(expense);
        setConfirmDocumentDialogOpened(true);
      };
    
    const confirmRemoveDocument = () => {
        if(expenseWithDocumentToRemove == null) {
            return;
        }

        expenseWithDocumentToRemove.document = null;

        const previousExpenses = [...expenses];

        setExpenses(expenses.map(i => i.id === expenseWithDocumentToRemove.id ? expenseWithDocumentToRemove : i));

        setConfirmDocumentDialogOpened(false);

        deleteExpenseDocument(expenseWithDocumentToRemove.id!)
            .catch(() => {
                setExpenses(previousExpenses);
                setConfirmDocumentDialogOpened(true);
            })
    };

    const fetchExpensesByDates = async (fromDate: string, toDate: string): Promise<Transaction[]> => {
        const expenses = await getAllByDatesBetween(fromDate, toDate);
        return expenses.map(toDto);
    }

    const accumulateExpensesByCategory = (expenses: Transaction[], selectedCurrency: string) => {
        const categoryMap = expenses.reduce((acc: { [key: string]: number }, expense: Transaction) => {
            const amountInSelectedCurrency = convertToCurrency(expense.amount, expense.currency, selectedCurrency);

            if (acc[expense.category]) {
                acc[expense.category] += amountInSelectedCurrency;
            } else {
                acc[expense.category] = amountInSelectedCurrency;
            }

            return acc;
        }, {});

        return Object.keys(categoryMap).map(category => ({
            name: category,
            value: categoryMap[category]
        }));
    };

    const convertToCurrency = (amount: number, fromCurrency: string, toCurrency: string) => {
        const rate = conversionRates[fromCurrency]?.[toCurrency];
        return amount * rate;
    };

    const conversionRates: { [key: string]: { [key: string]: number } } = {
        'лв.': { 'лв.': 1, '€': 0.51, '$': 0.53, '£': 0.43 },
        '€': { '€': 1, 'лв.': 1.96, '$': 1.03, '£': 0.83 },
        '$': { '$': 1, 'лв.': 1.89, '€': 0.97, '£': 0.81 },
        '£': { '£': 1, 'лв.': 2.35, '€': 1.2, '$': 1.24 },
    };

    return {
        gridRef,
        expenses,
        newExpense,
        setNewExpense,
        editedExpense,
        setEditedExpense,
        confirmDialogOpened,
        setConfirmDialogOpened,
        confirmDocumentDialogOpened,
        setConfirmDocumentDialogOpened,
        addDialogOpened,
        editDialogOpened,
        selectedCategory,
        setSelectedCategory,
        selectedCurrency,
        setSelectedCurrency,
        amountFilterType,
        setAmountFilterType,
        amountFilterValue,
        setAmountFilterValue,
        startDate,
        endDate,
        isStartDateSelected,
        setIsStartDateSelected,
        isEndDateSelected,
        setIsEndDateSelected,
        selectedByUsuality,
        setSelectedByUsuality,
        documentFile,
        areFiltersDefault,
        clearFilters,
        handleEdit,
        handleDelete,
        confirmDelete,
        addNewExpense,
        editExistingExpense,
        handleAddDialogOpenedChanged,
        handleEditDialogOpenedChanged,
        handleUploadBefore,
        handleRemoveDocument,
        confirmRemoveDocument,
        fetchExpensesByDates,
        accumulateExpensesByCategory
    };
}