import {deleteIncome, getAll, addIncome, editIncome, deleteIncomeDocument, getAllIncomesByDatesBetween} from "Frontend/generated/IncomeServiceImpl";
import { useTransaction } from "./useTransaction";

const incomeService = {
    getAll: getAll,
    addTransaction: addIncome,
    editTransaction: editIncome,
    deleteTransaction: deleteIncome,
    deleteTransactionDocument: deleteIncomeDocument,
    getAllByDatesBetween: getAllIncomesByDatesBetween
};

export const useIncome = () => {
    return useTransaction(incomeService);
}