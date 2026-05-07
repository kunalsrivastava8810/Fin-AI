import React, { useState } from "react";
import axios from "axios";

const InvestmentAdvice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [investmentAdvice, setInvestmentAdvice] = useState("");

  // Function to fetch transactions and get investment advice
  const fetchInvestmentAdvice = async () => {
    try {
      setLoading(true);
      setError(null);

      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?.userId;

      if (!userId) {
        throw new Error("User ID not found in localStorage");
      }

      // Fetch user's transactions
      const response = await axios.get(`http://localhost:5000/api/users/transactions/${userId}`);
      if (response.status !== 200) {
        throw new Error("Failed to fetch transactions");
      }

      const transactions = response.data.transactions || [];

      // Send transactions to Gemini API for advice
      const geminiResponse = await axios.post("http://localhost:5000/api/gemini/investment-advice", {
        transactions,
      });

      setInvestmentAdvice(geminiResponse.data.advice); // Save Gemini's response
    } catch (error) {
      console.error("Error fetching investment advice:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-2">Get Investment Advice</h2>
      <button
        onClick={fetchInvestmentAdvice}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Fetching..." : "Get Advice"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {investmentAdvice && (
        <div className="mt-4 p-3 border rounded bg-gray-100">
          <h3 className="font-semibold">Investment Advice:</h3>
          <p>{investmentAdvice}</p>
        </div>
      )}
    </div>
  );
};

export default InvestmentAdvice;
