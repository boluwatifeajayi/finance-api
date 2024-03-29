const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel')


// Register user
const registerUser = asyncHandler(async (req, res) => {
  const { email, firstname, lastname, password, gender, occupation, monthlyIncome } = req.body;
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
    gender,
    
    occupation,
    monthlyIncome,
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
      occupation: user.occupation,
      gender: user.gender,
      monthlyIncome: user.monthlyIncome,
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
      occupation: user.occupation,
      gender: user.gender,
      monthlyIncome: user.monthlyIncome,
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

// update user
const updateUserInfo = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, age, occupation, monthlyIncome, gender } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.firstname = firstname || user.firstname;
  user.lastname = lastname || user.lastname;
  user.occupation = occupation || user.occupation;
  user.age = age || user.age;
  user.monthlyIncome = monthlyIncome || user.monthlyIncome;
  user.gender = gender || user.gender;

  await user.save();

  res.status(200).json({
    message: 'User details updated successfully',
    user: {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      age: user.age,
      occupation: user.occupation,
      monthlyIncome: user.monthlyIncome,
      gender: user.gender,
      // Add any other relevant user details you want to return
    },
  });
});

// Create an expense
const createExpense = asyncHandler(async (req, res) => {
  const { expenseAmount, expenseCategory, expenseDate, expenseName, selectedAccount } = req.body;

  const parsedExpenseAmount = parseFloat(expenseAmount);
  if (isNaN(parsedExpenseAmount)) {
    res.status(400);
    throw new Error('Invalid expense amount');
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if the user has at least one bank account
  if (user.bankAccounts.length === 0) {
    res.status(400);
    throw new Error('No bank account found. Please add a bank account before creating an expense.');
  }

  // Find the selected bank account by account name
  const selectedBankAccount = user.bankAccounts.find(account => account.accountName === selectedAccount);
  if (!selectedBankAccount) {
    res.status(400);
    throw new Error('Selected bank account not found');
  }

  // Deduct the expense amount from the selected bank account
  selectedBankAccount.bankAmount -= parsedExpenseAmount;

  // Update the user's balance
  user.balance -= parsedExpenseAmount;

  // Add the expense to the user's expenses array
  user.expenses.push({
    expenseAmount: parsedExpenseAmount,
    expenseCategory,
    expenseDate,
    expenseName
  });

  await user.save();

  res.status(201).json({
    expense: {
      expenseAmount: parsedExpenseAmount,
      expenseCategory,
      expenseDate,
      expenseName,
    },
    balance: user.balance,
  });
});

// Create an income
const createIncome = asyncHandler(async (req, res) => {
  const { incomeAmount, incomeCategory, incomeDate, selectedAccount, incomeName } = req.body;

  const parsedIncomeAmount = parseFloat(incomeAmount);
  if (isNaN(parsedIncomeAmount)) {
    res.status(400);
    throw new Error('Invalid income amount');
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if the user has at least one bank account
  if (user.bankAccounts.length === 0) {
    res.status(400);
    throw new Error('No bank account found. Please add a bank account before creating an income.');
  }

  // Find the selected bank account by account name
  const selectedBankAccount = user.bankAccounts.find(account => account.accountName === selectedAccount);
  if (!selectedBankAccount) {
    res.status(400);
    throw new Error('Selected bank account not found');
  }

  // Add the income amount to the selected bank account
  selectedBankAccount.bankAmount += parsedIncomeAmount;

  // Update the user's balance
  user.balance += parsedIncomeAmount;

  // Add the income to the user's incomes array
  user.incomes.push({
    incomeAmount: parsedIncomeAmount,
    incomeCategory,
    incomeDate,
    incomeName
  });

  await user.save();

  res.status(201).json({
    income: {
      incomeAmount: parsedIncomeAmount,
      incomeCategory,
      incomeDate,
      incomeName
    },
    balance: user.balance,
  });
});



// Get all incomes for the specific user
const getAllIncomes = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('incomes.bankAccount', 'accountName');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const userIncomes = user.incomes.map(income => ({
    ...income.toObject(),
    bankAccount: income.bankAccount.accountName
  }));
  
  res.status(200).json(userIncomes);
});

// Get all expenses for the specific user
const getAllExpenses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('expenses.bankAccount', 'accountName');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const userExpenses = user.expenses.map(expense => ({
    ...expense.toObject(),
    bankAccount: expense.bankAccount.accountName
  }));
  
  res.status(200).json(userExpenses);
});



// Get all incomes and expenses for the specific user, sorted by date
// Get all incomes and expenses for the specific user sorted by date
const getAllTransactions = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const allTransactions = [...user.incomes, ...user.expenses];
  // Sort the transactions by date in descending order (newest first)
  allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.status(200).json(allTransactions);
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
  const { savingsName, saveAmount, savingsDate } = req.body;

  // Convert amount to a number
  const savingsAmount = parseFloat(saveAmount);

  // Create savings
  const savings = {
    saveAmount: savingsAmount,
    savingsName,
    savingsDate,
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
  const targetTime = new Date(savingsDate).getTime();
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
      updatedUser.savingsBalance -= updatedSavings.saveAmount;

      // Add the savings amount back to the user's balance
      updatedUser.balance += updatedSavings.saveAmount;

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
  const { billName, billFrequency, billPrice, dueDate } = req.body;

  // Create bill reminder
  const billReminder = {
    billName,
    billFrequency,
    billPrice,
    dueDate
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
  const { budgetAmount, budgetCategory, budgetTitle  } = req.body;

  // Create budget
  const budget = {
    budgetAmount,
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
  const { monthlyIncome, feeding, monthlyBudget, desiredMonthlySavings, pref, mescellenious } = req.body;
  
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  user.monthlyIncome = monthlyIncome;
  user.pref = pref;
  user.monthlyBudget = monthlyBudget;
  user.feeding = feeding;
  user.desiredMonthlySavings = desiredMonthlySavings;
  user.mescellenious = mescellenious;

  
  await user.save();
  
  res.status(200).json({
    message: 'Personal details updated successfully',
    user
  });
});

// Savings Inclined
const savingsInclined = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const monthlyIncome = user.monthlyIncome;

  const savingsBudget = 0.6 * monthlyIncome;
  const savingsFeeding = 0.4 * monthlyIncome;

  user.savingsBudget = savingsBudget;
  user.savingsFeeding = savingsFeeding;

  await user.save();

  res.status(200).json({
    message: 'Savings inclined updated successfully',
    user,
  });
});

// Feeding Inclined
const feedingInclined = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const monthlyIncome = user.monthlyIncome;

  const feedingBudget = 0.85 * monthlyIncome;
  const feedingSavings = 0.15 * monthlyIncome;

  user.feedingBudget = feedingBudget;
  user.feedingSavings = feedingSavings;

  await user.save();

  res.status(200).json({
    message: 'Feeding inclined updated successfully',
    user,
  });
});

// add bank account
const addBankAccount = asyncHandler(async (req, res) => {
  const { accountName, bankAmount, accountNumber } = req.body;

  if (!accountName || !bankAmount || !accountNumber) {
    res.status(400);
    throw new Error('Please provide an account name, amount, and account number');
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if the accountNumber already exists
  const existingAccount = user.bankAccounts.find(account => account.accountName === accountName);
  if (existingAccount) {
    res.status(400);
    throw new Error('Account already exists');
  }

  // Parse the bankAmount to a number before adding to the user's balance
  const parsedBankAmount = parseFloat(bankAmount);
  if (isNaN(parsedBankAmount)) {
    res.status(400);
    throw new Error('Invalid bank amount');
  }

  // Add the new bank account to the bankAccounts array
  user.bankAccounts.push({
    accountName,
    bankAmount: parsedBankAmount, // Use the parsed bankAmount
    accountNumber
  });

  // Update the user's balance with the new bankAmount
  user.balance += parsedBankAmount;

  await user.save();

  res.status(201).json({
    message: 'Bank account added successfully',
    bankAccount: {
      accountName,
      bankAmount: parsedBankAmount, // Use the parsed bankAmount in the response
      accountNumber
    },
    balance: user.balance,
  });
});



// get all banks 
const getAllBankAccounts = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const bankAccounts = user.bankAccounts;
  res.status(200).json(bankAccounts);
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
  savingsInclined,
  feedingInclined,
  getAllTransactions,
  addBankAccount,
  getAllBankAccounts
};
