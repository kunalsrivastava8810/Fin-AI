import React, { useState, useEffect } from 'react';
import { Plus, X, Target, DollarSign,BarChart } from 'lucide-react';


// Progress Circle Component
const ProgressCircle = ({ percentage }) => (
  <div className="relative w-24 h-24   ">
    <svg className="w-full h-full" viewBox="0 0 36 36">
      <path
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        stroke="#eee"
        strokeWidth="3"
      />
      <path
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        stroke="#4F46E5"
        strokeWidth="3"
        strokeDasharray={`${percentage}, 100`}
      />
      <text x="18" y="20.35" textAnchor="middle" fill="#4F46E5" fontSize="8">
        {percentage}%
      </text>
    </svg>
  </div>
);

// Goal Card Component
const GoalCard = ({ goal, onClick, isAchieved }) => (
  <div 
    onClick={onClick}
    className={`bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer ${
      isAchieved ? 'border-l-4 border-green-500' : ''
    }`}
  >
    <div className=" flex justify-between items-start">
      <div>
        <h3 className="font-semibold text-lg">{goal.description}</h3>
        <p className="text-gray-600">Target: ₹{goal.price}</p>
        {!isAchieved && <p className="text-gray-600">Due: ₹{goal.dueAmount || goal.price}</p>}
        <p className="text-sm text-gray-500">Time Frame: {goal.timeframe}</p>
        {isAchieved && <p className="text-green-600">Achieved! 🎉</p>}
      </div>
      <span className={`px-2 py-1 rounded-full text-sm ${
        isAchieved ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
      }`}>
        {goal.type}
      </span>
    </div>
  </div>
);

// Goal Input Form Component
const GoalInputForm = ({ onSubmit, type }) => {
  const [formData, setFormData] = useState({
    description: '',
    price: '',
    years: '',
    months: ''
  });

  const yearOptions = Array.from({ length: 10 }, (_, i) => i + 1);
  const monthOptions = Array.from({ length: 11 }, (_, i) => i + 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    let timeframe;
    
    if (type === 'longTermGoal') {
      timeframe = [
        formData.years && `${formData.years} year${formData.years > 1 ? 's' : ''}`,
        formData.months && `${formData.months} month${formData.months > 1 ? 's' : ''}`
      ].filter(Boolean).join(' and ');
    } else {
      timeframe = `${formData.months} month ${formData.months > 1 ? 's' : ''}`;
    }

    onSubmit({
      description: formData.description,
      price: parseFloat(formData.price),
      type,
      timeframe,
      date: new Date().toISOString(),
      status: 'active',
      dueAmount: parseFloat(formData.price)
    });

    setFormData({ description: '', price: '', years: '', months: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded-lg">
      <input 
        type="text" 
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Goal Description"
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <input 
        type="number" 
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        placeholder="Price"
        className="w-full p-2 mb-2 border rounded"
        required
      />
      {type === 'longTermGoal' ? (
        <div className="flex space-x-2">
          <select 
            value={formData.years}
            onChange={(e) => setFormData({ ...formData, years: e.target.value })}
            className="w-1/2 p-2 mb-2 border rounded"
          >
            <option value="">Select Years</option>
            {yearOptions.map(year => (
              <option key={year} value={year}>{year} year{year > 1 ? 's' : ''}</option>
            ))}
          </select>
          <select 
            value={formData.months}
            onChange={(e) => setFormData({ ...formData, months: e.target.value })}
            className="w-1/2 p-2 mb-2 border rounded"
          >
            <option value="">Select Months</option>
            {monthOptions.map(month => (
              <option key={month} value={month}>{month} month{month > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
      ) : (
        <select 
          value={formData.months}
          onChange={(e) => setFormData({ ...formData, months: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
          required
        >
          <option value="">Select Months</option>
          {monthOptions.map(month => (
            <option key={month} value={month}>{month} month{month > 1 ? 's' : ''}</option>
          ))}
        </select>
      )}
      <button 
        type="submit" 
        className="w-full p-2 bg-gray-800 text-white rounded hover:bg-gray-950"
      >
        Submit Goal
      </button>
    </form>
  );
};


// Detail View Component
const DetailView = ({ goal, onClose, onUpdate, isAchieved }) => {
  const [savedAmount, setSavedAmount] = useState('');
  const [dueAmount, setDueAmount] = useState(goal.dueAmount || goal.price);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const calculatePercentage = () => {
    return Math.round(((goal.price - dueAmount) / goal.price) * 100);
  };

  const handleSave = () => {
    const saved = parseInt(savedAmount) || 0;
    const newDueAmount = Math.max(0, goal.price - saved);
    const updated = {
      ...goal,
      savedAmount: saved,
      dueAmount: newDueAmount,
      percentage: Math.round(((goal.price - newDueAmount) / goal.price) * 100)
    };
    onUpdate(updated);
    setSavedAmount('');
    setDueAmount(newDueAmount);
  };
   // Function to handle analysis button click
   const handleAnalysisClick = () => {
    setShowAnalysis(true);
    fetchAnalysis();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{goal.description}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 ">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-gray-600">Total Amount</p>
            <p className="text-xl font-bold">₹{goal.price}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-gray-600">Due Amount</p>
            <p className="text-xl font-bold">₹{dueAmount}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-gray-600">Start Date</p>
            <p className="text-xl font-bold">{new Date(goal.date).toLocaleDateString()}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-gray-600">Timeframe</p>
            <p className="text-xl font-bold">{goal.timeframe}</p>
          </div>
        </div>

        {!isAchieved && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-lg mb-4">Add Savings</h3>
            <div className="flex space-x-4">
              <input
                type="number"
                value={savedAmount}
                onChange={(e) => setSavedAmount(e.target.value)}
                placeholder="Enter amount saved"
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={handleSave}
                className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900"
              >
                Save
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center">
          <ProgressCircle percentage={calculatePercentage()} />
          <p className="text-gray-600 mt-2">Progress</p>
          <p className="text-lg font-semibold">
            ₹{goal.price - dueAmount} saved of ₹{goal.price}
          </p>
        </div>
        <div>

          <button 
        onClick={handleAnalysisClick}
        className="relative left-64 mt-4 text-white text-xl bg-gray-800 h-12 w-32 rounded   shadow-lg hover:bg-gray-900"
        aria-label="Analyze goals"
      >
       Analyze
      </button>

      {showAnalysis && (
        <AnalysisModal 
          analysisData={analysisData}
          onClose={() => {
            setShowAnalysis(false);
            setAnalysisData(null);
          }}
        />
      )}
    </div>

      </div>
    </div>
  );
};
// Analysis Modal Component
const AnalysisModal = ({ onClose, analysisData }) => {
  if (!analysisData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Financial Analysis</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {analysisData.loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : analysisData.error ? (
            <Alert variant="destructive">
              <AlertDescription>{analysisData.error}</AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-gray-600">Total Goals Amount</p>
                  <p className="text-xl font-bold">₹{analysisData.totalAmount}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-gray-600">Achievement Rate</p>
                  <p className="text-xl font-bold">{analysisData.achievementRate}%</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-gray-600">Average Goal Amount</p>
                  <p className="text-xl font-bold">₹{analysisData.averageGoalAmount}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-gray-600">Active Goals</p>
                  <p className="text-xl font-bold">{analysisData.activeGoalsCount}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-4">Goal Type Distribution</h3>
                <div className="space-y-2">
                  {Object.entries(analysisData.goalTypeDistribution).map(([type, count]) => (
                    <div key={type} className="flex items-center">
                      <div className="w-32">{type}:</div>
                      <div className="flex-1 h-4 bg-gray-200 rounded">
                        <div 
                          className="h-full bg-blue-600 rounded"
                          style={{ width: `${(count / analysisData.totalGoals) * 100}%` }}
                        ></div>
                      </div>
                      <div className="ml-2">{count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Main App Component
const GoalSection = () => {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('financialGoals');
    return saved ? JSON.parse(saved) : [];
  });
  const [achievedGoals, setAchievedGoals] = useState(() => {
    const saved = localStorage.getItem('achievedGoals');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeSection, setActiveSection] = useState('shortTermGoal');
  const [activeView, setActiveView] = useState('Your Goals');
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const [analysisData, setAnalysisData] = useState(null);
  useEffect(() => {
    localStorage.setItem('financialGoals', JSON.stringify(goals));
    localStorage.setItem('achievedGoals', JSON.stringify(achievedGoals));
  }, [goals, achievedGoals]);

  const handleAddGoal = (newGoal) => {
    setGoals([...goals, { ...newGoal, id: Date.now() }]);
    setShowGoalForm(false);
  };

   // Function to fetch analysis data
   const fetchAnalysis = async () => {
    setAnalysisData({ loading: true });
    try {
      const response = await fetch('YOUR_API_ENDPOINT');
      if (!response.ok) throw new Error('Failed to fetch analysis');
      const data = await response.json();
      setAnalysisData(data);
    } catch (error) {
      setAnalysisData({ error: error.message });
    }
  };
 

  const handleUpdateGoal = (updatedGoal) => {
    if (updatedGoal.dueAmount === 0) {
      setAchievedGoals([...achievedGoals, { ...updatedGoal, achievedDate: new Date().toISOString() }]);
      setGoals(goals.filter(g => g.id !== updatedGoal.id));
    } else {
      setGoals(goals.map(g => g.id === updatedGoal.id ? updatedGoal : g));
    }
    setSelectedGoal(null);
  };

  const getDisplayGoals = () => {
    switch (activeView) {
      case 'Your Goals':
        return goals;
      case 'Achieved Goals':
        return achievedGoals;
      default:
        return [];
    }
   
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Financial Goals</h1>
        
        <div className="flex space-x-4 mb-6">
          {['shortTermGoal', 'longTermGoal', 'loan'].map(type => (
            <button 
              key={type}
              onClick={() => {
                setActiveSection(type);
                setShowGoalForm(false);
                setShowGoalForm(!showGoalForm);
              }}
              className={`flex text-lg items-center p-6 rounded h-14 w-100 ${
                activeSection === type 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {/* // + icon in the top  */}

              <Plus className="mr-2" /> 
              Add {type === 'shortTermGoal' ? 'Short Term Goal' : 
                   type === 'longTermGoal' ? 'Long Term Goal' : 'Loan'}
            </button>
          ))}
        </div>

        <div className="flex  space-x-4  mb-6 rounded  text-lg h-14 w-100">
          {['Your Goals', 'Achieved Goals', 'Your Loans', 'Achieved Loans'].map(section => (
            <button 
              key={section}
              onClick={() => setActiveView(section)}
              className={`relative px-4 py-2 rounded transition-all duration-300  ${
                activeView === section 
                  ? 'bg-gray-800 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {section}
              {activeView === section && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-700 rounded-b-full"></span>
              )}
            </button>
          ))}
        </div>

        {showGoalForm && (
          <GoalInputForm 
            onSubmit={handleAddGoal} 
            type={activeSection} 
          />
        )}

        <div className="space-y-4 mt-6">
          {getDisplayGoals().map((goal) => (
            <GoalCard 
              key={goal.id}
              goal={goal}
              onClick={() => setSelectedGoal(goal)}
              isAchieved={activeView === 'Achieved Goals'}
            />
          ))}
        </div>

        {selectedGoal && (
          <DetailView 
            goal={selectedGoal}
            onClose={() => setSelectedGoal(null)}
            onUpdate={handleUpdateGoal}
            isAchieved={activeView === 'Achieved Goals'}
          />
        )}
        {/* <button 
         
          className="fixed bottom-14 right-14 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 size-20"
        >
          <Plus size={48} />
        </button> */}
      </div>
      </div>
      )
  };

export default GoalSection;