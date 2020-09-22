const request = require('supertest');
const mockingoose = require('mockingoose').default;

const app = require('../../src/app');
const UserModel = require('../../src/model/User');

const test_data = {
  _id: '5f5f9452a3d15748345cc8d',
  username: 'username',
  email: 'email@example.com',
  hashPassword: '$2a$10$ouKKtPyrlRpak/fretTvI.5zRU07kZaDZgNMkhWGgUFWNfK.pT2ea'
};

describe('POST /api/v1/login', () => {
  it('should response 200 to correct password and username', async () => {
    mockingoose(UserModel).toReturn(test_data, 'findOne');

    const response = await request(app)
      .post('/api/v1/login')
      .send({
        username: 'username',
        password: 'mysecretpassword'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.status).toBe(200);
    expect(JSON.stringify(response.body.user)).toBe(JSON.stringify({
      blockedList: [],
      username: 'username',
      email: 'email@example.com'
    }));
  });

  it('should response 400 to incorrect password', (done) => {
    mockingoose(UserModel).toReturn(test_data, 'findOne');

    request(app)
      .post('/api/v1/login')
      .send({
        username: 'username',
        password: 'somewrongpassword'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, {
        message: 'Wrong password'
      }, done);
  });

  it('should response 400 to not found user', (done) => {
    mockingoose(UserModel).toReturn(null, 'findOne');

    request(app)
      .post('/api/v1/login')
      .send({
        username: 'unknownusername',
        password: 'mysecretpassword'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, {
        message: 'There is no user with this username - unknownusername'
      }, done);
  });

  it('should response 400 from middleware req.body controls: username', async () => {
    // There is no need to mock mongoose
    const response = await request(app)
      .post('/api/v1/login')
      .send({
        prop1: 'value1',
        password: 'somepassword'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.status).toBe(400);
    expect(response.body).not.toBe(null);
    expect(response.body.message).toBe('Request body cannot be validated - "username" is required');
  });

  it('should response 400 from middleware req.body controls: password', async () => {
    // There is no need to mock mongoose
    const response = await request(app)
      .post('/api/v1/login')
      .send({
        username: 'value1',
        prop1: 'value1'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.status).toBe(400);
    expect(response.body).not.toBe(null);
    expect(response.body.message).toBe('Request body cannot be validated - "password" is required');
  });
});
