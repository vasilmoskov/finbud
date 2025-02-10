import {
  Button,
  DatePicker,
  DatePickerElement,
  Select,
} from "@vaadin/react-components";
import { currencyOptions } from "Frontend/constants/constants";
import { useExpense } from "Frontend/hooks/useExpense";
import { useIncome } from "Frontend/hooks/useIncome";
import { Transaction } from "Frontend/types/Transaction";
import {
  accumulateTransactionsByCategory,
  formatDateForDatePicker,
  parseDateForDatePicker,
} from "Frontend/util/transactionUtils";
import { useEffect, useRef } from "react";
import { useSignal } from "@vaadin/hilla-react-signals";
import { format } from "date-fns";

interface Props {
  expensesByDates: Transaction[];
  setExpensesByDates: (transactions: Transaction[]) => void;
  incomesByDates: Transaction[];
  setIncomesByDates: (transactions: Transaction[]) => void;
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  setTotalExpensesByCategory: (
    transactions: { name: string; value: number }[]
  ) => void;
  setTotalIncomesByCategory: (
    transactions: { name: string; value: number }[]
  ) => void;
}

export default function ChooserForTransactionCharts({
  expensesByDates,
  setExpensesByDates,
  incomesByDates,
  setIncomesByDates,
  selectedCurrency,
  setSelectedCurrency,
  setTotalExpensesByCategory,
  setTotalIncomesByCategory,
}: Props) {
  const startDate = useSignal(format(new Date(), "dd/MM/yyyy"));
  const endDate = useSignal(format(new Date(), "dd/MM/yyyy"));

  const startDatePickerRef = useRef<DatePickerElement>(null);
  const endDatePickerRef = useRef<DatePickerElement>(null);

  const { fetchTransactionsByDates: fetchExpensesByDates } = useExpense();
  const { fetchTransactionsByDates: fetchIncomesByDates } = useIncome();

  const handleFetchTransactions = async () => {
    const expenses = await fetchExpensesByDates(startDate.value, endDate.value);
    setExpensesByDates(expenses);

    const accumulatedExpenses = accumulateTransactionsByCategory(
      expenses,
      selectedCurrency
    );
    setTotalExpensesByCategory(accumulatedExpenses);

    const incomes = await fetchIncomesByDates(startDate.value, endDate.value);
    setIncomesByDates(incomes);

    const accumulatedIncomes = accumulateTransactionsByCategory(
      incomes,
      selectedCurrency
    );
    setTotalIncomesByCategory(accumulatedIncomes);
  };

  useEffect(() => {
    const datePicker = startDatePickerRef.current;

    if (datePicker) {
      datePicker.i18n = {
        ...datePicker.i18n,
        formatDate: formatDateForDatePicker,
        parseDate: parseDateForDatePicker,
      };
    }
  }, [startDatePickerRef.current]);

  useEffect(() => {
    const datePicker = endDatePickerRef.current;

    if (datePicker) {
      datePicker.i18n = {
        ...datePicker.i18n,
        formatDate: formatDateForDatePicker,
        parseDate: parseDateForDatePicker,
      };
    }
  }, [endDatePickerRef.current]);

  return (
    <div
      className="flex flex-col items-center mb-4"
      style={{ height: "200px", marginTop: "1rem", marginBottom: "1rem" }}
    >
      <h5 style={{ margin: "1rem" }}>
        Choose a date range to explore your finances:
      </h5>
      <div className="flex flex-row items-center justify-center space-x-4">
        <DatePicker
          ref={startDatePickerRef}
          placeholder="From"
          value={startDate.value}
          onValueChanged={(e) => {
            startDate.value = e.detail.value;
          }}
          style={{ maxWidth: "200px", marginLeft: "1rem" }}
        />

        <DatePicker
          ref={endDatePickerRef}
          placeholder="To"
          value={endDate.value}
          onValueChanged={(e) => {
            endDate.value = e.detail.value;
          }}
          style={{ maxWidth: "200px", marginLeft: "1rem" }}
        />

        <Button
          onClick={() => handleFetchTransactions()}
          disabled={startDate.value === "" || endDate.value === ""}
          style={{ marginLeft: "1rem" }}
        >
          Display Data
        </Button>
      </div>

      <div className="flex flex-col items-center mb-4">
        {(expensesByDates.length > 0 || incomesByDates.length > 0) && (
          <>
            <h5 style={{ margin: "1rem" }}>Choose currency for the charts:</h5>
            <Select
              value={selectedCurrency}
              items={currencyOptions}
              disabled={expensesByDates.length === 0}
              style={{ width: "70px" }}
              onValueChanged={(e) => {
                setSelectedCurrency(e.detail.value);

                const accumulatedExpenses = accumulateTransactionsByCategory(
                  expensesByDates,
                  e.detail.value
                );
                setTotalExpensesByCategory(accumulatedExpenses);

                const accumulatedIncomes = accumulateTransactionsByCategory(
                  incomesByDates,
                  e.detail.value
                );
                setTotalIncomesByCategory(accumulatedIncomes);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
