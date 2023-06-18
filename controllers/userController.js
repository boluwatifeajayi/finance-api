const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel')


// Register user
const registerUser = asyncHandler(async (req, res) => {
  const { email, firstname, lastname, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    email,
    firstname,
    lastname,
    password: hashedPassword,
    savings: [],
    billReminders: [],
    budgets: [],
    goals: [],
    balance: 0,
    savingsBalance: 0,
  });

  if (user) {

    // Send response
    res.status(201).json({
      _id: user.id,
      firstname: user.firstname,
      email: user.email,
      lastname: user.lastname,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// Authenticate user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      firstname: user.firstname,
      email: user.email,
      lastname: user.lastname,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

// Get current user
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// udate
const updateUserInfo = asyncHandler(async (req, res) => {
  const { firstname, lastname, email } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.firstname = firstname || user.firstname;
  user.lastname = lastname || user.lastname;
  user.email = email || user.email;

  await user.save();

  res.status(200).json({
    message: 'User details updated successfully',
    user,
  });
});

// Create an expense
const createExpense = asyncHandler(async (req, res) => {
  const { expenseAmount, expenseCategory, expenseDate, expenseTitle } = req.body;

  // Create expense
  const expense = {
    expenseAmount,
    expenseCategory,
    expenseDate,
    expenseTitle
  };

  // Update user's balance by subtracting the expense amount
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const parsedExpenseAmount = parseFloat(expenseAmount); // Convert expense amount to a number
  if (isNaN(parsedExpenseAmount)) {
    res.status(400);
    throw new Error('Invalid expense amount');
  }

  user.balance -= parsedExpenseAmount;

  // Add the expense to the user's expenses array
  user.expenses.push(expense);

  await user.save();

  res.status(201).json({
    expense,
    balance: user.balance,
  });
});

  
  // Create an income
  const createIncome = asyncHandler(async (req, res) => {
    const { incomeAmount, incomeCategory, incomeDate, incomeTitle } = req.body;
  
    // Create income
    const income = {
      incomeAmount,
      incomeCategory,
      incomeDate,
      incomeTitle
    };
  
    // Update user's balance by adding the income amount
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
  
    const parsedIncomeAmount = parseFloat(incomeAmount); // Convert income amount to a number
    if (isNaN(parsedIncomeAmount)) {
      res.status(400);
      throw new Error('Invalid income amount');
    }
  
    user.balance += parsedIncomeAmount;
  
    // Add the income to the user's incomes array
    user.incomes.push(income);
  
    await user.save();
  
    res.status(201).json({
      income,
      balance: user.balance,
    });
  });
  
  
 // Get all incomes for the specific user
const getAllIncomes = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const userIncomes = user.incomes;
  res.status(200).json(userIncomes);
});

// Get all expenses for the specific user
const getAllExpenses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const userExpenses = user.expenses;
  res.status(200).json(userExpenses);
});

// user info
const getUserInfo = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('incomes').populate('expenses');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json(user);
});


const createSavings = asyncHandler(async (req, res) => {
  const { amount, name, targetDate } = req.body;

  // Convert amount to a number
  const savingsAmount = parseFloat(amount);

  // Create savings
  const savings = {
    amount: savingsAmount,
    name,
    targetDate,
  };

  // Add the savings to the user's savings array
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Subtract the savings amount from the user's balance
  user.balance -= savingsAmount;

  // Update user's savings balance by adding the savings amount
  user.savingsBalance += savingsAmount;

  user.savings.push(savings);

  await user.save();

  // Set a timeout to update the balances after the target date has elapsed
  const targetTime = new Date(targetDate).getTime();
  const currentTime = Date.now();
  const timeDifference = targetTime - currentTime;

  if (timeDifference > 0) {
    setTimeout(async () => {
      // Retrieve the updated user from the database
      const updatedUser = await User.findById(req.user._id);
      if (!updatedUser) {
        res.status(404);
        throw new Error('User not found');
      }

      // Find the savings in the updated user's savings array
      const updatedSavings = updatedUser.savings.find(s => s._id.toString() === savings._id.toString());
      if (!updatedSavings) {
        res.status(404);
        throw new Error('Savings not found');
      }

      // Subtract the savings amount from the user's savings balance
      updatedUser.savingsBalance -= updatedSavings.amount;

      // Add the savings amount back to the user's balance
      updatedUser.balance += updatedSavings.amount;

      await updatedUser.save();
    }, timeDifference);
  }

  res.status(201).json({
    savings,
    balance: user.balance,
  });
});


// Get all savings for the specific user
const getAllSavings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const userSavings = user.savings;
  res.status(200).json(userSavings);
});

// Create a bill reminder
const createBillReminder = asyncHandler(async (req, res) => {
  const { amount, name, dueDate } = req.body;

  // Create bill reminder
  const billReminder = {
    amount,
    name,
    dueDate,
  };

  // Add the bill reminder to the user's bill reminders array
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.billReminders.push(billReminder);

  await user.save();

  res.status(201).json({
    billReminder,
  });
});

// Get all bill reminders for the specific user
const getAllBillReminders = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const userBillReminders = user.billReminders;
  res.status(200).json(userBillReminders);
});

// Create a budget
const createBudget = asyncHandler(async (req, res) => {
  const { limit, budgetCategory, budgetTitle  } = req.body;

  // Create budget
  const budget = {
    limit,
    budgetCategory,
    budgetTitle
  };

  // Add the budget to the user's budgets array
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.budgets.push(budget);

  await user.save();

  res.status(201).json({
    budget,
  });
});

// Get all budgets for the specific user
const getAllBudgets = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const userBudgets = user.budgets;
  res.status(200).json(userBudgets);
});

// Create a goal
const createGoal = asyncHandler(async (req, res) => {
  const { name, targetAmount, targetDate } = req.body;

  // Create goal
  const goal = {
    name,
    targetAmount,
    targetDate,
  };

  // Add the goal to the user's goals array
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.goals.push(goal);

  await user.save();

  res.status(201).json({
    goal,
  });
});

// Get all goals for the specific user
const getAllGoals = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const userGoals = user.goals;
  res.status(200).json(userGoals);
});

const personalDetails = asyncHandler(async (req, res) => {
  const { monthlyIncome, feeding, monthlyBudget, desiredMonthlySavings, mescellenious } = req.body;
  
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  user.monthlyIncome = monthlyIncome;
  user.monthlyBudget = monthlyBudget;
  user.feeding = feeding;
  user.desiredMonthlySavings = desiredMonthlySavings;
  user.mescellenious = mescellenious;
  
  await user.save();
  
  res.status(200).json({
    message: 'Personal details updated successfully',
    user,
  });
});

// Generate JWT
const generateToken = (userid) => {
  return jwt.sign({ userid }, process.env.JWT_SEC, {
    expiresIn: '5d',
  });
};

module.exports = {
  registerUser,
  loginUser,
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
  personalDetails,
  updateUserInfo,
};
