import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { useQuery } from 'react-query';
import { format, parseISO, subDays, addDays } from 'date-fns';
import api from '../../utils/api';

const ExpenseChart = ({ groupId }) => {
  // Helper function to fill missing dates
  const fillMissingDates = (data) => {
    const filledData = [];
    const startDate = subDays(new Date(), 29);
    
    for (let i = 0; i < 30; i++) {
      const currentDate = format(addDays(startDate, i), 'yyyy-MM-dd');
      const existingEntry = data.find(entry => format(parseISO(entry.date), 'yyyy-MM-dd') === currentDate);
      
      filledData.push({
        date: currentDate,
        amount: existingEntry ? parseFloat(existingEntry.amount) : 0 // Ensure amount is a number
      });
    }
    
    return filledData;
  };

  const { 
    data: chartData, 
    isLoading: chartLoading 
  } = useQuery(
    ["expenseChart", groupId],
    () => api.get(`/groups/${groupId}/expenses/chart`),
    {
      select: (response) => {
        const sortedData = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        return fillMissingDates(sortedData);
      }
    }
  );

  // Calculate moving average
  const calculateMovingAverage = (data, window) => {
    return data.map((_, index) => {
      const start = Math.max(0, index - window + 1);
      const end = index + 1;
      const windowSlice = data.slice(start, end);
      const avg = windowSlice.reduce((sum, item) => sum + item.amount, 0) / windowSlice.length;
      return Number(avg.toFixed(2));
    });
  };

  // Memoized data processing
  const processedChartData = useMemo(() => { 
    if (!chartData) return [];

    const movingAverage = calculateMovingAverage(chartData, 7);
    
    return chartData.map((item, index) => ({
      ...item,
      movingAverage: movingAverage[index]
    }));
  }, [chartData]);

  // Calculate min and max for Y-axis
  const minAmount = Math.min(...processedChartData.map(data => data.amount));
  const maxAmount = Math.max(...processedChartData.map(data => data.amount));
  const maxMovingAverage = Math.max(...processedChartData.map(data => data.movingAverage));
  
  const yAxisMin = Math.min(minAmount, 0); // Ensure it starts from 0 or lower
  const yAxisMax = Math.max(maxAmount, maxMovingAverage) + 10; // Add buffer for visibility

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-date">
            {format(parseISO(label), 'PPP')}
          </p>
          <p className="tooltip-amount">
            Expense: ₹{payload[0].value.toFixed(2)}
          </p>
          {payload[1] && (
            <p className="tooltip-moving-average">
              7-Day Avg: ₹{payload[1].value.toFixed(2)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Loading and error states
  if (chartLoading) {
    return (
      <section className="chart-section glass-panel">
        <div className="chart-loading">
          <div className='loader'></div>
          <p>Loading expense trends...</p>
        </div>
      </section>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <section className="chart-section glass-panel">
        <div className="no-data">
          <p>No expense data available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="chart-section glass-panel">
      <h2>Expense Trends</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart 
            data={processedChartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorMovingAverage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              stroke="rgba(127, 104, 104, 0.58)" 
              strokeDasharray="3 3" 
            />
            
            <XAxis 
              dataKey="date" 
              tickFormatter={(tick) => format(parseISO(tick), 'MMM dd')}
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8' }}
            />
            
            <YAxis 
              domain={[yAxisMin, yAxisMax]}
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8' }}
              tickFormatter={(tick) => `₹${tick}`}
            />
            
            <Tooltip 
              content={<CustomTooltip />}
              contentStyle={{
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
              }}
            />
            
            <Legend 
              verticalAlign="top" 
              height={45}
              iconType="circle"
            />
            
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorExpense)"
            />
            
            <Line
              type="monotone"
              dataKey="movingAverage"
              stroke="#82ca9d"
              dot={false}
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default ExpenseChart;