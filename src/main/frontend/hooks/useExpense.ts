import {deleteExpense, getAll, addExpense, editExpense, deleteExpenseDocument, getAllExpensesByDatesBetween} from "Frontend/generated/ExpenseServiceImpl";
import { useTransaction } from "./useTransaction";

const expenseService = {
    getAll: getAll,
    addTransaction: addExpense,
    editTransaction: editExpense,
    deleteTransaction: deleteExpense,
    deleteTransactionDocument: deleteExpenseDocument,
    getAllByDatesBetween: getAllExpensesByDatesBetween
};

export const useExpense = () => {
    return useTransaction(expenseService);
}