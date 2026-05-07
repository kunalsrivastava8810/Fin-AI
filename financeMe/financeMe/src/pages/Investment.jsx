import { useState, useEffect } from "react";

const FinanceDashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [salary, setSalary] = useState(0);
    const [fund, setFund] = useState(0);
    const [monthlyExpenses, setMonthlyExpenses] = useState(0);
    const [savings, setSavings] = useState(0);
    const [activeResponse, setActiveResponse] = useState(null); // Single state for responses

    
    // Fetch Transactions and Calculate Expenses
    const getTransactions = async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (!storedUser || !storedUser.userId) {
                console.error("User not found in localStorage");
                return;
            }

            const userId = storedUser.userId;
            setSalary(storedUser.salary || 0);
            setFund(storedUser.fund || 0);

            const response = await fetch(`http://localhost:5000/api/users/transactions/${userId}`);
            if (!response.ok) throw new Error("Failed to fetch transactions");

            const data = await response.json();
            setTransactions(data.transactions);

            // Calculate total expenses for the current month
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();

            const currentMonthExpenses = data.transactions
                .filter(transaction => {
                    const transactionDate = new Date(transaction.date);
                    return (
                        transactionDate.getMonth() === currentMonth &&
                        transactionDate.getFullYear() === currentYear
                    );
                })
                .reduce((total, transaction) => total + (transaction.amount || 0), 0);

            setMonthlyExpenses(currentMonthExpenses);
            setSavings(storedUser.salary - currentMonthExpenses);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    // Fetch API and set response
    const fetchData = async (url, requestBody) => {
        try {
            setActiveResponse(null); // Reset previous response

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Request failed");

            setActiveResponse(result);
        } catch (error) {
            setActiveResponse({ error: error.message });
        }
    };

    // Event handlers for API calls
    const handleSmartSavingPlan = () => {
        fetchData("https://financebus.onrender.com/api/savings/smart-plan", { monthly_income: salary });
    };

    const handleInvestmentOpportunity = () => {
        fetchData("https://financebus.onrender.com/api/investment/opportunities", { emergency_fund: fund });
    };

    const handleRiskManagement = () => {
        fetchData("https://financebus.onrender.com/api/risk/management-plan", { monthly_income: salary });
    };

    // Fetch transactions on component mount
    useEffect(() => {
        getTransactions();
    }, []);

    return (
        <div className="items-center w-full justify-center bg-gray-100 p-6 ">
            <h1 className="text-3xl font-bold ">AI Powered Investment Plans</h1>
            <div className="w-full bg-white  rounded-lg p-6">
                <h2 className="text-2xl font-inter font-bold mb-4 text-left">Your Financial Summary</h2>

                <div className="gap-4">
                    <div className="p-1 flex gap-2 text-black rounded-lg">
                        <h3 className="text-sm font-semibold">Total Salary:</h3>
                        <p className="text-sm font-bold">₹{salary}</p>
                    </div>
                    <div className="p-1 flex gap-2 text-black rounded-lg">
                        <h3 className="text-sm font-semibold">Total Expenses:</h3>
                        <p className="text-sm font-bold">₹{monthlyExpenses}</p>
                    </div>
                    <div className="p-1 flex gap-2 text-black rounded-lg">
                        <h3 className="text-sm font-semibold">Fund:</h3>
                        <p className="text-sm font-bold">₹{fund}</p>
                    </div>
                    <div className="p-1 flex gap-2 text-black rounded-lg">
                        <h3 className="text-sm font-semibold">Savings:</h3>
                        <p className="text-sm font-bold">₹{savings}</p>
                    </div>
                </div>

                {/* Investment Plan Cards */}
                <div className="mt-8 grid md:grid-cols-3 gap-6">
                    <div
                        onClick={handleSmartSavingPlan}
                        className="bg-white shadow-md border rounded-lg p-6 text-center cursor-pointer hover:bg-gray-100"
                    >
                        <div className="text-4xl text-blue-600 mb-4">🏦</div>
                        <h3 className="text-xl font-semibold text-gray-800">Smart Savings Plan</h3>
                        <p className="text-gray-600 mt-2">
                            AI suggests saving strategies, emergency funds, and expense reductions for financial security.
                        </p>
                    </div>

                    <div
                        onClick={handleInvestmentOpportunity}
                        className="bg-white shadow-md border rounded-lg p-6 text-center cursor-pointer hover:bg-gray-100"
                    >
                        <div className="text-4xl text-green-600 mb-4">📈</div>
                        <h3 className="text-xl font-semibold text-gray-800">Investment Opportunities</h3>
                        <p className="text-gray-600 mt-2">
                            AI identifies the best investment options in stocks, mutual funds, and bonds tailored to your risk level.
                        </p>
                    </div>

                    <div
                        onClick={handleRiskManagement}
                        className="bg-white shadow-md border rounded-lg p-6 text-center cursor-pointer hover:bg-gray-100"
                    >
                        <div className="text-4xl text-red-600 mb-4">🔒</div>
                        <h3 className="text-xl font-semibold text-gray-800">Risk Management & Security</h3>
                        <p className="text-gray-600 mt-2">
                            AI suggests insurance, diversified portfolios, and long-term security plans to reduce financial risks.
                        </p>
                    </div>
                </div>

                {/* Display Latest API Response */}
                {activeResponse && (
                    <div className="mt-4 p-4 bg-gray-200 rounded-lg text-gray-800 shadow w-full text-left">
                        <h3 className="font-semibold text-lg mb-2">📢 AI Response:</h3>
                        <div className="bg-white p-4 rounded-lg shadow whitespace-pre-line">
                            {Object.entries(activeResponse).map(([key, value]) => (
                                <p key={key} className="text-gray-800">
                                    <span className="font-bold">{key}:</span> {JSON.stringify(value, null, 2).replace(/\\n/g, '\n')}
                                </p>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinanceDashboard;
