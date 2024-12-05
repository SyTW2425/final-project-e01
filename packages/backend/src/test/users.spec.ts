import * as chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../index.js'; // Importa tu aplicación Express principal
import { it, describe, before, after } from 'mocha';
import supertest from 'supertest';

const { expect } = chai;
chai.use(chaiHttp);
const request = supertest(app);

describe('Users API Endpoints', () => {
  let token: string;

  before(async () => {
    const registerResponse = await request.post('/user/register')
      .send({ username: 'testUser', email: 'test@example.com', password: 'Password123' });
    expect(registerResponse.status).to.equal(201);
    
    const loginResponse = await request.post('/user/login')
      .send({ email: 'test@example.com', password: 'Password123' });
    expect(loginResponse.status).to.equal(200);
    token = loginResponse.body.result.token;
  });

  after(async () => {
    // Limpia el usuario creado
    await request.delete('/user/delete')
      .set('Authorization', `${token}`)
      .send({ email: 'test@example.com' });
  });

  describe('GET /user', () => {
    it('should return user details if username or email is provided', async () => {
      const response = await request.get('/user')
        .set('Authorization', `${token}`)
        .query({ username: 'testUser', email: 'test@example.com' });
      expect(response.status).to.equal(200);
      expect(response.body.result).to.be.an('array');
    });

    it('should return 400 if no username or email is provided', async () => {
      const response = await request.get('/user')
        .set('Authorization', `${token}`);
      expect(response.status).to.equal(400);
      expect(response.body.result).to.equal('You must provide a username or email to search for users');
    });

    it('should return 401 if user is not authenticated', async () => {
      const response = await request.get('/user')
        .query({ username: 'testUser', email: 'test@example.com' });
      expect(response.status).to.equal(401);
    });
  });

  describe('POST /user/register', () => {
    it('should return 400 if required fields are missing', async () => {
      const response = await request.post('/user/register')
        .send({ username: 'testUser' });

      expect(response.status).to.equal(400);
      expect(response.body.result).to.equal('You must provide a username, email, and password to register a user');
    });

    it('should return 500 if email is invalid', async () => {
      const response = await request.post('/user/register')
        .send({ username: 'testUser', email: 'test@example', password: 'Password123' });

      expect(response.status).to.equal(500);
    });

    it('should return 500 if password is invalid', async () => {
      const response = await request.post('/user/register')
        .send({ username: 'testUser', email: 'test@example.com', password: 'a' });
      
      expect(response.status).to.equal(500);
    });
  });

  describe('POST /user/login', () => {
    it('should login a user with correct credentials', async () => {
      const response = await request.post('/user/login')
        .send({ email: 'test@example.com', password: 'Password123' });

      expect(response.status).to.equal(200);
      expect(response.body.result).to.have.property('token');
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request.post('/user/login')
        .send({ email: 'test@example.com' });

      expect(response.status).to.equal(400);
      expect(response.body.result).to.equal('You must provide an email and password to login');
    });

    it('should return 500 if password is incorrect', async () => {
      const response = await request.post('/user/login')
        .send({ email: 'test@example.com', password: 'Password' });
      
      expect(response.status).to.equal(500);
    });
  });

  describe('DELETE /user/delete', () => {
    it('should delete a user with valid token and email', async () => {
      const response = await request.delete('/user/delete')
        .set('Authorization', `${token}`)
        .send({ email: 'test@example.com' });

      expect(response.status).to.equal(200);
      expect(response.body.error).to.equal(false);
    });
  });

  describe('PATCH /user/update', () => {
    it('should not update a user beacaue the user is not admin', async () => {
      const response = await request.patch('/user/update')
        .set('Authorization', `${token}`)
        .send({ email: 'testUser2@example.com', username: 'updatedUser' });
        
      expect(response.status).to.equal(500);
      expect(response.body.error).to.equal(true);
    });

    it('should return 400 if email is missing', async () => {
      const response = await request.patch('/user/update')
        .set('Authorization', `${token}`)
        .send({ username: 'updatedUser' });

      expect(response.status).to.equal(400);
      expect(response.body.result).to.equal('You must provide an email to update a user');
    });

    it('should return 500 if email is invalid', async () => {
      const response = await request.patch('/user/update')
        .set('Authorization', `${token}`)
        .send({ email: 'test@example', username: 'updatedUser' });

      expect(response.status).to.equal(500);
    });
  });
});

let token: string;
describe('Additional Users API Endpoints', () => {
  let userId: string;

  before(async () => {
    const userResponse = await request.post('/user/register')
      .send({ username: 'testUserExtra', email: 'testExtra@example.com', password: 'Password123' });
    expect(userResponse.status).to.equal(201);
    userId = userResponse.body.result._id;
    const loginResponse = await request.post('/user/login')
      .send({ email: 'testExtra@example.com', password: 'Password123' });
    expect(loginResponse.status).to.equal(200);
    token = loginResponse.body.result.token;
  });

  after(async () => {
    await request.delete('/user/delete')
      .set('Authorization', `${token}`)
      .send({ email: 'testExtra@example.com' });
  });

  describe('GET /user/validate', () => {
    it('should validate the token and return user details', async () => {
      const response = await request.get('/user/validate')
        .set('Authorization', `${token}`);
      expect(response.status).to.equal(200);
      expect(response.body.error).to.equal(false);
      expect(response.body.result).to.have.property('_id', userId);
    });

    it('should return 401 if the token is invalid', async () => {
      const response = await request.get('/user/validate')
        .set('Authorization', 'invalidToken');
      expect(response.status).to.equal(401);
    });
  });

  describe('GET /user/search/:username', () => {
    it('should return user details for a valid username', async () => {
      const response = await request.get('/user/search/testUserExtra')
        .set('Authorization', `${token}`);
      expect(response.status).to.equal(200);
      expect(response.body.error).to.equal(false);
      expect(response.body.result).to.have.property('username', 'testUserExtra');
    });

    it('should return null if username does not exist', async () => {
      const response = await request.get('/user/search/nonExistentUser')
        .set('Authorization', `${token}`);
      expect(response.body.result).to.be.null;
    });
  });

  describe('GET /user/id/:id', () => {
    it('should return user details for a valid ID', async () => {
      const response = await request.get(`/user/id/${userId}`)
        .set('Authorization', `${token}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('_id', userId);
    });

    it('should return undefined if ID does not exist', async () => {
      const response = await request.get('/user/id/61a5f2118dfe0b1a98765432')
        .set('Authorization', `${token}`);
      expect(response.body.result).to.be.undefined;
    });
  });
});