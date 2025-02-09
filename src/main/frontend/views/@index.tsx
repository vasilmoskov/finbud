import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';
import { useExpenseViewState } from 'Frontend/hooks/useExpenseViewState';
import { useEffect, useRef, useState } from 'react';
import { Transaction } from 'Frontend/types/Transaction';
import { Button, DatePicker, DatePickerElement, Select } from '@vaadin/react-components';
import { currencyOptions } from 'Frontend/constants/constants';
import { formatDateForDatePicker, parseDateForDatePicker } from 'Frontend/util/incomeUtils';
import { getAllByDatesBetween } from 'Frontend/generated/ExpenseServiceImpl';
import TransactionDto from 'Frontend/generated/com/example/application/dto/TransactionDto';
import { DocumentDto } from 'Frontend/types/DocumentDto';

export const config: ViewConfig = {
  menu: { order: 0, icon: 'vaadin:pie-chart' },
  title: 'Charts',
  loginRequired: true,
};

const incomesData = [
  { name: "Salary", value: 3000 },
  { name: "Freelance", value: 1200 },
  { name: "Investments", value: 800 },
  { name: "Other", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF"];

type LabelProps = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  index: number;
  value: number;
};



const conversionRates: { [key: string]: { [key: string]: number } } = {
  'лв.': { 'лв.': 1, '€': 0.51, '$': 0.53, '£': 0.43 },
  '€': { '€': 1, 'лв.': 1.96, '$': 1.03, '£': 0.83 },
  '$': { '$': 1, 'лв.': 1.89, '€': 0.97, '£': 0.81 },
  '£': { '£': 1, 'лв.': 2.35, '€': 1.2, '$': 1.24 },
};

const convertToCurrency = (amount: number, fromCurrency: string, toCurrency: string) => {
  const rate = conversionRates[fromCurrency]?.[toCurrency];
  return amount * rate;
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

export default function DashboardsView() {
  const startDatePickerRef = useRef<DatePickerElement>(null);
  const endDatePickerRef = useRef<DatePickerElement>(null);
  const { startDate } = useExpenseViewState();
  const { endDate } = useExpenseViewState();
  const [selectedCurrency, setSelectedCurrency] = useState('лв.');
  const [expensesData, setExpensesData] = useState<{ name: string; value: number }[]>([]);
  const [fetchedExpenses, setFetchedExpenses] = useState<Transaction[]>([]); // should be const

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

  const formatTooltipValue = (value: number) => {
    const total = expensesData.reduce((acc, expense) => acc + expense.value, 0);
    const percent = (value / total) * 100;

    return `${percent.toFixed(2)}%`;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, index, value }: LabelProps) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;

    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill={COLORS[index % COLORS.length]} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${value.toFixed(2)} ${selectedCurrency}`}
      </text>
    );
  };

  const fetchExpensesByDates = () => {
    getAllByDatesBetween(startDate.value, endDate.value).then((expenses) => {
      const mappedExpenses = expenses.map(toDto);
      setFetchedExpenses(mappedExpenses);

      const accumulatedExpenses = accumulateExpensesByCategory(mappedExpenses, selectedCurrency);
      setExpensesData(accumulatedExpenses);
    });
  }

  // this code is duplicated!!! Put logic in  useExpenseViewState
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

  return (
    <>
      <div className="flex flex-col items-center mb-4" style={{ height: '200px', marginTop: '1rem', marginBottom: '1rem' }}>
        <h5 style={{margin: '1rem'}}>Choose a date range to explore your finances:</h5>
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
          {fetchedExpenses.length > 0 && (
            <>
              <h5 style={{margin: '1rem'}}>Choose currency for the charts:</h5>
              <Select
                value={selectedCurrency}
                items={currencyOptions}
                disabled={fetchedExpenses.length === 0}
                style={{ width: '70px' }}
                onValueChanged={e => {
                  setSelectedCurrency(e.detail.value);
                  const accumulatedExpenses = accumulateExpensesByCategory(fetchedExpenses, e.detail.value);
                  setExpensesData(accumulatedExpenses);
                }}
              />
            </>
          )}
        </div>
      </div>

      <div className="flex flex-row justify-around w-full">
        <div className="flex flex-col items-center" style={{ width: '50%' }}>
          <h2>Incomes</h2>
          <PieChart width={500} height={500}>
            <Pie data={incomesData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              labelLine={true}
              label={renderCustomizedLabel}>

              {incomesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}

            </Pie>

            <Tooltip formatter={formatTooltipValue} />
            <Legend />
          </PieChart>
        </div>

        <div className="flex flex-col items-center" style={{ width: '50%' }}>
          <h2>Expenses</h2>

          {fetchedExpenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-lg text-gray-600 mt-4">There are no expenses in the selected date range</p>
            </div>
          ) : (
            <PieChart width={500} height={500}>
              <Pie data={expensesData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label={renderCustomizedLabel}>

                {expensesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}

              </Pie>

              <Tooltip formatter={formatTooltipValue} />
              <Legend />
            </PieChart>
          )}
        </div>
      </div>
    </>
  );
}
