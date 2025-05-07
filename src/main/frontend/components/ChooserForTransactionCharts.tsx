import {
  Button,
  DatePicker,
  DatePickerElement,
  Select,
} from "@vaadin/react-components";
import { currencyOptions, STORAGE_KEYS } from "Frontend/constants/constants";
import { useExpense } from "Frontend/hooks/useExpense";
import { useIncome } from "Frontend/hooks/useIncome";
import {
  accumulateTransactionsByCategory,
  formatDateForDatePicker,
  parseDateForDatePicker,
} from "Frontend/util/transactionUtils";
import { useEffect, useRef } from "react";
import { useSignal } from "@vaadin/hilla-react-signals";
import { format, startOfMonth, parse, isValid } from "date-fns";
import TransactionDto from "Frontend/generated/com/example/application/dto/TransactionDto";

interface Props {
  expensesByDates: TransactionDto[];
  setExpensesByDates: (transactions: TransactionDto[]) => void;
  incomesByDates: TransactionDto[];
  setIncomesByDates: (transactions: TransactionDto[]) => void;
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
  const getInitialDates = () => {
    const savedStartDate = localStorage.getItem(STORAGE_KEYS.START_DATE);
    const savedEndDate = localStorage.getItem(STORAGE_KEYS.END_DATE);
    
    if (savedStartDate && savedEndDate) {
      return {
        start: savedStartDate,
        end: savedEndDate
      };
    }
    
    const today = new Date();
    return {
      start: format(startOfMonth(today), "yyyy-MM-dd"),
      end: format(today, "yyyy-MM-dd")
    };
  };

  const initialDates = getInitialDates();
  const startDate = useSignal(initialDates.start);
  const endDate = useSignal(initialDates.end);

  const startDatePickerRef = useRef<DatePickerElement>(null);
  const endDatePickerRef = useRef<DatePickerElement>(null);

  const { fetchTransactionsByDates: fetchExpensesByDates } = useExpense();
  const { fetchTransactionsByDates: fetchIncomesByDates } = useIncome();

  const fetchData = async (start: string, end: string) => {
    try {
      let startDateObj, endDateObj;

      try {
        startDateObj = parse(start, "yyyy-MM-dd", new Date());
        endDateObj = parse(end, "yyyy-MM-dd", new Date());
      } catch (parseError) {
        return;
      }

      if (!isValid(startDateObj) || !isValid(endDateObj)) {
        return;
      }

      const formattedStartDate = format(startDateObj, "yyyy-MM-dd");
      const formattedEndDate = format(endDateObj, "yyyy-MM-dd");

      const expenses = await fetchExpensesByDates(formattedStartDate, formattedEndDate);
      setExpensesByDates(expenses);

      const accumulatedExpenses = accumulateTransactionsByCategory(
        expenses,
        selectedCurrency
      );
      setTotalExpensesByCategory(accumulatedExpenses);

      const incomes = await fetchIncomesByDates(formattedStartDate, formattedEndDate);
      setIncomesByDates(incomes);

      const accumulatedIncomes = accumulateTransactionsByCategory(
        incomes,
        selectedCurrency
      );
      setTotalIncomesByCategory(accumulatedIncomes);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    const savedCurrency = localStorage.getItem(STORAGE_KEYS.CURRENCY);
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency);
    }
  }, []);

  const handleFetchTransactions = async () => {
    if (!startDate.value || !endDate.value) {
      return;
    }

    localStorage.setItem(STORAGE_KEYS.START_DATE, startDate.value);
    localStorage.setItem(STORAGE_KEYS.END_DATE, endDate.value);

    await fetchData(startDate.value, endDate.value);
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

  useEffect(() => {
    fetchData(startDate.value, endDate.value);
  }, []);

  return (
    <div
      className="flex flex-col items-center mb-4"
      style={{ marginTop: "1rem", marginBottom: "1rem" }}
    >
      <h5 style={{ margin: "1rem" }}>
        Choose a date range to explore your finances:
      </h5>
      <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
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
          theme="contrast"
          onClick={() => handleFetchTransactions()}
          disabled={!startDate.value || !endDate.value}
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
                const newCurrency = e.detail.value;
                setSelectedCurrency(newCurrency);
                localStorage.setItem(STORAGE_KEYS.CURRENCY, newCurrency);

                const accumulatedExpenses = accumulateTransactionsByCategory(
                  expensesByDates,
                  newCurrency
                );
                setTotalExpensesByCategory(accumulatedExpenses);

                const accumulatedIncomes = accumulateTransactionsByCategory(
                  incomesByDates,
                  newCurrency
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
