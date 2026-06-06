process.env.JWT_SEC = 'finance-test-secret';
process.env.NODE_ENV = 'test';

jest.mock('../config/database', () => jest.fn());

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const Admin = require('../models/adminModel');

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
  await Admin.deleteMany({});
});

const makeAdmin = (overrides = {}) => {
  const uid = `${Date.now()}${Math.random().toString(36).slice(2)}`;
  return {
    username: `admin_${uid}`,
    email: `admin_${uid}@test.com`,
    password: 'AdminPass123!',
    ...overrides,
  };
};

describe('POST /api/admin/register', () => {
  it('creates a new admin and returns token', async () => {
    const data = makeAdmin();
    const res = await request(app).post('/api/admin/register').send(data);

    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.token).toBeDefined();
    expect(res.body.username).toBe(data.username);
    expect(res.body.email).toBe(data.email);
    // flat response — no success field
    expect(res.body.success).toBeUndefined();
    expect(res.body.password).toBeUndefined();
  });

  it('rejects duplicate username', async () => {
    const data = makeAdmin();
    await request(app).post('/api/admin/register').send(data);

    const dup = { ...data, email: `different_${Date.now()}@test.com` };
    const res = await request(app).post('/api/admin/register').send(dup);
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.message).toBeDefined();
  });
});

describe('POST /api/admin/login', () => {
  let seed;

  beforeEach(async () => {
    seed = makeAdmin();
    await request(app).post('/api/admin/register').send(seed);
  });

  it('returns token for valid credentials', async () => {
    // loginAdmin looks up by username, not email
    const res = await request(app)
      .post('/api/admin/login')
      .send({ username: seed.username, password: seed.password });

    expect(res.status).toBe(200);
    expect(res.body._id).toBeDefined();
    expect(res.body.token).toBeDefined();
    expect(res.body.username).toBe(seed.username);
  });

  it('rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ username: seed.username, password: 'wrongpassword' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  it('rejects non-existent username', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ username: 'ghost_admin_xyz', password: seed.password });

    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
  });
});

describe('GET /api/admin/me', () => {
  let token;
  let seed;

  beforeEach(async () => {
    seed = makeAdmin();
    const reg = await request(app).post('/api/admin/register').send(seed);
    token = reg.body.token;
  });

  it('returns current admin with valid token', async () => {
    const res = await request(app)
      .get('/api/admin/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.username).toBe(seed.username);
    expect(res.body.password).toBeUndefined();
  });

  it('rejects request without token', async () => {
    const res = await request(app).get('/api/admin/me');
    expect(res.status).toBe(401);
    expect(res.body.message).toBeDefined();
  });

  it('rejects invalid token', async () => {
    const res = await request(app)
      .get('/api/admin/me')
      .set('Authorization', 'Bearer bad.token.value');
    expect(res.status).toBe(401);
  });
});
