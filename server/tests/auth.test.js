import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { createApp } from '../server.js';
import User from '../models/User.js';

let mongod, app;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret-at-least-32-characters-long';
  process.env.NODE_ENV = 'test';
  process.env.CLIENT_URL = 'http://localhost:5173';
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  app = createApp();
});

afterAll(async () => { await mongoose.disconnect(); if (mongod) await mongod.stop(); });
beforeEach(async () => { await User.deleteMany({}); });

describe('SecureAuth critical flows', () => {
  it('registers, hashes passwords, and rejects duplicate emails', async () => {
    const payload = { fullName:'Test User', email:'Test@example.com', password:'Secure123', terms:true };
    const weakPassword = await request(app).post('/api/auth/register').send({ ...payload, password:'@ashifhuss3' });
    expect(weakPassword.status).toBe(400);
    expect(weakPassword.body.message).toBe('Password must include an uppercase letter');

    const first = await request(app).post('/api/auth/register').send(payload);
    expect(first.status).toBe(201);
    const user = await User.findOne({ email:'test@example.com' }).select('+password');
    expect(user.password).not.toBe('Secure123');
    expect(await user.comparePassword('Secure123')).toBe(true);
    const duplicate = await request(app).post('/api/auth/register').send(payload);
    expect(duplicate.status).toBe(409);
  });

  it('logs in valid users and rejects invalid credentials', async () => {
    await User.create({ fullName:'Test User', email:'test@example.com', password:'Secure123' });
    const invalid = await request(app).post('/api/auth/login').send({ email:'test@example.com', password:'Wrong123!' });
    expect(invalid.status).toBe(401);
    const valid = await request(app).post('/api/auth/login').send({ email:'test@example.com', password:'Secure123', remember:true });
    expect(valid.status).toBe(200);
    expect(valid.headers['set-cookie'].join(';')).toContain('auth_token');
  });

  it('protects profile routes and allows logout', async () => {
    const denied = await request(app).get('/api/users/profile');
    expect(denied.status).toBe(401);
    await User.create({ fullName:'Test User', email:'test@example.com', password:'Secure123' });
    const login = await request(app).post('/api/auth/login').send({ email:'test@example.com', password:'Secure123' });
    const cookies = login.headers['set-cookie'];
    const csrf = login.headers['set-cookie'].find(v => v.startsWith('csrf_token='));
    const csrfToken = csrf?.split(';')[0].split('=')[1];
    const profile = await request(app).get('/api/users/profile').set('Cookie', cookies);
    expect(profile.status).toBe(200);
    const changed = await request(app).patch('/api/users/profile').set('Cookie', cookies).set('X-CSRF-Token', csrfToken).send({ fullName:'Updated Name', isAdmin:true });
    expect(changed.status).toBe(200);
    expect(changed.body.data.user.fullName).toBe('Updated Name');
    expect(changed.body.data.user.isAdmin).toBeUndefined();
  });

  it('never reveals whether a forgot-password account exists', async () => {
    const unknown = await request(app).post('/api/auth/forgot-password').send({ email:'missing@example.com' });
    expect(unknown.status).toBe(200);
    expect(unknown.body.message).toContain('If an account exists');
  });

  it('rejects expired password reset and email verification tokens', async () => {
    const reset = await request(app).post('/api/auth/reset-password').send({ token:'a'.repeat(40), password:'Secure123' });
    expect(reset.status).toBe(400);
    const verify = await request(app).post('/api/auth/verify-email').send({ token:'b'.repeat(40) });
    expect(verify.status).toBe(400);
  });
});
