process.env.JWT_SEC = 'finance-test-secret';
process.env.NODE_ENV = 'test';

jest.mock('../config/database', () => jest.fn());

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const Admin = require('../models/adminModel');
const Visual = require('../models/visualsModel');

let mongo;
let adminToken;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create({ instance: { startupTimeout: 120000 } });
  await mongoose.connect(mongo.getUri());

  const uid = `${Date.now()}${Math.random().toString(36).slice(2)}`;
  const reg = await request(app).post('/api/admin/register').send({
    username: `visual_admin_${uid}`,
    email: `visual_${uid}@admin.com`,
    password: 'AdminPass123!',
  });
  adminToken = reg.body.token;
}, 120000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

afterEach(async () => {
  await Visual.deleteMany({});
});

describe('POST /api/visuals/create', () => {
  it('creates a visual with admin token', async () => {
    const res = await request(app)
      .post('/api/visuals/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Budgeting 101', content: 'Learn to manage your money wisely.' });

    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.title).toBe('Budgeting 101');
    expect(res.body.content).toBe('Learn to manage your money wisely.');
    expect(res.body.admin).toBeDefined();
  });

  it('rejects create without admin token', async () => {
    const res = await request(app)
      .post('/api/visuals/create')
      .send({ title: 'Test', content: 'Should fail.' });

    expect(res.status).toBe(401);
  });
});

describe('GET /api/visuals/all', () => {
  it('returns empty array when no visuals', async () => {
    const res = await request(app).get('/api/visuals/all');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(0);
  });

  it('returns all visuals sorted by updatedAt desc (public route)', async () => {
    await request(app)
      .post('/api/visuals/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'First Article', content: 'Content one.' });

    await request(app)
      .post('/api/visuals/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Second Article', content: 'Content two.' });

    const res = await request(app).get('/api/visuals/all');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    // Sorted by updatedAt descending — newest last-created appears first
    expect(res.body[0].title).toBe('Second Article');
    expect(res.body[1].title).toBe('First Article');
  });
});

describe('GET /api/visuals/:visualid', () => {
  it('returns single visual by id (public route)', async () => {
    const create = await request(app)
      .post('/api/visuals/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Detail Test', content: 'Detailed content here.' });

    const visualId = create.body._id;

    const res = await request(app).get(`/api/visuals/${visualId}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(visualId);
    expect(res.body.title).toBe('Detail Test');
  });

  it('returns null body for non-existent visual id (controller does not 404)', async () => {
    // getSingleVisual returns res.status(200).json(null) when not found — no 404 guard in the controller
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/visuals/${fakeId}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeNull();
  });
});
