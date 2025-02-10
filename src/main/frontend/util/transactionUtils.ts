import { DatePickerDate } from "@vaadin/react-components";
import { format, parse } from "date-fns";
import { incomeCategoriesMap, currencyCodesToSigns } from "Frontend/constants/constants";
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

export const accumulateTransactionsByCategory = (transactions: Transaction[], selectedCurrency: string) => {
    const categoryMap = transactions.reduce((acc: { [key: string]: number }, transaction: Transaction) => {
        const amountInSelectedCurrency = convertToCurrency(transaction.amount, transaction.currency, selectedCurrency);

        if (acc[transaction.category]) {
            acc[transaction.category] += amountInSelectedCurrency;
        } else {
            acc[transaction.category] = amountInSelectedCurrency;
        }

        return acc;
    }, {});

    return Object.keys(categoryMap).map(category => ({
        name: category,
        value: categoryMap[category]
    }));
};

const convertToCurrency = (amount: number, fromCurrency: string, toCurrency: string) => {
    const rate = conversionRates[fromCurrency]?.[toCurrency];
    return amount * rate;
};

const conversionRates: { [key: string]: { [key: string]: number } } = {
    'лв.': { 'лв.': 1, '€': 0.51, '$': 0.53, '£': 0.43 },
    '€': { '€': 1, 'лв.': 1.96, '$': 1.03, '£': 0.83 },
    '$': { '$': 1, 'лв.': 1.89, '€': 0.97, '£': 0.81 },
    '£': { '£': 1, 'лв.': 2.35, '€': 1.2, '$': 1.24 },
};
