import React, { useState, useEffect , useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import GoalDashboard from '../pages/GoalPage';
import FinanceDashboard from '../pages/Investment';

import {
  LayoutDashboard,
  CreditCard,
  Brain,
  ChartNoAxesCombined,
  Target,
  Settings,
  Bell,
  Menu,
  UserCircle,
  LogOut,
  Component
} from 'lucide-react';

import DashboardPage from './DashboardPage';
import AiAnalysis from '../pages/AiAnalysis';
import GoalHeader from '../pages/GoalPage';
import PaymentHistory from '../pages/Transaction';

const MainLayout = () => {

  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('dashboard');

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  const settingsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('user'); // ✅ Ensure key matches 'user'
      
      if (storedUser) {
        try {
          setUserData(JSON.parse(storedUser));
        } catch (error) {
          console.error("Error parsing user data:", error);
          navigate('/login');
        }
      } else {
        console.log("No user found, redirecting to login");
        navigate('/login');
      }
    
    // Handle clicks outside of settings dropdown
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [navigate]);

  //  Logout Functionality 
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };



  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, Component: <DashboardPage/>},
    { id: 'payments', label: 'Payments', icon: CreditCard, Component: <PaymentHistory/> },
    { id: 'ai-analysis', label: 'AI Analysis', icon: Brain, Component: <AiAnalysis /> },
    { id: 'Investing', label: 'Investing', icon: ChartNoAxesCombined, Component: <FinanceDashboard /> },
    { id: 'goal-tracking', label: 'Goal Tracking', icon: Target, Component: <GoalDashboard /> },
  ];

  const renderContent = () => {
    const activeMenuItem = menuItems.find(item => item.id === activeItem);

    return (
        <div className="p-6 w-[1260px]">
            <div className="bg-gray-50 rounded-lg ">
                {activeMenuItem?.Component || <p>Select a menu item</p>}
            </div>
        </div>
    );
  };

  const MenuItem = ({ item }) => {
    const Icon = item.icon;
    const isActive = activeItem === item.id;

    return (
      <button
        onClick={() => setActiveItem(item.id)}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
          ? 'bg-yellow-300 text-black'
          : 'text-black hover:bg-gray-100'
          }`}
      >
        <Icon className="h-5 w-5" />
        <span className={`${!isSidebarOpen && 'hidden'}`}>{item.label}</span>
      </button>
    );
  };


  const SettingsDropdown = () => (
    <div className="absolute right-0 mt-32 w-48 rounded-md mr-32 shadow-lg bg-white ring-1 ring-black ring-opacity-5">
      <div className="py-1" role="menu">
        <button
          onClick={() => {
            setIsSettingsOpen(false);
            navigate('/profile');
          }}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <UserCircle className="h-4 w-4 mr-2" />
          Profile
        </button>
        <button
          onClick={() => {
            setIsSettingsOpen(false);
            handleLogout();
          }}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b h-16 fixed w-full top-0 z-10">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <div  className=' w-10/12 flex justify-between'>
            {/* User Profile */}
            <div className="flex  justify-end">
            <img
                src="/assets/avatar.jpeg"
                alt="User avatar"
                className="h-10 w-10 rounded-full"
              />
              <div className="text-left ml-2">
                <div className="text-sm text-gray-500">Welcome back</div>
                <div className="text-sm font-medium text-gray-900"> {userData?.name} </div>
              </div>
              
            </div>



            <div className="flex items-center space-x-6">
              {/* Notification Button */}
              <button className="p-2 rounded-full border-2 hover:bg-gray-100">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>

              {/* Settings Button */}
              <button 
                className={`p-2 rounded-full border-2 hover:bg-gray-100 ${isSettingsOpen ? 'bg-gray-100' : ''}`}
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              >
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
              {isSettingsOpen && <SettingsDropdown />}
            </div>


          </div>


        </div>
      </nav>

      {/* Main Content */}
      <div className="mt-16 flex">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'
            }`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b">
            <h1 className={`font-bold text-xl text-black ${!isSidebarOpen && 'hidden'}`}>
              Finance Bus
            </h1>
          </div>

          {/* Menu Items */}
          <div className="p-4 space-y-2">
            {menuItems.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}

            {/* Settings at bottom */}
            <div className="pt-4 mt-4 border-t">
              <MenuItem
                item={{ id: 'settings', label: 'Settings', icon: Settings }}
              />
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main
          className={`flex bg-violet-100 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'
            }`}
        >
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;