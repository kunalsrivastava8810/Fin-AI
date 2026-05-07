import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "../components/HomePage/Slider";
import WhyChooseUs from "../components/HomePage/WhyChooseUs";



export default function MainPage() {

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      navigate("/dashboard"); // ✅ Redirect to Dashboard if user is logged in
    }
  }, [navigate]);

  
  return (
    <div className="bg-white text-black">
      {/* Navbar */}
      <nav className="bg-black shadow-gray-500 shadow-md text-white p-5 flex justify-between">
        <div className="text-xl font-bold">FinanceBus</div>
        <div className="mr-10">
          <ul className="flex space-x-6">
            <li>Home</li>
            <li>About Us</li>
            <li>AI Analyzer</li>
            <li>Contact Us</li>
          </ul>
        </div>
        
      </nav>

      {/* Slider */}
      <Slider />

      {/* AI Analyzer Section */}
      <section className="flex flex-col md:flex-row items-center p-10">
        <div className="w-full md:w-1/2">
          <video
            autoPlay
            muted
            loop
            className=" shadow-md shadow-black-100 border border-black-50 rounded-2xl w-full"
          >
            <source src="/Analyzer.mp4" type="video/mp4" />
          </video>
        </div>
        
          <div className="w-full md:w-1/2 pl-10">
            <h2 className=" text-3xl font-bold">AI Analyzer</h2>
            <p className="text">
              Our AI-powered financial analyzer helps you make better financial
              decisions by analyzing your spending habits.
            </p>

            <ul className="mt-4 space-y-2">
              <li className="">
                <span className="text-xl text-black mr-2">&#10003;</span>
                <span>Track your expenses automatically and in real-time.</span>
              </li>
              <li className="flex items-center">
                <span className="text-xl text-black mr-2">&#10003;</span>
                <span>
                  Get personalized budget recommendations based on your spending
                  patterns.
                </span>
              </li>
              <li className="flex items-center">
                <span className="text-xl text-black mr-2">&#10003;</span>
                <span>
                  Receive alerts and notifications for overspending in any
                  category.
                </span>
              </li>
              <li className="flex items-center">
                <span className="text-xl text-black mr-2">&#10003;</span>
                <span>
                  View insights and trends to plan for future financial growth.
                </span>
              </li>
            </ul>
          </div>
      </section>

      {/* Features */}
      <div className="px-10 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center ">
          Features
        </h2>
        <div className="grid md:grid-cols-3 gap-10 mt-10">
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-xl font-bold text-gray-900">Dashboard</h3>
            <p className="text-gray-600 mt-2">
              Visualize your expenses and get AI-driven insights at a glance.
            </p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-xl font-bold text-gray-900">
              Investment Insights
            </h3>
            <p className="text-gray-600 mt-2">
              Receive AI-powered investment recommendations tailored to your
              goals.
            </p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-xl font-bold text-gray-900">
              Goals & Achievements
            </h3>
            <p className="text-gray-600 mt-2">
              Set and track financial goals with real-time AI assessments.
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-10 mt-10">
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-xl font-bold text-gray-900">
              Financial Reports
            </h3>
            <p className="text-gray-600 mt-2">
              Analyze your daily, weekly, Monthly expenses and its reports.
            </p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-xl font-bold text-gray-900">Wealth Status</h3>
            <p className="text-gray-600 mt-2">
              Financial Health Check which shows you financial condition in the
              society.
            </p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-xl font-bold text-gray-900">Richness Radar</h3>
            <p className="text-gray-600 mt-2">
              The wealth added in your finances.
            </p>
          </div>
        </div>
      </div>

      {/* Why choose us */}
      <WhyChooseUs/>

      <section className="text-center py-10 bg-gray-100">
        <h2 className="text-3xl font-bold">What Others Say About Us ?</h2>
        <p className="max-w-2xl mx-auto">
          See what our satisfied customers say about us.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white text-center p-4 mt-10">
        <p>&copy; 2025 FinAdvisor. All rights reserved.</p>
      </footer>
    </div>
  );
}



