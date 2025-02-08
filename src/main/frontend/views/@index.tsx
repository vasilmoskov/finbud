import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';

export const config: ViewConfig = {
  menu: { order: 0, icon: 'line-awesome/svg/globe-solid.svg' },
  title: 'Dashboards',
  loginRequired: true,
};

const expensesData = [
  { name: "Rent", value: 1200 },
  { name: "Groceries", value: 600 },
  { name: "Utilities", value: 200 },
  { name: "Transportation", value: 150 },
  { name: "Entertainment", value: 100 },
];

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
  percent: number;
  index: number;
};

const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, index }: LabelProps) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 30;

  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill={COLORS[index % COLORS.length]} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(2)}%`}
    </text>
  );
};

const formatTooltipValue = (value: number) => {
  return `${value.toFixed(2)} $`;
};

export default function DashboardsView() {
  return (
    <div className="flex flex-col h-full items-center justify-center p-l text-center box-border">
      <div className="flex flex-row justify-around w-full">

      <div className="flex flex-col items-center">
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

        <div className="flex flex-col items-center">
          <h2>Expenses</h2>
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
            <Legend  />
          </PieChart>
        </div>

      </div>
    </div>
  );
}
