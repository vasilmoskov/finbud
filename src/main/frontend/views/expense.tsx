import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, Icon } from '@vaadin/react-components';
import AddEditDialog from 'Frontend/components/AddEditDialog';
import ConfirmDeleteDialog from 'Frontend/components/ConfirmDeleteDialog';
import TransactionFilters from 'Frontend/components/TransactionFilters';
import TransactionGrid from 'Frontend/components/TransactionGrid';
import { useExpenseViewState } from 'Frontend/hooks/useExpenseViewState';

export const config: ViewConfig = {
  menu: { order: 2, icon: 'vaadin:minus-circle-o' },
  title: 'Expenses',
  loginRequired: true,
};

export default function ExpenseView() {
      const {
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
        confirmRemoveDocument
      } = useExpenseViewState();

    const buttonTheme = 'error';

    return (
        <>
            <Button
                theme={buttonTheme}
                onClick={() => handleAddDialogOpenedChanged(true)}
                style={{marginLeft: '1rem', marginTop: '1rem', marginBottom: '1rem'}}
            >
                Add Expense
                <Icon icon="vaadin:minus-circle-o"/>
            </Button>

            <TransactionFilters
                transactionType='expense'
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
                transactions={expenses}
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
                message="Are you sure you want to delete this expense?"
              opened={confirmDialogOpened} onConfirm={confirmDelete} onCancel={() => setConfirmDialogOpened(false)}>
            </ConfirmDeleteDialog>

            <ConfirmDeleteDialog
                message="Are you sure you want to delete the document attached to this expense?"
              opened={confirmDocumentDialogOpened} onConfirm={confirmRemoveDocument} onCancel={() => setConfirmDocumentDialogOpened(false)}>
            </ConfirmDeleteDialog>

            <AddEditDialog
                transactionType='Expense'
                opened={addDialogOpened}
                transaction={newExpense}
                onTransactionChange={setNewExpense}
                onSave={addNewExpense}
                handleOpenChanged={(value) => handleAddDialogOpenedChanged(value)}
                isEdit={false}
                documentFile={documentFile}
                handleUploadBefore={(e) => handleUploadBefore(e, 'add')}
            ></AddEditDialog>

            <AddEditDialog
                transactionType='Expense'
                opened={editDialogOpened}
                transaction={editedExpense}
                onTransactionChange={setEditedExpense}
                onSave={editExistingExpense}
                handleOpenChanged={(value) => handleEditDialogOpenedChanged(value)}
                isEdit={true}
                documentFile={documentFile}
                handleUploadBefore={(e) => handleUploadBefore(e, 'edit')}
            ></AddEditDialog>
        </>
    );
}
