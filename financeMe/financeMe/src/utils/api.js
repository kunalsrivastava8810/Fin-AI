import axios from "axios";

const API_URL = "http://localhost:5000/api";
const API_URL_TRANSACTION = "http://localhost:5000/api/transactions";
const BACK_URL = "http://localhost:5000";

// ================= AUTH =================
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

// ================= TRANSACTIONS =================
export const addTransaction = async (transactionData) => {
  try {
    const response = await fetch(`${API_URL_TRANSACTION}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw errData;
    }

    return await response.json();
  } catch (error) {
    throw error.message || "Failed to add transaction";
  }
};

export const fetchTransactions = async () => {
  try {
    const response = await fetch(API_URL_TRANSACTION);

    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }

    return await response.json();
  } catch (error) {
    throw error.message || "Error fetching transactions";
  }
};

// ================= GOALS =================
export const getGoals = async () => {
  try {
    const response = await axios.get(`${BACK_URL}/goals`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error fetching goals" };
  }
};

export const addGoal = async (goalData) => {
  try {
    const response = await axios.post(`${BACK_URL}/goals`, goalData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error adding goal" };
  }
};

// ================= LOANS =================
export const getLoans = async () => {
  try {
    const response = await axios.get(`${BACK_URL}/loans`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error fetching loans" };
  }
};

export const addLoan = async (loanData) => {
  try {
    const response = await axios.post(`${BACK_URL}/loans`, loanData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error adding loan" };
  }
};
