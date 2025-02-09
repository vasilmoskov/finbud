import { Transaction } from "Frontend/types/Transaction";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";

type LabelProps = {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    index: number;
    value: number;
};

type TransactionChartProps = {
    transactionType: string;
    transactionsByDates: Transaction[];
    totalTransactionsByCategory: { name: string; value: number }[];
    currency: string;
};

export default function TransactionChart({ transactionType, transactionsByDates, totalTransactionsByCategory, currency }: TransactionChartProps) {
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF", "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];
    
    const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, index, value }: LabelProps) => {
        const RADIAN = Math.PI / 180;
        const radius = outerRadius + 30 + (index % 2 === 0 ? 0 : 30); // Alternate radius for every second label

        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        const textAnchor = x > cx ? 'start' : 'end';

        return (
            <g>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke={COLORS[index % COLORS.length]} />
            <text x={x} y={y} fill={COLORS[index % COLORS.length]} textAnchor={textAnchor} dominantBaseline="central">
                {`${value.toFixed(2)} ${currency}`}
            </text>
        </g>
        );
    };

    const formatTooltipValue = (value: number) => {
        const total = totalTransactionsByCategory.reduce((acc, expense) => acc + expense.value, 0);
        const percent = (value / total) * 100;

        return `${percent.toFixed(2)}%`;
    };

    return (
        <div className="flex flex-col items-center" style={{ width: '50%' }}>
            <h2>{transactionType}</h2>

            <div>
                {transactionsByDates.length === 0 ? (
                    <p className="text-lg text-gray-600 mt-4">There are no {transactionType.toLowerCase()} in the selected date range</p>
                ) : (
                    <PieChart width={800} height={500}>
                        <Pie data={totalTransactionsByCategory}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            fill="#8884d8"
                            label={renderCustomizedLabel}>

                            {totalTransactionsByCategory.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}

                        </Pie>

                        <Tooltip formatter={formatTooltipValue} />
                        <Legend />
                    </PieChart>

                )}
            </div>

        </div>
    )
}