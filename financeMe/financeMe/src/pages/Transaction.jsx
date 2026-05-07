import React, { useState, useEffect } from "react";
import { ArrowUpDown } from 'lucide-react';
import { Download } from 'lucide-react';
import jsPDF from "jspdf";
import "jspdf-autotable";

const PaymentHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem("user"));
                if (!storedUser || !storedUser.userId) {
                    console.error("User not found in localStorage");
                    return;
                }

                const userId = storedUser.userId;
                console.log("Fetching transactions for User ID:", userId);

                const response = await fetch(`http://localhost:5000/api/users/transactions/${userId}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch transactions");
                }

                const data = await response.json();
                console.log("User Transactions:", data);

                setTransactions(data.transactions.reverse());
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB"); // Converts to DD/MM/YYYY
    };

    // Filter transactions by search term
    const filteredTransactions = transactions.filter((transaction) =>
        transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sorting function
    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
        if (sortBy === "amount") return b.amount - a.amount;
        return 0;
    });

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("Payment History", 14, 10);

        const tableColumn = ["S.No", "Transaction Name", "Category", "Amount", "Date"];
        const tableRows = [];

        sortedTransactions.forEach((transaction, index) => {
            const transactionData = [
                index + 1,
                transaction.name,
                transaction.category,
                `$${transaction.amount}`,
                formatDate(transaction.date)
            ];
            tableRows.push(transactionData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save("Payment_History.pdf");
    };

    return (
        <div className="w-full mx-auto mt-3 p-6 bg-violet-100 rounded-xl">
            <h2 className="text-3xl font-bold text-left mb-6 text-black">Payment History</h2>

            {/* Search & Sort Section */}
            <div className="flex justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search by name..."
                    className="border p-2 rounded-md w-1/3"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="flex justify-center gap-2">
                    <button
                        className="bg-blue-950 text-white px-4 py-2 text-sm mt-0.5 rounded-md font-inter flex gap-5"
                        onClick={() => setSortBy("amount")}
                    >
                        <div className="flex"> < ArrowUpDown className="h-4 w-4 mt-1" /> </div>
                        Sort by Amount
                    </button>
                    {/* Download PDF Button */}
                    <button
                        onClick={generatePDF}
                        className="text-white w-10 h-10 flex items-center text-center bg-blue-950 p-1 rounded-full"
                    >
                        <Download className="w-6 h-6 text-lg ml-1 font-semibold" />
                    </button>

                </div>



            </div>


            {/* Transaction Table */}
            <div className="overflow-x-auto rounded-md mt-8">
                <table className="min-w-full bg-white border rounded-lg shadow-md">
                    <thead className="bg-blue-950 text-white py-4 font-inter">
                        <tr>
                            <th className="px-4 py-2">S.No</th>
                            <th className="px-4 py-2">Transaction Name</th>
                            <th className="px-4 py-2">Category</th>
                            <th className="px-4 py-2">Amount</th>
                            <th className="px-4 py-2">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTransactions.length > 0 ? (
                            sortedTransactions.map((transaction, index) => (
                                <tr key={transaction.id} className="border-t hover:bg-gray-100 font-inter">
                                    <td className="px-4 py-2 text-center">{index + 1}</td>
                                    <td className="px-4 py-2">{transaction.name}</td>
                                    <td className="px-4 py-2">{transaction.category}</td>
                                    <td className="px-4 py-2 text-left">₹{transaction.amount}</td>
                                    <td className="px-4 py-2 text-center">{formatDate(transaction.date)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-gray-500">
                                    No transactions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentHistory;
