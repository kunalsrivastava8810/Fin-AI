import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
export const API_URL = `${API_BASE}/api`;

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/users/login`, credentials);
  return response.data;
};

export const getUserTransactions = async (userId) => {
  const response = await axios.get(`${API_URL}/users/transactions/${userId}`);
  return response.data.transactions || [];
};

export const addUserTransaction = async (userId, transactionData) => {
  const response = await axios.post(
    `${API_URL}/users/${userId}/transactions/add`,
    transactionData
  );
  return response.data;
};

export const analyzeTransactions = async (transactions) => {
  const response = await axios.post(`${API_BASE}/analyze-transactions`, {
    transactions,
  });
  return response.data;
};

export const getGoals = async () => {
  const response = await axios.get(`${API_BASE}/goals`);
  return response.data;
};

export const addGoal = async (goalData) => {
  const response = await axios.post(`${API_BASE}/goals`, goalData);
  return response.data;
};

export const getLoans = async () => {
  const response = await axios.get(`${API_BASE}/loans`);
  return response.data;
};

export const addLoan = async (loanData) => {
  const response = await axios.post(`${API_BASE}/loans`, loanData);
  return response.data;
};
