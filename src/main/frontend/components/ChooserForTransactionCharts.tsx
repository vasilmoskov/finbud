import { Button, DatePicker, DatePickerElement, Select } from "@vaadin/react-components";
import { currencyOptions } from "Frontend/constants/constants";
import { useExpenseViewState } from "Frontend/hooks/useExpenseViewState";
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

    const { startDate, endDate, fetchExpensesByDates, accumulateExpensesByCategory } = useExpenseViewState();

    const handleFetchExpenses = async () => {
        const transactions = await fetchExpensesByDates(startDate.value, endDate.value);
        setTransactionsByDates(transactions);

        const accumulatedExpenses = accumulateExpensesByCategory(transactions, selectedCurrency);
        setTotalTransactionsByCategory(accumulatedExpenses);
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
                    onClick={handleFetchExpenses}
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