import { SelectItem } from "@vaadin/react-components";

export const amountFilterOptions = [
    { label: 'Greater than', value: '>' },
    { label: 'Less than', value: '<' },
    { label: 'Equals', value: '=' }
];

export const categoriesMap: Record<string, string> = {
    'SALARY': 'Salary',
    'SAVINGS': 'Savings',
    'DEPOSIT': 'Deposit',
    'OTHER': 'Other'
};

export const categoryOptions: SelectItem[] = Object.values(categoriesMap).map(value => ({
    label: value,
    value: value
}));

export const categoryFilteringOptions : SelectItem[] = [
    { label: 'All', value: 'All' },
    ...Object.values(categoriesMap).map(v => ({ label: v, value: v }))
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

