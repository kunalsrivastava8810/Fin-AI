import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import RegisterForm from "./pages/RegistrationForm";
import MainLayout from "./components/Dashboard";
import AnalysisData from "./components/Dashboard/aiAnalysis";
import GoalSection from "./pages/DemoGoal";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/dashboard" element={<MainLayout />} />
        <Route path="/analysis" element={<AnalysisData />} />
        <Route path="/goaltracking" element={<GoalSection />} />
      </Routes>
    </Router>
  );
}
