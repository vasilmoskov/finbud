import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import TransactionChart from 'Frontend/components/TransactionChart';
import ChooserForTransactionCharts from 'Frontend/components/ChooserForTransactionCharts';
import { useState } from 'react';
import TransactionDto from 'Frontend/generated/com/example/application/dto/TransactionDto';

export const config: ViewConfig = {
  menu: { order: 0, icon: 'fa-solid fa-chart-pie' },
  title: 'Charts',
  loginRequired: true,
};

export default function DashboardsView() {
  const [selectedCurrency, setSelectedCurrency] = useState('лв.');
  const [totalExpensesByCategory, setTotalExpensesByCategory] = useState<{ name: string; value: number }[]>([]);
  const [totalIncomesByCategory, setTotalIncomesByCategory] = useState<{ name: string; value: number }[]>([]);
  const [expensesByDates, setExpensesByDates] = useState<TransactionDto[]>([]);
  const [incomesByDates, setIncomesByDates] = useState<TransactionDto[]>([]);

  return (
    <>
      <ChooserForTransactionCharts
        expensesByDates={expensesByDates}
        setExpensesByDates={setExpensesByDates}
        incomesByDates={incomesByDates}
        setIncomesByDates={setIncomesByDates}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        setTotalExpensesByCategory={setTotalExpensesByCategory}
        setTotalIncomesByCategory={setTotalIncomesByCategory}
      />

      <div className="flex flex-row justify-around w-full">
        <TransactionChart
          transactionType='Incomes'
          transactionsByDates={incomesByDates}
          totalTransactionsByCategory={totalIncomesByCategory}
          currency={selectedCurrency}
        />

        <TransactionChart
          transactionType='Expenses'
          transactionsByDates={expensesByDates}
          totalTransactionsByCategory={totalExpensesByCategory}
          currency={selectedCurrency}
        />
      </div>
    </>
  );
}
