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

beforeAll(async () => {
  mongo = await MongoMemoryServer.create({ instance: { startupTimeout: 120000 } });
  await mongoose.connect(mongo.getUri());

  const uid = `${Date.now()}${Math.random().toString(36).slice(2)}`;
  const reg = await request(app).post('/api/users/register').send({
    email: `bank_${uid}@test.com`,
    password: 'Secret123!',
    firstname: 'Bank',
    lastname: 'Tester',
    gender: 'female',
    occupation: 'accountant',
    monthlyIncome: 8000,
  });
  token = reg.body.token;
}, 120000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

afterEach(async () => {
  // Clear bank accounts after each test but keep the user
  await User.updateMany({}, { $set: { bankAccounts: [], balance: 0 } });
});

describe('POST /api/users/bankaccounts', () => {
  it('adds a bank account and updates balance', async () => {
    const res = await request(app)
      .post('/api/users/bankaccounts')
      .set('Authorization', `Bearer ${token}`)
      .send({ accountName: 'GTBank', accountNumber: '0123456789', bankAmount: 10000 });

    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/added/i);
    expect(res.body.bankAccount.accountName).toBe('GTBank');
    expect(res.body.bankAccount.accountNumber).toBe('0123456789');
    expect(res.body.bankAccount.bankAmount).toBe(10000);
    expect(res.body.balance).toBe(10000);
  });

  it('rejects duplicate account name', async () => {
    const payload = { accountName: 'AccessBank', accountNumber: '9876543210', bankAmount: 5000 };
    await request(app)
      .post('/api/users/bankaccounts')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    const res = await request(app)
      .post('/api/users/bankaccounts')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('rejects missing accountName', async () => {
    const res = await request(app)
      .post('/api/users/bankaccounts')
      .set('Authorization', `Bearer ${token}`)
      .send({ accountNumber: '1111111111', bankAmount: 2000 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  it('rejects missing bankAmount', async () => {
    const res = await request(app)
      .post('/api/users/bankaccounts')
      .set('Authorization', `Bearer ${token}`)
      .send({ accountName: 'ZenithBank', accountNumber: '2222222222' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  it('rejects request without token', async () => {
    const res = await request(app)
      .post('/api/users/bankaccounts')
      .send({ accountName: 'UBA', accountNumber: '3333333333', bankAmount: 1000 });

    expect(res.status).toBe(401);
  });
});

describe('GET /api/users/bankaccounts', () => {
  it('returns empty array when no accounts added', async () => {
    const res = await request(app)
      .get('/api/users/bankaccounts')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(0);
  });

  it('returns all bank accounts after adding them', async () => {
    await request(app)
      .post('/api/users/bankaccounts')
      .set('Authorization', `Bearer ${token}`)
      .send({ accountName: 'First Bank', accountNumber: '4444444444', bankAmount: 6000 });

    await request(app)
      .post('/api/users/bankaccounts')
      .set('Authorization', `Bearer ${token}`)
      .send({ accountName: 'Ecobank', accountNumber: '5555555555', bankAmount: 3000 });

    const res = await request(app)
      .get('/api/users/bankaccounts')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
    expect(res.body.map(a => a.accountName)).toContain('First Bank');
    expect(res.body.map(a => a.accountName)).toContain('Ecobank');
  });

  it('rejects request without token', async () => {
    const res = await request(app).get('/api/users/bankaccounts');
    expect(res.status).toBe(401);
  });
});
