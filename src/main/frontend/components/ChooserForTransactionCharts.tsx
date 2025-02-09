import { Button, DatePicker, DatePickerElement, Select } from "@vaadin/react-components";
import { currencyOptions } from "Frontend/constants/constants";
import { useExpenseViewState } from "Frontend/hooks/useExpenseViewState";
import { Transaction } from "Frontend/types/Transaction";
import { formatDateForDatePicker, parseDateForDatePicker } from "Frontend/util/incomeUtils";
import { useEffect, useRef } from "react";

interface Props {
    expensesByDates: Transaction[],
    setExpensesByDates: (transactions: Transaction[]) => void;
    incomesByDates: Transaction[],
    setIncomesByDates: (transactions: Transaction[]) => void;
    selectedCurrency: string;
    setSelectedCurrency: (currency: string) => void;
    setTotalExpensesByCategory: (transactions: { name: string; value: number }[]) => void;
    setTotalIncomesByCategory: (transactions: { name: string; value: number }[]) => void;
}

export default function ChooserForTransactionCharts({
    expensesByDates,
    setExpensesByDates,
    incomesByDates,
    setIncomesByDates,
    selectedCurrency,
    setSelectedCurrency,
    setTotalExpensesByCategory,
    setTotalIncomesByCategory
}: Props) {

    const startDatePickerRef = useRef<DatePickerElement>(null);
    const endDatePickerRef = useRef<DatePickerElement>(null);

    const { startDate, endDate, fetchExpensesByDates, fetchIncomesByDates, accumulateExpensesByCategory } = useExpenseViewState();

    const handleFetchExpenses = async () => {
        const transactions = await fetchExpensesByDates(startDate.value, endDate.value);
        setExpensesByDates(transactions);

        const accumulatedExpenses = accumulateExpensesByCategory(transactions, selectedCurrency);
        setTotalExpensesByCategory(accumulatedExpenses);
    };

    const handleFetchIncomes = async () => {
        const transactions = await fetchIncomesByDates(startDate.value, endDate.value);
        setIncomesByDates(transactions);

        const accumulatedExpenses = accumulateExpensesByCategory(transactions, selectedCurrency);
        setTotalIncomesByCategory(accumulatedExpenses);
    };

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
                    onClick={() => {
                        handleFetchExpenses();
                        handleFetchIncomes();
                    }}
                    disabled={startDate.value === '' || endDate.value === ''}
                    style={{ marginLeft: '1rem' }}
                >
                    Display Data
                </Button>
            </div>

            <div className="flex flex-col items-center mb-4">
                {(expensesByDates.length > 0 || incomesByDates.length > 0) && (
                    <>
                        <h5 style={{ margin: '1rem' }}>Choose currency for the charts:</h5>
                        <Select
                            value={selectedCurrency}
                            items={currencyOptions}
                            disabled={expensesByDates.length === 0}
                            style={{ width: '70px' }}
                            onValueChanged={e => {
                                setSelectedCurrency(e.detail.value);

                                const accumulatedExpenses = accumulateExpensesByCategory(expensesByDates, e.detail.value);
                                setTotalExpensesByCategory(accumulatedExpenses);

                                const accumulatedIncomes = accumulateExpensesByCategory(incomesByDates, e.detail.value);
                                setTotalIncomesByCategory(accumulatedIncomes);

                            }}
                        />
                    </>
                )}
            </div>
        </div>
    )
}