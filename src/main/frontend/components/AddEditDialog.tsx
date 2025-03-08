import { Button, Checkbox, Dialog, Select, TextField, Upload, UploadFile, VerticalLayout } from "@vaadin/react-components";
import { incomeCategoryOptions, currencyOptions, expenseCategoryOptions } from "Frontend/constants/constants";
import TransactionDto from "Frontend/generated/com/example/application/dto/TransactionDto";
import { useEffect, useState } from "react";

interface Props {
    transactionType: "Income" | "Expense",
    opened: boolean,
    transaction: TransactionDto,
    onTransactionChange: (transaction: TransactionDto) => void,
    onSave: () => void,
    handleOpenChanged: (value:boolean) => void,
    isEdit: boolean,
    documentFile: UploadFile[],
    handleUploadBefore: (event: CustomEvent) => void;
}

export default function AddEditDialog({
    transactionType,
    opened, 
    transaction, 
    onTransactionChange, 
    onSave, 
    handleOpenChanged, 
    isEdit,
    documentFile,
    handleUploadBefore
}: Props) {

    const categoryOptions = transactionType === "Income" ? incomeCategoryOptions : expenseCategoryOptions;

    const [isValid, setIsValid] = useState(false);
    const [dialogKey, setDialogKey] = useState(0);

    useEffect(() => {
        const isAmountValid = transaction?.amount !== undefined && transaction.amount > 0;
        const isCurrencyValid = transaction?.currency !== undefined && transaction.currency !== '';
        const isCategoryValid = transaction?.category !== undefined && transaction.category !== '';

        setIsValid(isAmountValid && isCurrencyValid && isCategoryValid);
    }, [transaction]);
    
    const handleDialogClose = (value: boolean) => {
        handleOpenChanged(value);
        
        if (!value) {
            setDialogKey(prevKey => prevKey + 1);
        }
    };

    return (
        <Dialog
        key={dialogKey}
        headerTitle={isEdit ? `Edit ${transactionType}` : `Add ${transactionType}`}
        opened={opened}
        onOpenedChanged={({detail}) => handleDialogClose(detail.value)}
        footerRenderer={() => (
            <>
                <Button onClick={() => handleDialogClose(false)}>Cancel</Button>
                <Button theme="primary" onClick={onSave} disabled={!isValid}>
                    {isEdit ? "Save" : "Add"}
                </Button>
            </>
        )}
    >
        <VerticalLayout style={{alignItems: 'stretch', width: '18rem', maxWidth: '100%'}}>
            <TextField
                label="Amount"
                id="amount-input-field"
                value={transaction?.amount ? transaction?.amount!.toFixed(2).toString() : ''}
                onChange={e => onTransactionChange({...transaction, amount: Number(e.target.value)})}
                required
                errorMessage="Amount is required and must be a positive number"
            />
            <Select
                label="Currency"
                value={transaction?.currency}
                items={currencyOptions}
                onValueChanged={e => onTransactionChange({...transaction, currency: e.detail.value})}
                required
                errorMessage="Currency is required"
            />
            <Select
                label="Category"
                value={transaction?.category}
                items={categoryOptions}
                onValueChanged={e => onTransactionChange({...transaction, category: e.detail.value})}
                required
                errorMessage="Category is required"
            />
            <Upload
                files={documentFile}
                accept=".pdf"
                maxFiles={1}
                onUploadBefore={handleUploadBefore}
            />
            <Checkbox 
                label={`This ${transactionType.toLowerCase()} is unusual`} 
                checked={transaction?.unusual}
                onChange={e => onTransactionChange({...transaction, unusual: e.target.checked})}/>
        </VerticalLayout>
    </Dialog>
    )
}