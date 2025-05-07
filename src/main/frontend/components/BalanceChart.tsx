import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

type BalanceChartProps = {
    totalExpensesByCategory: { name: string; value: number }[];
    totalIncomesByCategory: { name: string; value: number }[];
    currency: string;
};

export default function BalanceChart({ totalExpensesByCategory, totalIncomesByCategory, currency }: BalanceChartProps) {
    const totalExpenses = totalExpensesByCategory.reduce((sum, item) => sum + item.value, 0);
    const totalIncomes = totalIncomesByCategory.reduce((sum, item) => sum + item.value, 0);
    const balance = totalIncomes - totalExpenses;

    const data = [
        {
            name: 'Balance',
            incomes: totalIncomes,
            expenses: totalExpenses,
            balance: balance
        }
    ];

    const formatTooltipValue = (value: number) => {
        return `${value.toFixed(2)} ${currency}`;
    };

    return (
        <div className="flex flex-col items-center w-full">
            <h2 className="text-center w-full">Balance</h2>

            <div className="w-full flex justify-center">
                {totalExpensesByCategory.length === 0 && totalIncomesByCategory.length === 0 ? (
                    <p className="text-lg text-gray-600 mt-4 text-center">No transactions in the selected date range</p>
                ) : (
                    <div className="w-full" style={{ height: '400px', marginTop: '1rem' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 30, right: 30, left: 50, bottom: 5 }} barSize={60}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={(value) => `${value.toFixed(2)} ${currency}`} />
                                <Tooltip formatter={formatTooltipValue} />
                                <Legend />
                                <Bar dataKey="incomes" name="Total Incomes" fill="#00C49F" />
                                <Bar dataKey="expenses" name="Total Expenses" fill="#FF6384" />
                                <Bar dataKey="balance" name="Net Balance" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
} 