import { UploadFile } from "@vaadin/react-components";
import React, {useEffect, useState} from "react";
import {format} from 'date-fns';
import { useSignal } from "@vaadin/hilla-react-signals";
import TransactionDto from "Frontend/generated/com/example/application/dto/TransactionDto";

interface TransactionService {
    getAll: () => Promise<TransactionDto[]>;
    addTransaction: (amount: number, currency: string, category: string, document: string, unusual: boolean) => Promise<TransactionDto>;
    editTransaction: (id: string, amount: number, currency: string, category: string, document: string, unusual: boolean) => Promise<TransactionDto>;
    deleteTransaction: (id: string) => Promise<void>;
    deleteTransactionDocument: (id: string) => Promise<void>;
    getAllByDatesBetween: (fromDate: string, toDate: string) => Promise<TransactionDto[]>;
}

export const useTransaction = (service: TransactionService) => {
    const gridRef = React.useRef<any>(null);
    const [transactions, setTransactions] = useState<TransactionDto[]>([]);
    const [newTransaction, setNewTransaction] = useState<TransactionDto | null>(null);
    const [editedTransaction, setEditedTransaction] = useState<TransactionDto>({id: '', amount: 0, currency: 'лв.', category: 'Other', date: '', document: undefined, unusual: false});
    const [confirmDialogOpened, setConfirmDialogOpened] = useState(false);
    const [confirmDocumentDialogOpened, setConfirmDocumentDialogOpened] = useState(false);
    const [addDialogOpened, setAddDialogOpened] = useState(false);
    const [editDialogOpened, setEditDialogOpened] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionDto | null>(null);
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
    const [transactionWithDocumentToRemove, setTransactionWithDocumentToRemove] = useState<TransactionDto | null>(null);
    // const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        service.getAll().then(transactions => setTransactions(transactions));

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

    const handleEdit = (transaction: TransactionDto) => {
        editedTransaction.id = transaction.id;
        editedTransaction.amount = transaction.amount;
        editedTransaction.currency = transaction.currency;
        editedTransaction.category = transaction.category;
        editedTransaction.date = transaction.date;
        editedTransaction.document = transaction.document;
        editedTransaction.unusual = transaction.unusual

        setEditedTransaction({
            ...editedTransaction,
            id: transaction.id,
            amount: transaction.amount,
            currency: transaction.currency,
            category: transaction.category,
            date: transaction.date,
            document: transaction.document,
            unusual: transaction.unusual
        });

        setEditDialogOpened(true);
    };

    const handleDelete = (transaction: TransactionDto) => {
        setSelectedTransaction(transaction);
        setConfirmDialogOpened(true);
    };

    const confirmDelete = () => {
        if (selectedTransaction) {
            const previousTransactions = [...transactions];
            const updatedTransactions = transactions.filter(i => i.id !== selectedTransaction.id);
            setTransactions(updatedTransactions);
            service.deleteTransaction(selectedTransaction.id!).catch(() => setTransactions(previousTransactions));

            setSelectedTransaction(null);
            setConfirmDialogOpened(false);
        }
    };

    const addNewTransaction = () => {
        const transaction: TransactionDto = {
            amount: newTransaction!.amount,
            currency: newTransaction!.currency,
            category: newTransaction!.category,
            date: format(new Date(), "dd MMM yyyy HH:mm:ss"),
            document: newTransaction!.document,
            unusual: newTransaction!.unusual
        };

        const previousTransactions = [...transactions];

        setTransactions([...transactions, transaction]);

        setDocumentFile([]);
        setNewTransaction(null);
        setAddDialogOpened(false);

        service.addTransaction(transaction.amount!, transaction.currency!, transaction.category!, transaction.document?.content!, transaction.unusual)
            .then((savedTransaction) => {
                    transaction.id = savedTransaction.id

                    if(transaction.document != null) {
                        transaction.document.id = savedTransaction.document!.id;
                    }

                    setTransactions([...transactions, transaction]);
                }
            )
            .catch(() => {
                setTransactions(previousTransactions);
                setNewTransaction(transaction);
                setAddDialogOpened(true);
            })
        
    };

    const editExistingTransaction = () => {
        const transaction: TransactionDto = {
            id: editedTransaction.id,
            amount: editedTransaction.amount,
            currency: editedTransaction.currency,
            category: editedTransaction.category,
            date: editedTransaction.date,
            document: editedTransaction.document,
            unusual: editedTransaction.unusual
        };

        const previousTransactions = [...transactions];

        setTransactions(transactions.map(i => i.id === transaction.id ? transaction : i));

        setEditDialogOpened(false);

        service.editTransaction(transaction.id!, transaction.amount!, transaction.currency!, transaction.category!, transaction.document?.content!, transaction.unusual)
            .then(() => {
                setDocumentFile([]);
            })
            .catch(() => {
                setTransactions(previousTransactions);
                setEditedTransaction(transaction);
                setEditDialogOpened(true);
            })
    };

    const handleAddDialogOpenedChanged = (detailValue: boolean) => {        
        setAddDialogOpened(detailValue);

        if (!detailValue) {
            setNewTransaction(null);
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
                setNewTransaction({...newTransaction!, document: {content: reader.result as string}});
            } else if (context === 'edit') {
                setEditedTransaction({...editedTransaction, document: {content: reader.result as string}});
            }

        };
        reader.readAsDataURL(file);
    };

    const handleRemoveDocument = (transaction: TransactionDto) => {
        setTransactionWithDocumentToRemove(transaction);
        setConfirmDocumentDialogOpened(true);
      };
    
    const confirmRemoveDocument = () => {
        if(transactionWithDocumentToRemove == null) {
            return;
        }

        transactionWithDocumentToRemove.document = undefined;

        const previousTransactions = [...transactions];

        setTransactions(transactions.map(i => i.id === transactionWithDocumentToRemove.id ? transactionWithDocumentToRemove : i));

        setConfirmDocumentDialogOpened(false);

        service.deleteTransactionDocument(transactionWithDocumentToRemove.id!)
            .catch(() => {
                setTransactions(previousTransactions);
                setConfirmDocumentDialogOpened(true);
            })
    };

    const fetchTransactionsByDates = async (fromDate: string, toDate: string): Promise<TransactionDto[]> => {
        return await service.getAllByDatesBetween(fromDate, toDate);
    }

    return {
        gridRef,
        transactions,
        newTransaction,
        setNewTransaction,
        editedTransaction,
        setEditedTransaction,
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
        addNewTransaction,
        editExistingTransaction,
        handleAddDialogOpenedChanged,
        handleEditDialogOpenedChanged,
        handleUploadBefore,
        handleRemoveDocument,
        confirmRemoveDocument,
        fetchTransactionsByDates
    };
}