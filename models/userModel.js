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

module.exports = mongoose.model('User', userSchema);
