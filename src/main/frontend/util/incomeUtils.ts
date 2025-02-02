import { DatePickerDate } from "@vaadin/react-components";
import { format, parse } from "date-fns";
import { incomeCategoriesMap, currencyCodesToSigns } from "Frontend/constants/constants";
import IncomeEntity from "Frontend/generated/com/example/application/data/IncomeEntity";
import { Transaction } from "Frontend/types/Transaction";

export const formtatCurrency = (currency: string): string => {
    return currencyCodesToSigns[currency] || currency;
}

export const formatCategory = (category: string): string => {
    return incomeCategoriesMap[category] || category;
};

export const formatDate = (dateString: string): string => {
    return format(new Date(dateString), "dd MMM yyyy HH:mm:ss");
};

export const formatDateForDatePicker = (dateParts: DatePickerDate) => {
    const { year, month, day } = dateParts;
    const date = new Date(year, month, day);
  
    return format(date, 'dd/MM/yyyy');
  }

export const parseDateForDatePicker = (inputValue: string) => {
    const date = parse(inputValue, 'dd/MM/yyyy', new Date());
  
    return { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
  }

export const getDateWithoutTime = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const mapIncomeEntityToDto = (income: IncomeEntity): Transaction => {
    return {
        id: income.id,
        amount: income.amount,
        currency: formtatCurrency(income.currency),
        category: formatCategory(income.category),
        date: income.date ? formatDate(income.date) : '',
        document: income.document,
        unusual: income.unusual
    };
};
