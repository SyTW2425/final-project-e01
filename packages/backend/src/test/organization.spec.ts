import { expect } from 'chai';
import 'mocha';
import request from 'supertest';
import { app } from '../index.js';
import MongoDB from '../Class/DBAdapter.js';
import User from '../Models/User.js';
import Organization from '../Models/Organization.js';


const dbAdapter = new MongoDB();
let token = "";
describe('Organization', () => {
  before(async () => {
    const user = "test_user3";
    const email = "test_user3@example.com";
    const password = "password123";
    const user1 = "test_user4";
    const email1 = "test_user4@example.com";
    const password1 = "password123";
    const userResponse = await request(app)
      .post('/user/register')
      .send({
      username: user,
      email: email,
      password: password
    });
    expect(userResponse.status).to.equal(201);
    const userResponse1 = await request(app)
      .post('/user/register')
      .send({
      username: user1,
      email: email1,
      password: password1
    });
    expect(userResponse1.status).to.equal(201);
    const loginResponse = await request(app)
      .post('/user/login')
      .send({
        email: email,
        password: password
      });
    expect(loginResponse.status).to.equal(200);
    token = loginResponse.body.result.token;
  });

  after(async () => {
    await dbAdapter.deleteMany(User, { username: "test_user3" });
    await dbAdapter.deleteMany(User, { username: "test_user4" });
    await dbAdapter.deleteMany(Organization, {})
  });

  describe('POST /Organization', () => {
    it('should create a new organization', async () => {
      const orgName = "OrganizationExample_3";
      const response = await request(app)
        .post('/organization/')
        .set('Authorization', `${token}`)
        .send({
          name: orgName,
          members: [{ user: "test_user3", role: "admin" }]
        });
      expect(response.status).to.equal(201);
    });

    it ('should not create a new organization with the same name', async () => {
      const orgName = "OrganizationExample_3";
      const response = await request(app)
        .post('/organization/')
        .set('Authorization', `${token}`)
        .send({
          name: orgName,
          members: [{ user: "test_user3", role: "admin" }]
        });
      expect(response.status).to.equal(409);
    });

    it ('should not create a new organization with a user that does not exist', async () => {
      const orgName = "OrganizationExample_5";
      const response = await request(app)
        .post('/organization/')
        .set('Authorization', `${token}`)
        .send({
          name: orgName,
          members: [{ user: "nottest_user", role: "admin" }, {user: "test_user3", role: "admin"}]
        });
      expect(response.status).to.equal(404);
    });

    it ('should create a new organization with several users', async () => {
      const orgName = "OrganizationExample_6";
      const response = await request(app)
        .post('/organization/')
        .set('Authorization', `${token}`)
        .send({
          name: orgName,
          members: [{ user: "test_user3", role: "admin" }, {user: "test_user4", role: "admin"}]
        });
      expect(response.status).to.equal(201);
    });

    it('should not create a new organization because the user is not authenticated', async () => {
      const orgName = "OrganizationExample_7";
      const response = await request(app)
        .post('/organization/')
        .send({
          name: orgName,
          members: [{ user: "test_user3", role: "admin" }]
        });
      expect(response.status).to.equal(401);
    });
  });

  describe('GET /Organization', () => {
    it('should get the organization created', async () => {
      const orgName = "OrganizationExample_3";
      const response = await request(app)
        .get('/organization/')
        .set('Authorization', `${token}`)
        .query({ name: orgName });
      expect(response.status).to.equal(200);
      expect(response.body.error).to.equal(false);
      expect(response.body.result).to.be.an('array');
      expect(response.body.result).to.have.length(1);
      expect(response.body.result[0].name).to.equal(orgName);
    });

    it('should get all organizations', async () => {
      const response = await request(app)
        .get('/organization/')
        .set('Authorization', `${token}`);
      expect(response.status).to.equal(200);
      expect(response.body.error).to.equal(false);
      expect(response.body.result).to.be.an('array');
    });

    it('should not get the organization created', async () => {
      const orgName = "OrganizationExample_7";
      const response = await request(app)
        .get('/organization/')
        .set('Authorization', `${token}`)
        .query({ name: orgName });
      expect(response.status).to.equal(200);
      expect(response.body.error).to.equal(false);
      expect(response.body.result).to.be.an('array');
      expect(response.body.result).to.have.length(0);
    });

    it('should not get the organization created because the user is not authenticated', async () => {
      const orgName = "OrganizationExample_3";
      const response = await request(app)
        .get('/organization/')
        .query({ name: orgName });
      expect(response.status).to.equal(401);
    });
  });

  describe('PUT /Organization', () => {
    // it('should update the organization created', async () => {
    //   const orgName = "OrganizationExample_3";
    //   const newName = "OrganizationExample_4";
    //   const response = await request(app)
    //     .put('/organization/')
    //     .set('Authorization', `${token}`)
    //     .query({ name: orgName })
    //     .send({
    //       members: [{ user: "test_user3", role: "admin" }],
    //       newName: newName
    //     });
    //   expect(response.status).to.equal(200);
    //   expect(response.body.error).to.equal(false);
    //   expect(response.body.result).to.be.an('object');
    //   expect(response.body.result.name).to.equal(newName);
    // });

    it('should not update the organization created because the user is not authenticated', async () => {
      const orgName = "OrganizationExample_4";
      const newName = "OrganizationExample_5";
      const response = await request(app)
        .put('/organization/')
        .query({ name: orgName })
        .send({
          members: [{ user: "test_user3", role: "admin" }],
          newName: newName
        });
      expect(response.status).to.equal(401);
    });

    it('should not update the organization created because the user is not an admin', async () => {
      const orgName = "OrganizationExample_4";
      const newName = "OrganizationExample_5";
      const response = await request(app)
        .put('/organization/')
        .set('Authorization', `${token}`)
        .query({ name: orgName })
        .send({
          members: [{ user: "test_user3", role: "member" }],
          newName: newName
        });
      expect(response.status).to.equal(404);
    });

    it('should not update the organization created because the organization does not exist', async () => {
      const orgName = "OrganizationExample_8";
      const newName = "OrganizationExample_9";
      const response = await request(app)
        .put('/organization/')
        .set('Authorization', `${token}`)
        .query({ name: orgName })
        .send({
          members: [{ user: "test_user3", role: "admin" }],
          newName: newName
        });
      expect(response.status).to.equal(404);
    });
  });

  describe('DELETE /Organization', () => {
    it('should delete the organization created', async () => {
      const orgName = "OrganizationExample_3";
      const response = await request(app)
        .delete('/organization/')
        .set('Authorization', `${token}`)
        .send({
          name: orgName,
        });
      expect(response.status).to.equal(200);
      expect(response.body.error).to.equal(false);
      expect(response.body.result).to.be.an('object');
      expect(response.body.result.name).to.equal(orgName);
    });

    it('should not delete the organization created because the user is not authenticated', async () => {
      const orgName = "OrganizationExample_4";
      const response = await request(app)
        .delete('/organization/')
        .send({
          name: orgName,
        });
      expect(response.status).to.equal(401);
    });

    it('should not delete the organization created because the user is not an admin', async () => {
      const orgName = "OrganizationExample_4";
      const response = await request(app)
        .delete('/organization/')
        .set('Authorization', `${token}`)
        .send({
          name: orgName,
        });
      expect(response.status).to.equal(404);
    });

    it('should not delete the organization created because the organization does not exist', async () => {
      const orgName = "OrganizationExample_8";
      const response = await request(app)
        .delete('/organization/')
        .set('Authorization', `${token}`)
        .send({
          name: orgName,
        });
      expect(response.status).to.equal(404);
    });
  });
});