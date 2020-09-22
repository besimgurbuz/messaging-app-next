const request = require('supertest');
const mockingoose = require('mockingoose').default;
const bcrypte = require('bcryptjs');

const app = require('../../src/app');
const UserModel = require('../../src/model/User');

// POST
describe('POST /api/v1/register', () => {
  describe('non-valid request body', () => {
    it('should response 400 to short username', async () => {
      const response = await request(app)
        .post('/api/v1/register')
        .send({
          username: 'new',
          password: 'new_valid_password',
          email: 'valid@example.com'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
      expect(response.body).not.toBe(null);
      expect(response.body.message).toBe('Request body cannot be validated - "username" length must be at least 5 characters long');
    });

    it('should response 400 to long username', async () => {
      const response = await request(app)
        .post('/api/v1/register')
        .send({
          username: 'long_long_long_long_long_long_long_long_long_long_long_long_long_long_password',
          password: 'new_valid_password',
          email: 'valid@example.com'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
      expect(response.body).not.toBe(null);
      expect(response.body.message).toBe('Request body cannot be validated - "username" length must be less than or equal to 20 characters long');
    });

    it('should response 400 to non-valid email', async () => {
      const response = await request(app)
        .post('/api/v1/register')
        .send({
          username: 'valid_username',
          password: 'new_valid_password',
          email: 'non-valid.email'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
      expect(response.body).not.toBe(null);
      expect(response.body.message).toBe('Request body cannot be validated - "email" must be a valid email');
    });

    it('should response 400 to short password', async () => {
      const response = await request(app)
        .post('/api/v1/register')
        .send({
          username: 'valid_username',
          password: 'short',
          email: 'valid@example.com'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
      expect(response.body).not.toBe(null);
      expect(response.body.message).toBe('Request body cannot be validated - "password" length must be at least 8 characters long');
    });

    it('should response 400 to missing username property', async () => {
      const response = await request(app)
        .post('/api/v1/register')
        .send({
          password: 'validpassword',
          email: 'valid@example.com'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
      expect(response.body).not.toBe(null);
      expect(response.body.message).toBe('Request body cannot be validated - "username" is required');
    });

    it('should response 400 to missing email property', async () => {
      const response = await request(app)
        .post('/api/v1/register')
        .send({
          username: 'validusername',
          password: 'mysecretpassword'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
      expect(response.body).not.toBe(null);
      expect(response.body.message).toBe('Request body cannot be validated - "email" is required');
    });

    it('should response 400 to missing password property', async () => {
      const response = await request(app)
        .post('/api/v1/register')
        .send({
          username: 'validusername',
          email: 'valid@example.com'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
      expect(response.body).not.toBe(null);
      expect(response.body.message).toBe('Request body cannot be validated - "password" is required');
    });
  });

  describe('valid request body', () => {
    it('should response 400 to already exists email', async () => {
      jest.spyOn(UserModel, 'exists')
        .mockImplementationOnce(() => Promise.resolve(true));

      const response = await request(app)
        .post('/api/v1/register')
        .send({
          username: 'validusername',
          email: 'alreadysaved@email.com',
          password: 'somesecretpasword'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
      expect(JSON.stringify(response.body)).toBe(JSON.stringify({ message: 'There is already a registered user with this email - alreadysaved@email.com' }));
    });

    it('should response 200 and create new user', (done) => {
      jest.spyOn(UserModel, 'exists')
        .mockImplementationOnce(() => Promise.resolve(false));

      jest.spyOn(bcrypte, 'genSalt').mockImplementationOnce(() => Promise.resolve('salt'));
      jest.spyOn(bcrypte, 'hash').mockImplementationOnce(() => Promise.resolve('MOCK_HASH'));

      mockingoose(UserModel).toReturn({
        username: 'newusername',
        email: 'valid@example.com',
        hashPassword: 'MOCK_HASH'
      }, 'save');

      request(app)
        .post('/api/v1/register')
        .send({
          username: 'newusername',
          email: 'valid@example.com',
          password: 'somesecretpasword'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, {
          blockedList: [],
          username: 'newusername',
          email: 'valid@example.com'
        }, done);
    });
  });
});
