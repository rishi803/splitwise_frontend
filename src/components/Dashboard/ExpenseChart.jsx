import { useQuery } from 'react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import api from '../../utils/api';
import './Dashboard.css';

const ExpenseChart = ({ groupId }) => {
  const { data, isLoading } = useQuery(
    ['groupExpenses', groupId],
    () => api.get(`/groups/${groupId}/expenses/chart`)
  );

  if (isLoading) return <div>Loading chart...</div>;

  return (
    <div className="expense-chart">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data?.data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;