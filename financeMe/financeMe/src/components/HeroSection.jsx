import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const words = ["Finance with Us", "Manage Your Expenses", "Track & Save"];

const HeroSection = () => {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setText((prev) =>
        words[wordIndex].substring(0, prev.length + 1)
      );

      if (text === words[wordIndex]) {
        setTimeout(() => {
          setWordIndex((prev) => (prev + 1) % words.length);
          setText("");
        }, 1000);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [text, wordIndex]);

  return (
    <section className="flex flex-col-reverse md:flex-row items-center justify-between px-28 py-40 bg-white text-white">
      {/* Left Side */}
      <div className="md:w-1/2 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="text-blue-950 font-inter">{text}</span>
          <span className="animate-blink">|</span>
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Simplify your finances and take control of your money.
        </p>
        <button
          onClick={() => navigate("/register")}
          className="bg-violet-950 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-lg hover:bg-blue-800 transition"
        >
          Get Started
        </button>
      </div>

      {/* Right Side */}
      <div className="md:w-1/2 flex justify-center">
        <img
          src="/assets/visualising-tool.jpg"
          alt="Finance Illustration"
          className="rounded-lg shadow-lg"
        />
      </div>
    </section>
  );
};

export default HeroSection;
