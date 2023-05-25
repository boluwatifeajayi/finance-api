const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  amount: {
    type: Number,
    required: [true, 'Please add an amount']
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  date: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: [true, 'Please add a name']
  }
});

const incomeSchema = new Schema({
  amount: {
    type: Number,
    required: [true, 'Please add an amount']
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  date: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: [true, 'Please add a name']
  }
});

const budgetSchema = new Schema({
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  limit: {
    type: Number,
    required: [true, 'Please add a limit']
  }
});

const goalSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  targetAmount: {
    type: Number,
    required: [true, 'Please add a target amount']
  },
  currentAmount: {
    type: Number,
    default: 0
  },
  dueDate: {
    type: Date,
    required: [true, 'Please add a due date']
  }
});

const billReminderSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  dueDate: {
    type: Date,
    required: [true, 'Please add a due date']
  }
});

const savingsSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  amount: {
    type: Number,
    required: [true, 'Please add a target amount']
  },
  targetDate: {
    type: Date,
    required: [true, 'Please add a date']
  }
});

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: [true, 'User already exists']
  },
  firstname: {
    type: String,
    default: ''
  },
  lastname: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    required: [true, 'Please add a password']
  },
  balance: {
    type: Number,
    default: 0
  },
  savingsBalance: {
	  type: Number,
	  default: 0
  },
  expenses: [expenseSchema],
  incomes: [incomeSchema],
  budgets: [budgetSchema],
  goals: [goalSchema],
  billReminders: [billReminderSchema],
  savings: [savingsSchema]
}, {
  timestamps: true
});

// Custom methods to generate reports and provide analytics
userSchema.methods.generateExpenseReport = function() {
  // Calculate total expenses
  const totalExpenses = this.expenses.reduce((acc, expense) => acc + expense.amount, 0);

  // Generate report
  const report = {
    totalExpenses,
    expenseCount: this.expenses.length,
    // Add more relevant fields for the expense report
  };

  return report;
};

userSchema.methods.generateBudgetReport = function() {
  // Calculate total budget limits
  const totalLimits = this.budgets.reduce((acc, budget) => acc + budget.limit, 0);

  // Generate report
  const report = {
    totalLimits,
    budgetCount: this.budgets.length,
    // Add more relevant fields for the budget report
  };

  return report;
};

userSchema.methods.generateSavingsReport = function() {
  // Calculate total savings amount
  const totalSavings = this.savings.reduce((acc, saving) => acc + saving.amount, 0);

  // Generate report
  const report = {
    totalSavings,
    savingCount: this.savings.length,
    // Add more relevant fields for the savings report
  };

  return report;
};

userSchema.methods.generateGoalReport = function() {
  // Calculate total target amount and current amount of goals
  const totalTargetAmount = this.goals.reduce((acc, goal) => acc + goal.targetAmount, 0);
  const totalCurrentAmount = this.goals.reduce((acc, goal) => acc + goal.currentAmount, 0);

  // Generate report
  const report = {
    totalTargetAmount,
    totalCurrentAmount,
    goalCount: this.goals.length,
    // Add more relevant fields for the goal report
  };

  return report;
};

module.exports = mongoose.model('User', userSchema);
