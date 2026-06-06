process.env.JWT_SEC = 'finance-test-secret';
process.env.NODE_ENV = 'test';

jest.mock('../config/database', () => jest.fn());

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const User = require('../models/userModel');

let mongo;
let token;
const ACCOUNT_NAME = 'TestBank';

beforeAll(async () => {
  mongo = await MongoMemoryServer.create({ instance: { startupTimeout: 120000 } });
  await mongoose.connect(mongo.getUri());

  // Create user and add a bank account
  const uid = `${Date.now()}${Math.random().toString(36).slice(2)}`;
  const reg = await request(app).post('/api/users/register').send({
    email: `tx_${uid}@test.com`,
    password: 'Secret123!',
    firstname: 'Tx',
    lastname: 'Tester',
    gender: 'male',
    occupation: 'trader',
    monthlyIncome: 12000,
  });
  token = reg.body.token;

  await request(app)
    .post('/api/users/bankaccounts')
    .set('Authorization', `Bearer ${token}`)
    .send({ accountName: ACCOUNT_NAME, accountNumber: '9000000001', bankAmount: 50000 });
}, 120000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

afterEach(async () => {
  // Clear transaction arrays but keep the user and bank account
  await User.updateMany({}, {
    $set: {
      expenses: [],
      incomes: [],
      budgets: [],
      savings: [],
      billReminders: [],
      goals: [],
    }
  });
  // Restore bank account balance after each test
  await User.updateMany(
    { 'bankAccounts.accountName': ACCOUNT_NAME },
    { $set: { 'bankAccounts.$.bankAmount': 50000, balance: 50000 } }
  );
});

// ---------------------------------------------------------------------------
// Income
// ---------------------------------------------------------------------------

describe('POST /api/users/incomes', () => {
  it('creates income and updates balance', async () => {
    const res = await request(app)
      .post('/api/users/incomes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        incomeAmount: 3000,
        incomeCategory: 'freelance',
        incomeDate: '2024-06-01',
        incomeName: 'Consulting payment',
        selectedAccount: ACCOUNT_NAME,
      });

    expect(res.status).toBe(201);
    expect(res.body.income.incomeAmount).toBe(3000);
    expect(res.body.income.incomeCategory).toBe('freelance');
    expect(res.body.income.incomeName).toBe('Consulting payment');
    expect(typeof res.body.balance).toBe('number');
  });

  it('rejects when no bank account set up (new user)', async () => {
    // Create a fresh user with no bank accounts
    const uid = `${Date.now()}${Math.random().toString(36).slice(2)}`;
    const reg = await request(app).post('/api/users/register').send({
      email: `nobank_${uid}@test.com`,
      password: 'Test123!',
      firstname: 'NoBankUser',
      lastname: 'Test',
      gender: 'female',
      occupation: 'analyst',
      monthlyIncome: 3000,
    });
    const newToken = reg.body.token;

    const res = await request(app)
      .post('/api/users/incomes')
      .set('Authorization', `Bearer ${newToken}`)
      .send({
        incomeAmount: 500,
        incomeCategory: 'salary',
        incomeDate: '2024-06-01',
        incomeName: 'Salary',
        selectedAccount: 'NonExistent',
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/bank account/i);
  });

  it('rejects request without auth token', async () => {
    const res = await request(app)
      .post('/api/users/incomes')
      .send({ incomeAmount: 100, incomeCategory: 'tip', incomeName: 'tip', selectedAccount: ACCOUNT_NAME });

    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// Expense
// ---------------------------------------------------------------------------

describe('POST /api/users/expenses', () => {
  it('creates expense and decreases balance', async () => {
    const res = await request(app)
      .post('/api/users/expenses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        expenseAmount: 1500,
        expenseCategory: 'food',
        expenseDate: '2024-06-02',
        expenseName: 'Groceries',
        selectedAccount: ACCOUNT_NAME,
      });

    expect(res.status).toBe(201);
    expect(res.body.expense.expenseAmount).toBe(1500);
    expect(res.body.expense.expenseCategory).toBe('food');
    expect(res.body.expense.expenseName).toBe('Groceries');
    expect(typeof res.body.balance).toBe('number');
  });

  it('rejects when selected bank account not found', async () => {
    const res = await request(app)
      .post('/api/users/expenses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        expenseAmount: 200,
        expenseCategory: 'bills',
        expenseDate: '2024-06-02',
        expenseName: 'Electricity',
        selectedAccount: 'NonExistentBank',
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  it('rejects request without auth token', async () => {
    const res = await request(app)
      .post('/api/users/expenses')
      .send({ expenseAmount: 100, expenseCategory: 'misc', expenseName: 'misc', selectedAccount: ACCOUNT_NAME });

    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// Transactions (combined income + expense list)
// ---------------------------------------------------------------------------

describe('GET /api/users/transactions', () => {
  it('returns empty array when no transactions', async () => {
    const res = await request(app)
      .get('/api/users/transactions')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('returns combined incomes and expenses after creation', async () => {
    await request(app)
      .post('/api/users/incomes')
      .set('Authorization', `Bearer ${token}`)
      .send({ incomeAmount: 2000, incomeCategory: 'salary', incomeDate: '2024-06-01', incomeName: 'June Salary', selectedAccount: ACCOUNT_NAME });

    await request(app)
      .post('/api/users/expenses')
      .set('Authorization', `Bearer ${token}`)
      .send({ expenseAmount: 500, expenseCategory: 'transport', expenseDate: '2024-06-02', expenseName: 'Taxi', selectedAccount: ACCOUNT_NAME });

    const res = await request(app)
      .get('/api/users/transactions')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  it('rejects request without auth token', async () => {
    const res = await request(app).get('/api/users/transactions');
    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// Budgets
// ---------------------------------------------------------------------------

describe('POST /api/users/budgets', () => {
  it('creates a budget entry', async () => {
    const res = await request(app)
      .post('/api/users/budgets')
      .set('Authorization', `Bearer ${token}`)
      .send({ budgetAmount: 20000, budgetCategory: 'housing', budgetTitle: 'Rent' });

    expect(res.status).toBe(201);
    expect(res.body.budget.budgetAmount).toBe(20000);
    expect(res.body.budget.budgetCategory).toBe('housing');
    expect(res.body.budget.budgetTitle).toBe('Rent');
  });

  it('rejects request without auth token', async () => {
    const res = await request(app)
      .post('/api/users/budgets')
      .send({ budgetAmount: 1000, budgetCategory: 'food', budgetTitle: 'Groceries' });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/users/budgets', () => {
  it('returns empty array initially', async () => {
    const res = await request(app)
      .get('/api/users/budgets')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(0);
  });

  it('returns budgets after creation', async () => {
    await request(app)
      .post('/api/users/budgets')
      .set('Authorization', `Bearer ${token}`)
      .send({ budgetAmount: 5000, budgetCategory: 'utilities', budgetTitle: 'Power bill' });

    const res = await request(app)
      .get('/api/users/budgets')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].budgetTitle).toBe('Power bill');
  });
});

// ---------------------------------------------------------------------------
// Savings
// ---------------------------------------------------------------------------

describe('POST /api/users/savings', () => {
  it('creates a savings entry and adjusts balance', async () => {
    // Use a past date so the controller's setTimeout (which has a 32-bit overflow bug
    // for far-future dates) is never scheduled — timeDifference <= 0 skips the setTimeout.
    const pastDate = new Date(Date.now() - 1000).toISOString();
    const res = await request(app)
      .post('/api/users/savings')
      .set('Authorization', `Bearer ${token}`)
      .send({ savingsName: 'Emergency Fund', saveAmount: 5000, savingsDate: pastDate });

    expect(res.status).toBe(201);
    expect(res.body.savings.savingsName).toBe('Emergency Fund');
    expect(res.body.savings.saveAmount).toBe(5000);
    expect(typeof res.body.balance).toBe('number');
  });

  it('rejects request without auth token', async () => {
    const res = await request(app)
      .post('/api/users/savings')
      .send({ savingsName: 'Test', saveAmount: 100, savingsDate: '2020-01-01' });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/users/savings', () => {
  it('returns empty array initially', async () => {
    const res = await request(app)
      .get('/api/users/savings')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('returns savings after creation', async () => {
    const pastDate = new Date(Date.now() - 1000).toISOString();
    await request(app)
      .post('/api/users/savings')
      .set('Authorization', `Bearer ${token}`)
      .send({ savingsName: 'Vacation', saveAmount: 3000, savingsDate: pastDate });

    const res = await request(app)
      .get('/api/users/savings')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].savingsName).toBe('Vacation');
  });
});

// ---------------------------------------------------------------------------
// Bill Reminders
// ---------------------------------------------------------------------------

describe('POST /api/users/bill-reminders', () => {
  it('creates a bill reminder', async () => {
    const res = await request(app)
      .post('/api/users/bill-reminders')
      .set('Authorization', `Bearer ${token}`)
      .send({ billName: 'Netflix', billFrequency: 'monthly', billPrice: 4500, dueDate: '2024-07-15' });

    expect(res.status).toBe(201);
    expect(res.body.billReminder.billName).toBe('Netflix');
    expect(res.body.billReminder.billPrice).toBe(4500);
    expect(res.body.billReminder.billFrequency).toBe('monthly');
  });

  it('rejects request without auth token', async () => {
    const res = await request(app)
      .post('/api/users/bill-reminders')
      .send({ billName: 'Gym', billFrequency: 'monthly', billPrice: 3000, dueDate: '2024-07-01' });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/users/bill-reminders', () => {
  it('returns empty array initially', async () => {
    const res = await request(app)
      .get('/api/users/bill-reminders')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('returns bill reminders after creation', async () => {
    await request(app)
      .post('/api/users/bill-reminders')
      .set('Authorization', `Bearer ${token}`)
      .send({ billName: 'DSTV', billFrequency: 'monthly', billPrice: 7000, dueDate: '2024-07-20' });

    const res = await request(app)
      .get('/api/users/bill-reminders')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].billName).toBe('DSTV');
  });
});

// ---------------------------------------------------------------------------
// Goals — known bug: controller sends targetDate but schema requires dueDate
// ---------------------------------------------------------------------------

describe('POST /api/users/goals (known bug)', () => {
  it('fails due to schema/controller mismatch (targetDate vs dueDate)', async () => {
    // The createGoal controller sends { name, targetAmount, targetDate } but the
    // goalSchema requires dueDate (not targetDate), causing a Mongoose ValidationError.
    // The errorHandler returns status 200 (not 4xx/5xx) because no explicit res.status()
    // is called before the throw — this is a second bug in the error handler.
    const res = await request(app)
      .post('/api/users/goals')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New Car', targetAmount: 500000, targetDate: '2025-12-01' });

    // Gets status 200 with error message due to the errorHandler using res.statusCode (default 200)
    expect(res.body.message).toBeDefined();
    // Confirm goal was NOT actually saved
    const listRes = await request(app)
      .get('/api/users/goals')
      .set('Authorization', `Bearer ${token}`);
    expect(listRes.body).toHaveLength(0);
  });
});
