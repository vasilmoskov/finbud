import { UploadFile } from "@vaadin/react-components";
import React, {useEffect, useState} from "react";
import {deleteIncome, getAll, addIncome, editIncome, deleteIncomeDocument} from "Frontend/generated/IncomeServiceImpl";
import {format} from 'date-fns';
import { useSignal } from "@vaadin/hilla-react-signals";
import { Transaction } from "Frontend/types/Transaction";
import { mapIncomeEntityToDto} from "Frontend/util/incomeUtils";
import { currencySignsToCodes } from "Frontend/constants/constants";

export const useIncomeViwState = () => {
    const gridRef = React.useRef<any>(null);
    const [incomes, setIncomes] = useState<Transaction[]>([]);
    const [newIncome, setNewIncome] = useState<Transaction>({id: '', amount: 0, currency: 'Other', category: 'Other', date: '', document: null, unusual: false});
    const [editedIncome, setEditedIncome] = useState<Transaction>({id: '', amount: 0, currency: 'Other', category: 'Other', date: '', document: null, unusual: false});
    const [confirmDialogOpened, setConfirmDialogOpened] = useState(false);
    const [confirmDocumentDialogOpened, setConfirmDocumentDialogOpened] = useState(false);
    const [addDialogOpened, setAddDialogOpened] = useState(false);
    const [editDialogOpened, setEditDialogOpened] = useState(false);
    const [selectedIncome, setSelectedIncome] = useState<Transaction | null>(null);
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
    const [incomeWithDocumentToRemove, setIncomeWithDocumentToRemove] = useState<Transaction | null>(null);

    useEffect(() => {
        getAll().then(incomes => {
            const mappedIncomes = incomes.map(mapIncomeEntityToDto);
            setIncomes(mappedIncomes)
        });

        setTimeout(() => {
            gridRef.current?.recalculateColumnWidths();
        }, 100);
    }, []);

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

    const handleEdit = (income: Transaction) => {
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

    const handleDelete = (income: Transaction) => {
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
        const income: Transaction = {
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

    const editExistingIncome = () => {
        const income: Transaction = {
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

    const handleAddDialogOpenedChanged = (detailValue: boolean) => {
        console.log(detailValue);
        
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

    const handleRemoveDocument = (income: Transaction) => {
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

    return {
        gridRef,
        incomes,
        newIncome,
        setNewIncome,
        editedIncome,
        setEditedIncome,
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
        addNewIncome,
        editExistingIncome,
        handleAddDialogOpenedChanged,
        handleEditDialogOpenedChanged,
        handleUploadBefore,
        handleRemoveDocument,
        confirmRemoveDocument
    };
}