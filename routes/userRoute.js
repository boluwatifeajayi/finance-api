const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, createExpense, createIncome, getAllIncomes, getAllExpenses, getUserInfo, createSavings, getAllSavings, createBillReminder, getAllBillReminders, createBudget, getAllBudgets, createGoal, getAllGoals } = require('../controllers/userController');
const { protect } = require('../middlewares/userAuthMiddleware');

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

module.exports = router;
