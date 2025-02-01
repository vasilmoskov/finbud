import { Button, Checkbox, Dialog, Select, TextField, Upload, UploadFile, VerticalLayout } from "@vaadin/react-components";
import { categoryOptions, currencyOptions } from "Frontend/constants/incomeConstants";
import { IncomeDto } from "Frontend/types/IncomeDto";

interface Props {
    opened: boolean,
    income: IncomeDto,
    onIncomeChange: (income: IncomeDto) => void,
    onSave: () => void,
    handleOpenChanged: (value:boolean) => void,
    isEdit: boolean,
    documentFile: UploadFile[],
    handleUploadBefore: (event: CustomEvent) => void;
}

export default function AddEditDialog({
    opened, 
    income, 
    onIncomeChange, 
    onSave, 
    handleOpenChanged, 
    isEdit,
    documentFile,
    handleUploadBefore
}: Props) {
    
    return (
        <Dialog
        headerTitle={isEdit ? "Edit Income" : "Add Income"}
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
                value={income.amount.toFixed(2).toString()}
                onChange={e => onIncomeChange({...income, amount: Number(e.target.value)})}
            />
            <Select
                label="Currency"
                value={income.currency}
                items={currencyOptions}
                onValueChanged={e => onIncomeChange({...income, currency: e.detail.value})}
            />
            <Select
                label="Category"
                value={income.category}
                items={categoryOptions}
                onValueChanged={e => onIncomeChange({...income, category: e.detail.value})}
            />
            <Upload
                files={documentFile}
                accept=".pdf"
                maxFiles={1}
                onUploadBefore={handleUploadBefore}
            />
            <Checkbox 
                label="This income is unusual" 
                checked={income.unusual}
                onChange={e => onIncomeChange({...income, unusual: e.target.checked})}/>
        </VerticalLayout>
    </Dialog>
    )
}