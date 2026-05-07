import React, { useState } from "react";

const RiskAnalysis = () => {
    const [savings, setSavings] = useState("");
    const [analysisResult, setAnalysisResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRiskScoreColor = (score) => {
        const red = Math.max(255 - (score * 25), 0);  
        const green = Math.min(score * 25, 255);       
        return `rgb(${red}, ${green}, 0)`;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("https://financebus.onrender.com/api/risk-analysis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ savings: Number(savings) }),
            });

            const data = await response.json();
            console.log("Risk Analysis Response:", data); // Debugging log

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch risk analysis data");
            }

            setAnalysisResult(data.analysis || data); // Ensure the correct key is used
        } catch (error) {
            console.error("Error:", error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Risk Analysis</h2>
            <p>Get your risk</p>
            <p>Score Instantly</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    placeholder="Enter savings amount"
                    value={savings}
                    onChange={(e) => setSavings(e.target.value)}
                    className="w-full p-2 border rounded mb-4 my-4"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded"
                    disabled={loading}
                >
                    {loading ? "Analyzing..." : "Submit"}
                </button>
            </form>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            {analysisResult && (
                <div className="mt-6 p-4 border rounded">
                    <h3 className="text-lg font-semibold">Analysis Result</h3>
                    <p className="text-gray-700 text-lg">
                        <strong>Bankruptcy: within {analysisResult.months_to_bankruptcy} Month</strong>
                    </p>
                    <p className="text-gray-700 text-lg">
                        <strong style={{ color: getRiskScoreColor(analysisResult.risk_score) }}>
                            Risk Score:
                        </strong>{" "}
                        <span style={{ color: getRiskScoreColor(analysisResult.risk_score) }}>
                            {analysisResult.risk_score}
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default RiskAnalysis;
