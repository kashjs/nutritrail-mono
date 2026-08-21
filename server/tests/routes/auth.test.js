const request = require('supertest');
const app = require('../../app');

describe('POST /register', () => {
    it('creates a new ser and returns 201', async () => {
        const res = await request(app)
            .post('/register')
            .send({ email: 'test@example.com', password: 'password123' });
        
        expect(res.status).toBe(201);
    });
});