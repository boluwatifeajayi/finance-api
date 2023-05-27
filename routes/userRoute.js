const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, createExpense, createIncome, getAllIncomes, getAllExpenses, getUserInfo, createSavings, getAllSavings, createBillReminder, getAllBillReminders, createBudget, getAllBudgets, createGoal, getAllGoals, personalDetails } = require('../controllers/userController');
const { protect } = require('../middlewares/userAuthMiddleware');

// Existing routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/expenses', protect, createExpense);
router.post('/incomes', protect, createIncome);
router.get('/incomes', protect, getAllIncomes);
router.get('/expenses', protect, getAllExpenses);
router.get('/user-info', protect, getUserInfo);
router.post('/savings', protect, createSavings);
router.get('/savings', protect, getAllSavings);
router.post('/bill-reminders', protect, createBillReminder);
router.get('/bill-reminders', protect, getAllBillReminders);
router.post('/budgets', protect, createBudget);
router.get('/budgets', protect, getAllBudgets);
router.post('/goals', protect, createGoal);
router.get('/goals', protect, getAllGoals);
router.get('/user-details', protect, personalDetails);

// New routes for reporting and analytics
router.get('/reports/expenses', protect, (req, res) => {
  const user = req.user;
  const expenseReport = user.generateExpenseReport();
  res.json(expenseReport);
});

router.get('/reports/budgets', protect, (req, res) => {
  const user = req.user;
  const budgetReport = user.generateBudgetReport();
  res.json(budgetReport);
});

router.get('/reports/savings', protect, (req, res) => {
  const user = req.user;
  const savingsReport = user.generateSavingsReport();
  res.json(savingsReport);
});

router.get('/reports/goals', protect, (req, res) => {
  const user = req.user;
  const goalReport = user.generateGoalReport();
  res.json(goalReport);
});

module.exports = router;
