import { useState, useEffect } from "react";


import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";

const ExpenseBarChart = () => {
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

  // Define the violet color for all bars
  const violetColor = "#8A2BE2"; // A solid shade of violet

  if (loading) return <p className="text-gray-500 text-center text-sm">Loading chart data...</p>;
  if (error) return <p className="text-red-500 text-center text-sm">Error: {error}</p>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md ">
      <h2 className="text-lg font-bold text-center mb-2">Category-wise Expenses (Last 60 Days)</h2>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: "12px" }} />

          {/* Single color for all bars */}
          <Bar dataKey="amount" fill={violetColor} barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseBarChart;
