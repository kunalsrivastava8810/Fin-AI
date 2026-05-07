import React from 'react'
// import TransactionBarChart from '../components/AiAnalysis/ExpensePieChart';
import RiskAnalysis from '../components/AiAnalysis/RiskAnalysis'
import InvestmentAdvice from '../components/AiAnalysis/Investment';
import TransactionBarChart from '../components/AiAnalysis/ExpensePieChart';
import ExpenseBarChart from '../components/AiAnalysis/BarGraph';
import TransactionPieChart from '../components/AiAnalysis/TransactionPieChart';
import AnalysisReport from '../components/Dashboard/aiAnalysis';

function AiAnalysis() {
    return (
        <div className='w-full bg-violet-100'>
            <h1 className='font-inter bg-violet-100 font-bold text-lg '>AI ANALYSER</h1>
            <p className='font-inter bg-violet-100'>Empowering youwith AI-Driven isnights for smarter financial decisions.</p>
            <div className='flex w-full h-full gap-10 bg-violet-100 mt-8'>
                <div className='bg-violet-100 '>
                    <TransactionBarChart />
                </div>
                <div>
                    <TransactionPieChart />
                </div>
                
                <div className=''>
                    <RiskAnalysis />
                </div>
            </div>
            <AnalysisReport />

        </div>

    )
}

export default AiAnalysis