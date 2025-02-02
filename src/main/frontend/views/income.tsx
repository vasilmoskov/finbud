import { Icon } from "@vaadin/react-components";
import {ViewConfig} from "@vaadin/hilla-file-router/types.js";
import {Button} from "@vaadin/react-components/Button.js";
import ConfirmDeleteDialog from "Frontend/components/ConfirmDeleteDialog";
import AddEditDialog from "Frontend/components/AddEditDialog";
import TransactionFilters from "Frontend/components/TransactionFilters";
import TransactionGrid from "Frontend/components/TransactionGrid";
import { useIncomeViwState } from "Frontend/hooks/useIncomeViewState";

export const config: ViewConfig = {
    menu: {order: 1, icon: 'line-awesome/svg/file.svg'},
    title: 'Incomes',
    loginRequired: true,
};

export default function IncomeView() {
    const {
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
    } = useIncomeViwState();

    const buttonTheme = 'success'

    return (
        <>
            <Button
                theme={buttonTheme}
                onClick={() => handleAddDialogOpenedChanged(true)}
                style={{marginLeft: '1rem', marginTop: '1rem', marginBottom: '1rem'}}
            >
                Add Income
                <Icon icon="vaadin:plus-circle-o"/>
            </Button>

            <TransactionFilters
                transactionType='income'
                areFiltersDefault={areFiltersDefault}
                clearFilters={clearFilters}
                amountFilterType={amountFilterType}
                setAmountFilterType={setAmountFilterType}
                amountFilterValue={amountFilterValue}
                setAmountFilterValue={setAmountFilterValue}
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                startDate={startDate}
                setIsStartDateSelected={setIsStartDateSelected}
                endDate={endDate}
                setIsEndDateSelected={setIsEndDateSelected}
                selectedByUsuality={selectedByUsuality}
                setSelectedByUsuality={setSelectedByUsuality}
            ></TransactionFilters>

            <TransactionGrid
                buttonTheme={buttonTheme}
                transactions={incomes}
                selectedCategory={selectedCategory}
                selectedCurrency={selectedCurrency}
                selectedByUsuality={selectedByUsuality}
                amountFilterType={amountFilterType}
                amountFilterValue={amountFilterValue}
                startDate={startDate}
                endDate={endDate}
                isStartDateSelected={isStartDateSelected}
                isEndDateSelected={isEndDateSelected}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleRemoveDocument={handleRemoveDocument}
                gridRef={gridRef}
            ></TransactionGrid>

            <ConfirmDeleteDialog
                message="Are you sure you want to delete this income?"
              opened={confirmDialogOpened} onConfirm={confirmDelete} onCancel={() => setConfirmDialogOpened(false)}>
            </ConfirmDeleteDialog>

            <ConfirmDeleteDialog
                message="Are you sure you want to delete the document attached to this income?"
              opened={confirmDocumentDialogOpened} onConfirm={confirmRemoveDocument} onCancel={() => setConfirmDocumentDialogOpened(false)}>
            </ConfirmDeleteDialog>

            <AddEditDialog
                transactionType='Income'
                opened={addDialogOpened}
                transaction={newIncome}
                onTransactionChange={setNewIncome}
                onSave={addNewIncome}
                handleOpenChanged={(value) => handleAddDialogOpenedChanged(value)}
                isEdit={false}
                documentFile={documentFile}
                handleUploadBefore={(e) => handleUploadBefore(e, 'add')}
            ></AddEditDialog>

            <AddEditDialog
                transactionType='Income'
                opened={editDialogOpened}
                transaction={editedIncome}
                onTransactionChange={setEditedIncome}
                onSave={editExistingIncome}
                handleOpenChanged={(value) => handleEditDialogOpenedChanged(value)}
                isEdit={true}
                documentFile={documentFile}
                handleUploadBefore={(e) => handleUploadBefore(e, 'edit')}
            ></AddEditDialog>
        </>
    );
}