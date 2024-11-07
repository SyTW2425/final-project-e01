import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import express from 'express';
import { usersRouter } from '../Routers/users.js'; // Adjust path as needed
import { User, Role } from '../Models/User.js'; // Adjust path as needed

// Initialize the Express app and apply middleware
const app = express();
app.use(express.json());
app.use('/users', usersRouter);

describe('POST /users/register', () => {
  let saveStub: sinon.SinonStub;

  beforeEach(() => {
    // Stub the `save` method for User model
    saveStub = sinon.stub(User.prototype, 'save');
  });

  afterEach(() => {
    // Restore the original `save` method
    saveStub.restore();
  });

  it('should register a new user and return a success message', async () => {
    const newUser = { username: 'testUser', email: 'test@example.com', password: 'password123' };
    saveStub.resolves(newUser); // Mock successful save operation

    const res = await request(app)
      .post('/users/register')
      .send(newUser);

    expect(res.status).to.equal(201);
    expect(res.body.result).to.equal('User registered');
    expect(res.body.userInfo).to.include({
      username: newUser.username,
      email: newUser.email,
      role: Role.User, // Make sure this matches your enum or role definition
    });
  });

  it('should return a 500 error if a problem occurs', async () => {
    saveStub.rejects(new Error('Error saving user')); // Mock a failed save operation

    const res = await request(app)
      .post('/users/register')
      .send({ username: 'testUser', email: 'test@example.com', password: 'password123' });

    expect(res.status).to.equal(500);
    expect(res.text).to.contain('Error:');
  });
});
