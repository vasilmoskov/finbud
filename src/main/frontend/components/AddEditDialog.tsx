import { Button, Checkbox, Dialog, Select, TextField, Upload, UploadFile, VerticalLayout } from "@vaadin/react-components";
import { incomeCategoryOptions, currencyOptions, expenseCategoryOptions } from "Frontend/constants/constants";
import TransactionDto from "Frontend/generated/com/example/application/dto/TransactionDto";

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
    onTransactionChange: onTransactionChange, 
    onSave, 
    handleOpenChanged, 
    isEdit,
    documentFile,
    handleUploadBefore
}: Props) {

    const categoryOptions = transactionType === "Income" ? incomeCategoryOptions : expenseCategoryOptions;

    
    return (
        <Dialog
        headerTitle={isEdit ? `Edit ${transactionType}` : `Add ${transactionType}`}
        opened={opened}
        onOpenedChanged={({detail}) => handleOpenChanged(detail.value)}
        footerRenderer={() => (
            <>
                <Button onClick={() => handleOpenChanged(false)}>Cancel</Button>
                <Button theme="primary" onClick={onSave}>
                    {isEdit ? "Save" : "Add"}
                </Button>
            </>
        )}
    >
        <VerticalLayout style={{alignItems: 'stretch', width: '18rem', maxWidth: '100%'}}>
            <TextField
                label="Amount"
                value={transaction?.amount!.toFixed(2).toString()}
                onChange={e => onTransactionChange({...transaction, amount: Number(e.target.value)})}
            />
            <Select
                label="Currency"
                value={transaction?.currency}
                items={currencyOptions}
                onValueChanged={e => onTransactionChange({...transaction, currency: e.detail.value})}
            />
            <Select
                label="Category"
                value={transaction?.category}
                items={categoryOptions}
                onValueChanged={e => onTransactionChange({...transaction, category: e.detail.value})}
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