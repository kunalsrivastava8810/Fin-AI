import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Slider = () => {
  const images = [
    "/dashboard.png",
    "/dashboard.png",
    "/dashboard.png",
    "/dashboard.png",
    "/dashboard.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full px-6 md:px-12 py-12">
      {/* Left Side - Welcome Text */}
      <div className="w-full md:w-1/2 text-center md:text-left">
        <h1 className="text-4xl font-bold text-black mb-4">Welcome to AI Financial Advisor</h1>
        <p className="text-gray-600 mt-0 text-lg font-bold">Plan smarter, save better, and secure your future—starting today!</p>
        <p className="text-gray-600 mt-2 text-lg">Get personalized insights on budgeting, investments, and debt management. Analyze your income, expenses, and savings to unlock your true financial potential.</p>
        <button onClick={() => navigate('/login')} className="py-3 px-4 bg-black text-md mt-4 text-white font-bold rounded-lg">
          Get Started
        </button>
      </div>
      
      {/* Right Side - Slider */}
      <div className="w-full md:w-1/2 overflow-hidden relative mt-6 md:mt-0">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }} 
        >
          {images.map((src, index) => (
            <img key={index} src={src} className="w-full flex-shrink-0" alt={`Slide ${index + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
