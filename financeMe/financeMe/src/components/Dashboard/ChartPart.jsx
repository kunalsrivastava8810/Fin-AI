import React, { useState, useEffect } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Calendar, Clock } from "lucide-react";

const AnimatedExpensesChart = () => {
    const [viewType, setViewType] = useState("days");
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {


                setLoading(true);
                const storedUser = JSON.parse(localStorage.getItem("user"));

                const userId = storedUser.userId; // Extract userId
                const response = await fetch(`http://localhost:5000/api/users/transactions/${userId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch transactions");
                }

                const data = await response.json();
                const transactions = data.transactions || [];

                const dailyData = groupByDay(transactions);
                const monthlyData = groupByMonth(transactions);

                setChartData(viewType === "days" ? dailyData : monthlyData);
            } catch (error) {
                console.error("Error fetching transactions:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [viewType]);

    const groupByDay = (transactions) => {
        const grouped = transactions.reduce((acc, transaction) => {
            const date = new Date(transaction.date).toLocaleDateString();
            acc[date] = (acc[date] || 0) + transaction.amount;
            return acc;
        }, {});
    
        // Convert to array and sort by date
        return Object.entries(grouped)
            .map(([date, amount]) => ({ date, amount }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    const groupByMonth = (transactions) => {
        const grouped = transactions.reduce((acc, transaction) => {
            const month = new Date(transaction.date).toLocaleDateString("default", { year: "numeric", month: "short" });
            acc[month] = (acc[month] || 0) + transaction.amount;
            return acc;
        }, {});
    
        // Convert to array and sort by date
        return Object.entries(grouped)
            .map(([date, amount]) => ({ date, amount }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    if (loading) {
        return <p className="text-gray-500 text-center">Loading chart data...</p>;
    }

    if (error) {
        return <p className="text-red-500 text-center">Error: {error}</p>;
    }

    return (
        <div className="bg-white rounded-lg p-4  w-[800px]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold font-inter text-gray-800">Expense Analysis</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewType("days")}
                        className={`px-3 py-1 font-inter rounded-md text-sm ${viewType === "days" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                            }`}
                    >
                        <Clock className="inline h-4 w-4 mr-1" />
                        Weekly
                    </button>
                    <button
                        onClick={() => setViewType("months")}
                        className={`px-3 py-1 rounded-md text-sm ${viewType === "months" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                            }`}
                    >
                        <Calendar className="inline h-4 w-4 mr-1 font-inter" />
                        Monthly
                    </button>
                </div>
            </div>

            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                        <defs>
                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="date" tick={{ fontSize: 14 }} dy={10} />
                        {/* <YAxis tickFormatter={(value) => `₹${value}`} tick={{ fontSize: 14 }} width={60} /> */}
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorAmount)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AnimatedExpensesChart;
