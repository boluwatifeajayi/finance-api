import axios from 'axios';

const API_URL = "https://prime-app.cyclic.app/api/users";
axios.defaults.withCredentials = true;

// register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// get authenticated user information
const getMe = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/me`, config);
  return response.data;
};

// create expense
const createExpense = async (expenseData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(`${API_URL}/expenses`, expenseData, config);
  return response.data;
};

// create income
const createIncome = async (incomeData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(`${API_URL}/incomes`, incomeData, config);
  return response.data;
};

// get all incomes
const getAllIncomes = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/incomes`, config);
  return response.data;
};

// get all expenses
const getAllExpenses = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/expenses`, config);
  return response.data;
};

// get user info
const getUserInfo = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/user-info`, config);
  return response.data;
};

// create savings
const createSavings = async (savingsData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(`${API_URL}/savings`, savingsData, config);
  return response.data;
};

// get all savings
const getAllSavings = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/savings`, config);
  return response.data;
};

// create bill reminder
const createBillReminder = async (billReminderData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(`${API_URL}/bill-reminders`, billReminderData, config);
  return response.data;
};

// get all bill reminders
const getAllBillReminders = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/bill-reminders`, config);
  return response.data;
};

// create budget
const createBudget = async (budgetData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(`${API_URL}/budgets`, budgetData, config);
  return response.data;
};

// get all budgets
const getAllBudgets = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/budgets`, config);
  return response.data;
};

// create goal
const createGoal = async (goalData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(`${API_URL}/goals`, goalData, config);
  return response.data;
};

// get all goals
const getAllGoals = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/goals`, config);
  return response.data;
};

// update user info
const updateUserInfo = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(`${API_URL}/user-update`, userData, config);
  return response.data;
};

// update user info
const addPersonalDetails = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(`${API_URL}/user-details`, userData, config);
  return response.data;
};

const userService = {
  register,
  login,
  getMe,
  createExpense,
  createIncome,
  getAllIncomes,
  getAllExpenses,
  getUserInfo,
  createSavings,
  getAllSavings,
  createBillReminder,
  getAllBillReminders,
  createBudget,
  getAllBudgets,
  createGoal,
  getAllGoals,
  updateUserInfo,
  addPersonalDetails,
  logout: () => {
    localStorage.removeItem('user');
  },
};

export default userService;
