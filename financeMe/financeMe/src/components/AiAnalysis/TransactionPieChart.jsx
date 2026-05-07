import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28AFF", "#FF6384"];

const TransactionPieChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const userId = storedUser?.userId;

        if (!userId) {
          throw new Error("User ID not found in localStorage");
        }

        const response = await axios.get(`http://localhost:5000/api/users/transactions/${userId}`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch transactions");
        }

        const transactions = response.data.transactions || [];

        // Filter transactions for the last 60 days
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
        const filteredTransactions = transactions.filter(txn => new Date(txn.date) >= sixtyDaysAgo);

        // Group transactions by category
        const categoryData = groupByCategory(filteredTransactions);
        setChartData(categoryData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Group transactions by category
  const groupByCategory = (transactions) => {
    const grouped = transactions.reduce((acc, txn) => {
      acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
      return acc;
    }, {});

    return Object.entries(grouped).map(([category, amount]) => ({
      name: category,
      value: amount,
    }));
  };

  return (
    <div className="w-full p-2 bg-white shadow-md rounded-lg text-xs">
      <h2 className="text-sm font-semibold mb-2">Transactions by Category (Last 60 Days)</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && chartData.length === 0 && <p>No transactions found.</p>}

      {!loading && !error && chartData.length > 0 && (
        <ResponsiveContainer width={400} height={330}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={70}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: "8px" }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TransactionPieChart;
