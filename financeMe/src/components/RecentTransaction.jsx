import { useState } from "react";
import { Filter } from "lucide-react";

const RecentTransactions = ({ transactions }) => {
  const [entriesToShow, setEntriesToShow] = useState(6);
  const [sortBy, setSortBy] = useState("");

//   Function to Format Date
const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0"); // Ensure two-digit day
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two-digit month
  const year = date.getFullYear();
  return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
};

 
  
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortBy === "price") return b.amount - a.amount;
    if (sortBy === "date") return new Date(b.date) - new Date(a.date);
    return 0;
  });

  return (
    <div className="p-4 bg-white rounded-3xl shadow-md border border-gray-200 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold font-inter">Recent Transactions</h2>

        <div className="flex gap-4">
          {/* Dropdown to select entries */}
          <select
            value={entriesToShow}
            onChange={(e) => setEntriesToShow(Number(e.target.value))}
            className="border border-gray-300 px-2 py-1 rounded-md"
          >
            <option value={5}>Show 5</option>
            <option value={10}>Show 10</option>
            <option value={20}>Show 20</option>
          </select>

          {/* Filter button */}
          <button
            onClick={() => setSortBy(sortBy === "price" ? "date" : "price")}
            className="flex items-center border border-black px-3 py-1 rounded-md shadow-md bg-white"
          >
            <Filter className="h-4 w-4 mr-2" />
            Sort by {sortBy === "price" ? "Date" : "Price"}
          </button>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">S. No</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Amount</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.slice(0, entriesToShow).map((tx, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{tx.name}</td>
                <td className="border border-gray-300 px-4 py-2">{tx.category}</td>
                <td className="border border-gray-300 px-4 py-2">₹{tx.amount}</td>
                <td className="border border-gray-300 px-4 py-2">{formatDate(tx.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;
