import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const TransactionBarChart = () => {
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
      category,
      amount,
    }));
  };

  return (
    <div className="w-full p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Transactions by Category (Last 60 Days)</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && chartData.length === 0 && <p>No transactions found.</p>}

      {!loading && !error && chartData.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TransactionBarChart;
