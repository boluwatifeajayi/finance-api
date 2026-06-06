process.env.JWT_SEC = 'finance-test-secret';
process.env.NODE_ENV = 'test';

jest.mock('../config/database', () => jest.fn());

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const User = require('../models/userModel');

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create({ instance: { startupTimeout: 120000 } });
  await mongoose.connect(mongo.getUri());
}, 120000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

const makeUser = (overrides = {}) => {
  const uid = `${Date.now()}${Math.random().toString(36).slice(2)}`;
  return {
    email: `user_${uid}@test.com`,
    password: 'Secret123!',
    firstname: 'Test',
    lastname: 'User',
    gender: 'male',
    occupation: 'engineer',
    monthlyIncome: 5000,
    ...overrides,
  };
};

describe('POST /api/users/register', () => {
  it('creates a new user and returns token', async () => {
    const data = makeUser();
    const res = await request(app).post('/api/users/register').send(data);

    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.token).toBeDefined();
    expect(res.body.email).toBe(data.email);
    expect(res.body.firstname).toBe(data.firstname);
    expect(res.body.lastname).toBe(data.lastname);
    expect(res.body.occupation).toBe(data.occupation);
    expect(res.body.gender).toBe(data.gender);
    // no success field — flat response
    expect(res.body.success).toBeUndefined();
    // password must not be returned
    expect(res.body.password).toBeUndefined();
  });

  it('rejects duplicate email', async () => {
    const data = makeUser();
    await request(app).post('/api/users/register').send(data);

    const res = await request(app).post('/api/users/register').send(data);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('rejects missing email', async () => {
    const data = makeUser({ email: undefined });
    const res = await request(app).post('/api/users/register').send(data);
    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  it('rejects missing password', async () => {
    const data = makeUser({ password: undefined });
    const res = await request(app).post('/api/users/register').send(data);
    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  it('stores a hashed password (not plaintext)', async () => {
    const data = makeUser();
    await request(app).post('/api/users/register').send(data);

    const saved = await User.findOne({ email: data.email });
    expect(saved.password).not.toBe(data.password);
    expect(saved.password).toMatch(/^\$2[aby]\$/);
  });
});

describe('POST /api/users/login', () => {
  let seed;

  beforeEach(async () => {
    seed = makeUser();
    await request(app).post('/api/users/register').send(seed);
  });

  it('returns token for valid credentials', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: seed.email, password: seed.password });

    expect(res.status).toBe(200);
    expect(res.body._id).toBeDefined();
    expect(res.body.token).toBeDefined();
    expect(res.body.email).toBe(seed.email);
  });

  it('rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: seed.email, password: 'wrongpassword' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });

  it('rejects non-existent email', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'ghost@nowhere.com', password: seed.password });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });
});

describe('GET /api/users/me', () => {
  let token;
  let seed;

  beforeEach(async () => {
    seed = makeUser();
    const reg = await request(app).post('/api/users/register').send(seed);
    token = reg.body.token;
  });

  it('returns current user with valid token', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(seed.email);
  });

  it('rejects request without token', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.status).toBe(401);
    expect(res.body.message).toBeDefined();
  });

  it('rejects invalid token', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Bearer totally.invalid.token');
    expect(res.status).toBe(401);
  });
});

describe('PUT /api/users/user-update', () => {
  let token;

  beforeEach(async () => {
    const seed = makeUser();
    const reg = await request(app).post('/api/users/register').send(seed);
    token = reg.body.token;
  });

  it('updates user fields and returns updated profile', async () => {
    const res = await request(app)
      .put('/api/users/user-update')
      .set('Authorization', `Bearer ${token}`)
      .send({ firstname: 'Updated', lastname: 'Name', occupation: 'designer' });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/updated/i);
    expect(res.body.user.firstname).toBe('Updated');
    expect(res.body.user.lastname).toBe('Name');
    expect(res.body.user.occupation).toBe('designer');
  });

  it('keeps existing values for omitted fields', async () => {
    const seed = makeUser({ firstname: 'Original' });
    const reg = await request(app).post('/api/users/register').send(seed);
    const t = reg.body.token;

    const res = await request(app)
      .put('/api/users/user-update')
      .set('Authorization', `Bearer ${t}`)
      .send({ lastname: 'ChangedOnly' });

    expect(res.body.user.firstname).toBe('Original');
    expect(res.body.user.lastname).toBe('ChangedOnly');
  });
});
