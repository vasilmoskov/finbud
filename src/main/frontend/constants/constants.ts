import { SelectItem } from "@vaadin/react-components";

export const amountFilterOptions = [
    { label: 'Greater than', value: '>' },
    { label: 'Less than', value: '<' },
    { label: 'Equals', value: '=' }
];

export const incomeCategoriesMap: Record<string, string> = {
    OTHER: "Other",
    SALARY: "Salary",
    SAVINGS: "Savings",
    DEPOSIT: "Deposit",
    BONUS: "Bonus",
    INTEREST: "Interest",
    DIVIDEND: "Dividend",
    GIFT: "Gift",
    PENSION: "Pension",
    SCHOLARSHIP: "Scholarship",
};

export const incomeCategoryOptions: SelectItem[] = Object.values(incomeCategoriesMap).map(value => ({
    label: value,
    value: value
}));

export const incomeCategoryFilteringOptions : SelectItem[] = [
    { label: 'All', value: 'All' },
    ...Object.values(incomeCategoriesMap).map(v => ({ label: v, value: v }))
];

export const expenseCategoriesMap = {
    OTHER: "Other",
    RENT: "Rent",
    UTILITIES: "Utilities",
    GROCERIES: "Groceries",
    TRANSPORTATION: "Transportation",
    HEALTHCARE: "Healthcare",
    ENTERTAINMENT: "Entertainment",
    TRAVEL: "Travel",
    EDUCATION: "Education",
    CLOTHING: "Clothing",
    GIFT: "Gift",
    TAXES: "Taxes"
};

export const expenseCategoryOptions: SelectItem[] = Object.values(expenseCategoriesMap).map(value => ({
    label: value,
    value: value
}));

export const expenseCategoryFilteringOptions : SelectItem[] = [
    { label: 'All', value: 'All' },
    ...Object.values(expenseCategoriesMap).map(v => ({ label: v, value: v }))
];

export const currencyCodesToSigns: Record<string, string> = {
    'BGN': 'лв.',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'OTHER': 'Other'
};

export const currencySignsToCodes: Record<string, string> = Object.fromEntries(
    Object.entries(currencyCodesToSigns).map(([code, sign]) => [sign, code])
);

export const currencyOptions: SelectItem[] = Object.values(currencyCodesToSigns).map(value => ({
    label: value,
    value: value
}));

export const currencyFilteringOptions : SelectItem[] = [
    { label: 'All', value: 'All' },
    ...Object.keys(currencySignsToCodes).map(k => ({ label: k, value: k }))
];

export const usualityFilteringOptions : SelectItem[] = [
    { label: 'All', value: 'All' },
    { label: 'Usual', value: 'usual' },
    { label: 'Unusual', value: 'unusual' }
];

