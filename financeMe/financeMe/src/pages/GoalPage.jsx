import React, { useState, useEffect } from 'react';
import { Target, TimerIcon, Wallet, Trophy, CreditCard, X } from 'lucide-react';
import { getGoals, addGoal, getLoans, addLoan } from "../utils/api";
import ReactMarkdown from "react-markdown";

const GoalDashboard = () => {
  const [activeTab, setActiveTab] = useState('yourGoals');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [loans, setLoans] = useState([]);
  const [goals, setGoals] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  useEffect(() => {
    fetchGoals();
    fetchLoans();
  }, []);

  const fetchGoals = async () => {
    try {
      const data = await getGoals();
      setGoals(data || []);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  const fetchLoans = async () => {
    try {
      const data = await getLoans();
      setLoans(data || []);
    } catch (error) {
      console.error("Error fetching loans:", error);
    }
  };

  const handleOpenModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleGoalAnalysis = async (goal) => {
    try {
      const response = await fetch("https://financebus.onrender.com/api/goals/long-term/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(goal),
      });

      const result = await response.json();
      setAnalysis(result.analysis);
      setShowAnalysisModal(true);
    } catch (error) {
      console.error("Error analyzing goal:", error);
      alert("Analysis failed. Try again.");
    }
  };

  const handleLoanAnalysis = async (loan) => {
    try {
      console.log("running");
      const response = await fetch("https://financebus.onrender.com/api/loan/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        
        body: JSON.stringify(loan),
      });
      console.log("running");
      const result = await response.json();
      setAnalysis(result.analysis);
      setShowAnalysisModal(true);
    } catch (error) {
      console.error("Error analyzing loan:", error);
      alert("Analysis failed. Try again.");
    }
  };

  const AnalysisModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 max-h-[80vh] overflow-y-auto relative">
        <button 
          onClick={() => setShowAnalysisModal(false)} 
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X />
        </button>
        <h3 className="font-semibold text-lg mb-4">Analysis Result</h3>
        <ReactMarkdown className="text-gray-700">{analysis}</ReactMarkdown>
      </div>
    </div>
  );

  const Modal = ({ onClose }) => {
    const [formData, setFormData] = useState({});

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (modalType === 'loan') {
          await addLoan({
            ...formData,
            type: 'loan'
          });
          await fetchLoans();
        } else {
          await addGoal({
            ...formData,
            type: modalType
          });
          await fetchGoals();
        }
        onClose();
      } catch (error) {
        console.error("Error submitting:", error);
        alert("Submission failed. Please try again.");
      }
    };

    const calculateEMI = () => {
      const p = parseFloat(formData.principleAmount);
      const r = parseFloat(formData.rateOfInterest) / (12 * 100);
      const t = parseFloat(formData.tenure);

      if (!p || !r || !t) return;

      const emi = p * r * Math.pow(1 + r, t) / (Math.pow(1 + r, t) - 1);
      setFormData(prev => ({ ...prev, emi: emi.toFixed(2) }));
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div className="bg-white rounded-xl p-6 w-96 relative">
          <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
            <X />
          </button>

          <h2 className="text-xl font-semibold mb-6">
            {modalType === "shortTerm" ? "Add Short Term Goal" :
             modalType === "longTerm" ? "Add Long Term Goal" : "Add Loan"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {modalType === "loan" ? (
              <>
                <InputField label="Loan Name" type="text" value={formData.name} 
                  onChange={(val) => setFormData({ ...formData, name: val })} />
                <InputField label="Principle Amount" type="number" value={formData.principleAmount} 
                  onChange={(val) => setFormData({ ...formData, principleAmount: val })} />
                <InputField label="Rate of Interest (%)" type="number" step="0.1" value={formData.rateOfInterest} 
                  onChange={(val) => setFormData({ ...formData, rateOfInterest: val })} />
                <InputField label="Tenure (months)" type="number" value={formData.tenure} 
                  onChange={(val) => setFormData({ ...formData, tenure: val })} />

                <button type="button" onClick={calculateEMI}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 mb-2">
                  Calculate EMI
                </button>

                {formData.emi && (
                  <div className="text-center p-2 bg-gray-100 rounded-lg mb-2">
                    Monthly EMI: ₹{formData.emi}
                  </div>
                )}
              </>
            ) : (
              <>
                <InputField label="Goal Name" type="text" value={formData.name} 
                  onChange={(val) => setFormData({ ...formData, name: val })} />
                <InputField label="Total Amount" type="number" value={formData.total_amount} 
                  onChange={(val) => setFormData({ ...formData, total_amount: val })} />
                <InputField label="Due Amount" type="number" value={formData.due_amount} 
                  onChange={(val) => setFormData({ ...formData, due_amount: val })} />
                <InputField 
                  label={modalType === "shortTerm" ? "Timeframe (months)" : "Timeframe (years)"} 
                  type="number" 
                  value={formData.timeframe} 
                  onChange={(val) => setFormData({ ...formData, timeframe: val })} 
                />
              </>
            )}

            <button type="submit" className="w-full bg-blue-950 text-white py-2 rounded-lg hover:bg-blue-700">
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  };

  const InputField = ({ label, type, value, onChange, step }) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        step={step}
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'yourGoals':
        return (
          <div className="p-4 space-y-2">
            {goals.map((goal, index) => (
              <div key={index} className="p-4 rounded-lg flex bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                <div className='w-8/12'>
                  <h3 className="font-inter text-lg mb-1">{goal.name}</h3>
                  <p className="text-gray-600">Target: ₹{goal.due_amount}</p>
                  <p className="text-gray-600">
                    Duration: {goal.timeframe} {goal.type === 'shortTerm' ? 'months' : 'years'}
                  </p>
                </div>
                <div className='flex w-full justify-end p-4'>
                  <button 
                    onClick={() => handleGoalAnalysis(goal)} 
                    className='px-8 py-0 bg-blue-950 text-white rounded-md mt-1'
                  >
                    Analyze
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      case 'yourLoans':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {loans.map((loan, index) => (
              <div key={index} className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
                <h3 className="font-semibold text-lg mb-2">{loan.name}</h3>
                <p className="text-gray-600">Principal: ₹{loan.principleAmount}</p>
                <p className="text-gray-600">Interest Rate: {loan.rateOfInterest}%</p>
                <p className="text-gray-600">Duration: {loan.tenure} months</p>
                <p className="text-gray-600">EMI: ₹{loan.emi}</p>
                <div className='flex w-full justify-end'>
                  <button 
                    onClick={() => handleLoanAnalysis(loan)} 
                    className='p-2 bg-blue-950 text-white rounded-md mt-1'
                  >
                    Analysis
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return <div className="p-4">No items to display</div>;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-6 h-6" />
        <h1 className="text-xl font-semibold">Goal Targeting</h1>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => handleOpenModal('shortTerm')}
          className="flex items-center gap-2 px-4 py-2 border-2 border-black rounded-md hover:bg-gray-100"
        >
          <TimerIcon className="w-5 h-5" />
          Short Term Goal
        </button>
        <button
          onClick={() => handleOpenModal('longTerm')}
          className="flex items-center gap-2 px-4 py-2 border-2 border-black rounded-md hover:bg-gray-100"
        >
          <Target className="w-5 h-5" />
          Long Term Goal
        </button>
        <button
          onClick={() => handleOpenModal('loan')}
          className="flex items-center gap-2 px-4 py-2 border-2 border-black rounded-md hover:bg-gray-100"
        >
          <Wallet className="w-5 h-5" />
          Add Loan
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { id: 'yourGoals', label: 'Your Goals', icon: <Target className="w-5 h-5" /> },
          { id: 'achievedGoals', label: 'Achieved Goals', icon: <Trophy className="w-5 h-5" /> },
          { id: 'yourLoans', label: 'Your Loans', icon: <Wallet className="w-5 h-5" /> },
          { id: 'achievedLoans', label: 'Achieved Loans', icon: <CreditCard className="w-5 h-5" /> }
        ].map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`cursor-pointer p-4 rounded-lg flex flex-col items-center justify-center transition-colors
              ${activeTab === tab.id
                ? 'bg-blue-950 text-white shadow-md'
                : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {tab.icon}
            <span className="mt-2 font-medium">{tab.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-blue-950 min-h-[300px]">
        {renderContent()}
      </div>

      

      {showModal && <Modal onClose={() => setShowModal(false)} modalType={modalType} />}
      {showAnalysisModal && <AnalysisModal />}
    </div>
  );
};

export default GoalDashboard;