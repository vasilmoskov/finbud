import { Button, DatePicker, DatePickerElement, Select } from "@vaadin/react-components";
import { currencyOptions } from "Frontend/constants/constants";
import TransactionDto from "Frontend/generated/com/example/application/dto/TransactionDto";
import { getAllByDatesBetween } from "Frontend/generated/ExpenseServiceImpl";
import { useExpenseViewState } from "Frontend/hooks/useExpenseViewState";
import { DocumentDto } from "Frontend/types/DocumentDto";
import { Transaction } from "Frontend/types/Transaction";
import { formatDateForDatePicker, parseDateForDatePicker } from "Frontend/util/incomeUtils";
import { useEffect, useRef } from "react";

interface Props {
    transactionsByDates: Transaction[],
    setTransactionsByDates: (transactions: Transaction[]) => void;
    selectedCurrency: string;
    setSelectedCurrency: (currency: string) => void;
    setTotalTransactionsByCategory: (transactions: { name: string; value: number }[]) => void;
}

export default function ChooserForTransactionCharts({
    transactionsByDates,
    setTransactionsByDates,
    selectedCurrency,
    setSelectedCurrency,
    setTotalTransactionsByCategory
}: Props) {

    const startDatePickerRef = useRef<DatePickerElement>(null);
    const endDatePickerRef = useRef<DatePickerElement>(null);

    const { startDate } = useExpenseViewState();
    const { endDate } = useExpenseViewState();

    useEffect(() => {
        const datePicker = startDatePickerRef.current;


        if (datePicker) {
            datePicker.i18n = {
                ...datePicker.i18n,
                formatDate: formatDateForDatePicker,
                parseDate: parseDateForDatePicker
            }
        }
    }, [startDatePickerRef.current])

    useEffect(() => {
        const datePicker = endDatePickerRef.current;

        if (datePicker) {
            datePicker.i18n = {
                ...datePicker.i18n,
                formatDate: formatDateForDatePicker,
                parseDate: parseDateForDatePicker
            }
        }
    }, [endDatePickerRef.current])


    const fetchExpensesByDates = () => {
        getAllByDatesBetween(startDate.value, endDate.value).then((expenses) => {
            const mappedExpenses = expenses.map(toDto);
            setTransactionsByDates(mappedExpenses);

            const accumulatedExpenses = accumulateExpensesByCategory(mappedExpenses, selectedCurrency);
            setTotalTransactionsByCategory(accumulatedExpenses);
        });
    }

    const toDto = (dto: TransactionDto): Transaction => {
        let doc: DocumentDto | null = null;

        if (dto.document) {
            doc = {
                id: dto.document.id,
                content: dto.document.content
            }
        }

        return {
            id: dto.id,
            amount: dto.amount!,
            currency: dto.currency!,
            category: dto.category!,
            date: dto.date,
            document: doc,
            unusual: dto.unusual
        };
    };

    const accumulateExpensesByCategory = (expenses: Transaction[], selectedCurrency: string) => {
        const categoryMap = expenses.reduce((acc: { [key: string]: number }, expense: Transaction) => {
            const amountInSelectedCurrency = convertToCurrency(expense.amount, expense.currency, selectedCurrency);

            if (acc[expense.category]) {
                acc[expense.category] += amountInSelectedCurrency;
            } else {
                acc[expense.category] = amountInSelectedCurrency;
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

    return (
        <div className="flex flex-col items-center mb-4" style={{ height: '200px', marginTop: '1rem', marginBottom: '1rem' }}>
            <h5 style={{ margin: '1rem' }}>Choose a date range to explore your finances:</h5>
            <div className="flex flex-row items-center justify-center space-x-4">
                <DatePicker
                    ref={startDatePickerRef}
                    placeholder="From"
                    value={startDate.value}
                    onValueChanged={(e) => {
                        startDate.value = e.detail.value;
                    }}
                    style={{ maxWidth: '200px', marginLeft: '1rem' }}
                />

                <DatePicker
                    ref={endDatePickerRef}
                    placeholder="To"
                    value={endDate.value}
                    onValueChanged={(e) => {
                        endDate.value = e.detail.value;
                    }}
                    style={{ maxWidth: '200px', marginLeft: '1rem' }}
                />

                <Button
                    onClick={() => fetchExpensesByDates()}
                    disabled={startDate.value === '' || endDate.value === ''}
                    style={{ marginLeft: '1rem' }}
                >
                    Display Data
                </Button>
            </div>

            <div className="flex flex-col items-center mb-4">
                {transactionsByDates.length > 0 && (
                    <>
                        <h5 style={{ margin: '1rem' }}>Choose currency for the charts:</h5>
                        <Select
                            value={selectedCurrency}
                            items={currencyOptions}
                            disabled={transactionsByDates.length === 0}
                            style={{ width: '70px' }}
                            onValueChanged={e => {
                                setSelectedCurrency(e.detail.value);
                                const accumulatedExpenses = accumulateExpensesByCategory(transactionsByDates, e.detail.value);
                                setTotalTransactionsByCategory(accumulatedExpenses);
                            }}
                        />
                    </>
                )}
            </div>
        </div>
    )
}