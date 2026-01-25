import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server.js';

describe('Backend API', () => {
    it('GET /api/content should return 200 and a JSON object', async () => {
        const res = await request(app).get('/api/content');
        expect(res.status).toBe(200);
        expect(res.header['content-type']).toMatch(/json/);
        expect(typeof res.body).toBe('object');
    });

    it('POST /api/login should fail with incorrect credentials', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ username: 'admin', password: 'wrongpassword' });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error');
    });

    it('POST /api/content should return 401 without auth cookie', async () => {
        const res = await request(app)
            .post('/api/content')
            .send({ some: 'data' });

        expect(res.status).toBe(401);
    });
});

describe('Authentication Flow', () => {
    beforeAll(async () => {
        const bcrypt = await import('bcryptjs');
        process.env.ADMIN_USERNAME = 'admin';
        // Use a fixed hash for 'password123'
        process.env.ADMIN_PASSWORD_HASH = bcrypt.default.hashSync('password123', 10);
        process.env.JWT_SECRET = 'test-secret';
    });

    it('POST /api/login should login successfully with correct credentials', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ username: 'admin', password: 'password123' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ success: true });
        // Check for the httpOnly cookie
        const cookies = res.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(cookies[0]).toMatch(/auth_token=/);
    });
});
