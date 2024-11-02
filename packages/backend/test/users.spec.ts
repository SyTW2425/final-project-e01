import 'jest';
import request from 'supertest';
import { usersRouter } from '../src/Routers/users.js'; // Adjust the path as necessary
import express from 'express';
import { User, Role } from '../src/Models/User.js'; // Adjust the path as necessary


const app = express();
app.use(express.json());
app.use('/users', usersRouter);

describe('POST /users/register', () => {
  it('debería registrar un nuevo usuario y devolver un mensaje de éxito', async () => {
    const newUser = { username: 'testUser', email: 'test@example.com', password: 'password123' };
    User.prototype.save = jest.fn().mockResolvedValue(newUser);

    const res = await request(app)
      .post('/users/register')
      .send(newUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.result).toBe('User registered');
    expect(res.body.userInfo).toMatchObject({
      username: newUser.username,
      email: newUser.email,
      role: Role.User,
    });
  });

  it('debería devolver un error 500 si ocurre un problema', async () => {
    User.prototype.save = jest.fn().mockRejectedValue(new Error('Error saving user'));

    const res = await request(app)
      .post('/users/register')
      .send({ username: 'testUser', email: 'test@example.com', password: 'password123' });

    expect(res.statusCode).toBe(500);
    expect(res.text).toContain('Error:');
  });
});