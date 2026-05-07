import React from "react";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Calendar, Search, Filter, Brain, LineChart, Rocket } from "lucide-react";
import { addTransaction, fetchTransactions } from "../utils/api";  // API functions
import RecentTransactions from "./RecentTransaction";
import ExpensesSummary from "./Expenses";
import AnimatedExpensesChart from "./Dashboard/ChartPart";
import AnalysisReport from "./Dashboard/aiAnalysis";

function DashboardPage() {

  const [AnalysisOpen, setAnalysisOpen] = useState(false);
  // Transaction Pop Up 
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });


  const categories = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Bills & Utilities",
    "Entertainment",
    "Healthcare",
    "Education",
    "Travel",
    "Investment",
    "Other"
  ];

  const [transactions, setTransactions] = useState([]);

  const getTransactions = async () => {
    try {
      // Retrieve and parse stored user data
      const storedUser = JSON.parse(localStorage.getItem("user"));

      // Ensure storedUser exists and contains userId
      if (!storedUser || !storedUser.userId) {
        console.error("User not found in localStorage");
        return;
      }

      const userId = storedUser.userId; // Extract userId

      console.log("Fetching transactions for User ID:", userId);

      const response = await fetch(`http://localhost:5000/api/users/transactions/${userId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      console.log("User Transactions:", data);

      // Assuming the transactions are inside the "transactions" key in the response
      setTransactions(data.transactions); // Update state with the transactions
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);
  // Dependency array left empty to run only on mount


  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const addTransaction = async (e) => {
    e.preventDefault(); // Prevent form from reloading the page
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.userId) {
      console.error("User not found in localStorage");
      return;
    }
    const userId = storedUser.userId; // Extract userId
    console.log(userId);

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/transactions/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          amount: formData.amount,  // Ensure consistency in naming (price vs amount)
          date: formData.date,
          description: formData.description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add transaction");
      }

      const data = await response.json();
      console.log("Transaction Added:", data);

      // Close modal and refresh transactions
      setIsOpen(false);
      setTransactions([...transactions, data]); // Update transactions in UI

    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  // caledner 
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  //Analysis funtion
  const analyzeTransactions = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/ai-analysis/${userId}`);
      const data = await response.json();
      console.log("AI Analysis Result:", data);
    } catch (error) {
      console.error("Error analyzing transactions:", error);
    }
  };




  return (
    <div className="bg-violet-100 ">
      <div className="flex justify-center gap-56 w-8/12 bg-violet-100 ">
        <div className="flex justify-center gap-4">
          <button
            onClick={handleOpen}
            className="bg-white  text-black font-xs font-normal px-3 py-1 rounded-3xl border border-black shadow-md flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Payment
          </button>

          {/* Popup Form */}
          {isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Add Transaction</h2>
                  <button
                    onClick={handleClose}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={addTransaction} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (Optional)
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                    />
                  </div>

                  <button
                    onClick={addTransaction}
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors duration-200"
                  >
                    Add Transaction
                  </button>
                </form>
              </div>
            </div>
          )}
          <button
            className="flex border shadow-md font-xs items-center gap-2 px-4 py-2 rounded-3xl border-black bg-white  text-black transition-colors duration-200"
          >
            <Calendar className="h-4 w-4" />
            {currentDate}
          </button>
        </div>
        <div className="flex justify-center gap-4">
          <button
            className="h-10 w-10  bg-white rounded-full border border-black flex items-center justify-center transition-colors duration-200"
            aria-label="Filter"
          >
            <Filter className="h-5 w-5 text-gray-600" />
          </button>
          <button
            className="h-10 w-10  bg-white border border-black rounded-full flex items-center justify-center transition-colors duration-200"
            aria-label="Search"
          >
            <Search className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* next section  */}

      <div className="flex justify-normal">
        <div className="">
          <div className="flex gap-7 py-4 w-11/12 ml-4">
            <div onClick={() => setAnalysisOpen(true)} className="flex-1 cursor-pointer bg-white hover:bg-gray-100 p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="mb-4">
                <Brain className="h-10 w-10 text-red-800 p-1 bg-red-200 border rounded-full" />
              </div>
              <h3 className="text-lg font-semibold font-inter text-gray-800">
                Analyse Spending Using AI
              </h3>
            </div>

            {AnalysisOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-w-3xl h-[600px] overflow-y-auto relative">
                  {/* Close Button */}
                  <button
                    onClick={() => setAnalysisOpen(false)}
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-lg"
                  >
                    ✖
                  </button>

                  {/* Modal Content - Render Another JSX (AnalysisReport) */}
                  <AnalysisReport />
                </div>
              </div>
            )}


            <div className="flex-1 bg-white p-6 rounded-3xl shadow-sm border cursor-pointer hover:bg-gray-100  border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="mb-4 w-10 h-10 rounded-full bg-gray-200 flex justify-center items-center">
                <LineChart className="h-6 w-6  text-black bg-gray-200 " />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Personalised Investment Guidance
              </h3>

            </div>

            <div className="flex-1 bg-white p-6 rounded-3xl shadow-sm border cursor-pointer hover:bg-gray-100  border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="mb-2 border h-10 w-10 items-center flex bg-blue-300 rounded-full">
                <Rocket className="size{5px} text-blue-900 w-full bg-blue-300 rounded-full" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Set Your Financial Goals
              </h3>

            </div>
          </div>
          <div className="pop-up-container z-10 ml-5" >
            <AnimatedExpensesChart />
          </div>
        </div>
        <div>
          <ExpensesSummary />
        </div>
      </div>

      <div>
        <RecentTransactions transactions={transactions} /> {/* Pass transactions */}
      </div>

    </div>
  );
}

export default DashboardPage;
