import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Transaction } from 'Frontend/types/Transaction';
import TransactionChart from 'Frontend/components/TransactionChart';
import ChooserForTransactionCharts from 'Frontend/components/ChooserForTransactionCharts';
import { useState } from 'react';

export const config: ViewConfig = {
  menu: { order: 0, icon: 'vaadin:pie-chart' },
  title: 'Charts',
  loginRequired: true,
};

export default function DashboardsView() {
  const [selectedCurrency, setSelectedCurrency] = useState('лв.');
  const [totalTransactionsByCategory, setTotalTransactionsByCategory] = useState<{ name: string; value: number }[]>([]);
  const [transactionsByDates, setTransactionsByDates] = useState<Transaction[]>([]);

  return (
    <>
      <ChooserForTransactionCharts
        transactionsByDates={transactionsByDates}
        setTransactionsByDates={setTransactionsByDates}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        setTotalTransactionsByCategory={setTotalTransactionsByCategory}
      />

      <div className="flex flex-row justify-around w-full">
        <TransactionChart
          transactionType='Incomes'
          transactionsByDates={transactionsByDates}
          totalTransactionsByCategory={totalTransactionsByCategory}
          currency={selectedCurrency}
        />

        <TransactionChart
          transactionType='Expenses'
          transactionsByDates={transactionsByDates}
          totalTransactionsByCategory={totalTransactionsByCategory}
          currency={selectedCurrency}
        />
      </div>
    </>
  );
}
