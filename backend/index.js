const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: process.env.VITE_FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

const users = [];
const goals = [];
const loans = [];

const sampleTransactions = [
  {
    id: crypto.randomUUID(),
    name: "Groceries",
    category: "Food & Dining",
    amount: 2400,
    date: new Date().toISOString(),
    description: "Monthly essentials",
  },
  {
    id: crypto.randomUUID(),
    name: "Metro pass",
    category: "Transportation",
    amount: 900,
    date: new Date().toISOString(),
    description: "Commute",
  },
];

function makeUserId() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

function publicUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

function findUser(userId) {
  return users.find((user) => user.userId === String(userId));
}

function createLocalUser(userId) {
  const user = {
    id: crypto.randomUUID(),
    userId: String(userId || makeUserId()),
    name: "Local User",
    email: `local-${Date.now()}@finai.local`,
    phone: "",
    password: "",
    salary: 0,
    fund: 0,
    transactions: [],
  };

  users.push(user);
  return user;
}

function requireUser(req, res, next) {
  const user = findUser(req.params.userId) || createLocalUser(req.params.userId);

  req.user = user;
  next();
}

function categoryTotals(transactions) {
  return transactions.reduce((totals, transaction) => {
    totals[transaction.category] =
      (totals[transaction.category] || 0) + Number(transaction.amount || 0);
    return totals;
  }, {});
}

function buildAnalysis(transactions) {
  const total = transactions.reduce(
    (sum, transaction) => sum + Number(transaction.amount || 0),
    0
  );
  const byCategory = categoryTotals(transactions);
  const topCategory =
    Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

  return {
    transaction_count: transactions.length,
    total_expenses: total,
    categories: byCategory,
    analysis:
      transactions.length === 0
        ? "No transactions yet. Add a payment to see a useful spending analysis."
        : `You have recorded ${transactions.length} transactions totaling Rs ${total}. Your highest spending category is ${topCategory}.`,
  };
}

app.get("/", (req, res) => {
  res.json({ message: "FinAI backend is running" });
});

app.post("/api/users/register", (req, res) => {
  const { name, email, phone, password, salary = 20000, fund = 20000 } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  if (users.some((user) => user.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = {
    id: crypto.randomUUID(),
    userId: makeUserId(),
    name,
    email,
    phone,
    password,
    salary: Number(salary) || 20000,
    fund: Number(fund) || 20000,
    transactions: sampleTransactions.map((transaction) => ({
      ...transaction,
      id: crypto.randomUUID(),
    })),
  };

  users.push(user);
  res.status(201).json({
    message: "User registered successfully",
    user: publicUser(user),
  });
});

app.post("/api/users/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (candidate) => candidate.email === email && candidate.password === password
  );

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  res.json({ message: "Login successful", user: publicUser(user) });
});

app.get("/api/users/transactions/:userId", requireUser, (req, res) => {
  res.json({ transactions: req.user.transactions });
});

app.post("/api/users/:userId/transactions/add", requireUser, (req, res) => {
  const { name, category, amount, date, description = "" } = req.body;

  if (!name || !category || !amount || !date) {
    return res.status(400).json({ message: "Missing transaction fields" });
  }

  const transaction = {
    id: crypto.randomUUID(),
    name,
    category,
    amount: Number(amount),
    date,
    description,
  };

  req.user.transactions.push(transaction);
  res.status(201).json(transaction);
});

app.get("/api/transactions/analysis", (req, res) => {
  const transactions = users.flatMap((user) => user.transactions);
  res.json(buildAnalysis(transactions));
});

app.post("/analyze-transactions", (req, res) => {
  res.json(buildAnalysis(req.body.transactions || []));
});

app.post("/api/risk-analysis", (req, res) => {
  const savings = Number(req.body.savings || 0);
  const riskScore = Math.max(1, Math.min(10, Math.round(10 - savings / 10000)));
  res.json({
    analysis: {
      months_to_bankruptcy: savings > 0 ? Math.max(1, Math.ceil(savings / 15000)) : 1,
      risk_score: riskScore,
    },
  });
});

app.post("/api/savings/smart-plan", (req, res) => {
  const monthlyIncome = Number(req.body.monthly_income || 0);
  res.json({
    plan: `Save at least Rs ${Math.round(monthlyIncome * 0.2)} each month and keep discretionary expenses under 30% of income.`,
  });
});

app.post("/api/investment/opportunities", (req, res) => {
  const emergencyFund = Number(req.body.emergency_fund || 0);
  res.json({
    suggestion:
      emergencyFund >= 50000
        ? "Your emergency fund looks healthy. Consider diversified index funds or recurring deposits."
        : "Build your emergency fund first, then move gradually into low-cost diversified funds.",
  });
});

app.post("/api/risk/management-plan", (req, res) => {
  const monthlyIncome = Number(req.body.monthly_income || 0);
  res.json({
    plan: `Keep insurance active and maintain at least Rs ${Math.round(monthlyIncome * 6)} as a six-month safety buffer.`,
  });
});

app.post("/api/goals/long-term/analyze", (req, res) => {
  const target = Number(req.body.due_amount || req.body.total_amount || 0);
  const timeframe = Number(req.body.timeframe || 1);
  res.json({
    analysis: `Target: Rs ${target}. Save about Rs ${Math.ceil(target / Math.max(timeframe, 1))} per ${req.body.type === "shortTerm" ? "month" : "year"} to stay on track.`,
  });
});

app.post("/api/loan/analyze", (req, res) => {
  res.json({
    analysis: `For ${req.body.name || "this loan"}, keep EMI payments below 35% of monthly income and pay extra principal whenever possible.`,
  });
});

app.post("/api/gemini/investment-advice", (req, res) => {
  const analysis = buildAnalysis(req.body.transactions || []);
  res.json({
    advice: `${analysis.analysis} Keep a balanced portfolio after covering emergency savings.`,
  });
});

app.get("/goals", (req, res) => {
  res.json(goals);
});

app.post("/goals", (req, res) => {
  const goal = { id: crypto.randomUUID(), ...req.body };
  goals.push(goal);
  res.status(201).json(goal);
});

app.get("/loans", (req, res) => {
  res.json(loans);
});

app.post("/loans", (req, res) => {
  const loan = { id: crypto.randomUUID(), ...req.body };
  loans.push(loan);
  res.status(201).json(loan);
});

app.listen(port, () => {
  console.log(`FinAI backend running on http://localhost:${port}`);
});
