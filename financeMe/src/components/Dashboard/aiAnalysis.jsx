import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { marked } from "marked";
import { API_URL } from "../../utils/api";

const AnalysisReport = () => {
    const [analysisData, setAnalysisData] = useState({});
    const [loading, setLoading] = useState(true);
    
    const sendQuery = async () => {
        try {
          const response = await fetch(`${API_URL}/transactions/analysis`);
          const result = await response.json();
          setAnalysisData(result);
        } catch (error) {
          console.error("Error analyzing goal:", error);
          alert("Analysis failed. Try again.");
        }
      };

    useEffect(() => {
        fetch(`${API_URL}/transactions/analysis`)
            .then(response => response.json())
            .then(data => {
                console.log("API Response:", data);
                setAnalysisData(data);
            })
            .catch(error => console.error("Error fetching API:", error))
            .finally(() => setLoading(false));
    }, []);

    // 🔹 If data is empty, show loading or fallback message
    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (!analysisData || Object.keys(analysisData).length === 0) return <p className="text-center text-red-500">No data available.</p>;

    // 🔹 Convert `analysis` to HTML using Markdown
    const analysisHTML = marked(analysisData.analysis || "");

    const COLORS = ["#4CAF50", "#FF9800", "#2196F3", "#E91E63", "#9C27B0", "#FFC107"];

    const categoryData = [
        { name: "Food", value: 400 },
        { name: "Rent", value: 700 },
        { name: "Education", value: 300 },
        { name: "Transportation", value: 150 },
        { name: "Entertainment", value: 200 },
    ];

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-none rounded-xl ">
            <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">Analysis Report</h2>

            {/* 🔹 Show Markdown-based Analysis Report */}
            

            {/* 🔹 Pie Chart Visualization */}
            <div className="flex justify-center items-center p-6 bg-none rounded-xl">
                <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                        <Pie
                            data={categoryData}
                            cx="50%"
                            cy="45%"
                            innerRadius={70} // Adds a donut-style effect
                            outerRadius={120}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }} />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            wrapperStyle={{ fontSize: "14px" }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="text-gray-700 prose mb-8" dangerouslySetInnerHTML={{ __html: analysisHTML }} />
            <div className="flex border w-full rounded-md">
            <div className="w-11/12 text-gray-200">Ask Your Query</div>
            <button onClick={sendQuery} className="bg-blue-950 px-3 py-1 text-white">Send</button>

            </div>
            

            {/* 🔹 Transaction Count Bar Chart */}
            {/* <div className="mt-8">
                <h3 className="text-xl font-semibold text-center mb-4">Total Transactions</h3>
                <ResponsiveContainer width="80%" height={250}>
                    <BarChart data={[{ name: "Transactions", count: analysisData.transaction_count }]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div> */}
        </div>
    );
};

export default AnalysisReport;
