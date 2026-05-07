import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BalanceSummary = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [transactions, setTransactions] = useState([]);
  const [userData, setUserData] = useState({ salary: 0 });
  const [ fundData, setFundData] = useState({ fund: 0});

  const getTransactions = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || !storedUser.userId) {
        console.error("User not found in localStorage");
        return;
      }
  
      const userId = storedUser.userId;
      
      const fund = storedUser.fund;
      
      const response = await fetch(`http://localhost:5000/api/users/transactions/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch transactions");
  
      const data = await response.json();
      setTransactions(data.transactions);
      setUserData({ salary: storedUser.salary }); // Set salary properly here
      setFundData( { fund: storedUser.fund});
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

  useEffect(() => {
    getTransactions();
  }, []);

  const getTotalExpenses = () => {
    return transactions.reduce((sum, t) => sum + Number(t.amount), 0);
  };

  const getMonthExpenses = () => {
    return transactions
      .filter(t => new Date(t.date).getMonth() === currentDate.getMonth())
      .reduce((sum, t) => sum + Number(t.amount), 0);
  };

  const changeMonth = (increment) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + increment);
      return newDate;
    });
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 w-80">
      <div className="space-y-6">
        <div>
          <h2 className="text-sm text-gray-600 mb-1">Monthly Salary</h2>
          <div className="text-3xl font-bold text-gray-900">
          ₹{userData.salary}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm text-gray-600 mb-1">
              Expenses in {currentDate.toLocaleString('default', { month: 'long' })}
            </h3>
            <div className="text-2xl font-semibold text-gray-800">
            ₹{getMonthExpenses().toLocaleString()}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button 
              onClick={() => changeMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            
            <span className="text-gray-600 font-medium">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            
            <button 
              onClick={() => changeMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Fund Section */}
        <div>
          <h2 className="text-sm text-gray-600 mb-1">Emergency Fund</h2>
          <div className="text-sm font-semibold text-black">
            ₹{fundData.fund}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSummary;