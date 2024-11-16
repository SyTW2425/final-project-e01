import { expect } from 'chai';
import 'mocha';
import request from 'supertest';
import { app } from '../index.js';
import MongoDB from '../Class/DBAdapter.js';
import User from '../Models/User.js';


const dbAdapter = new MongoDB();
let token = "";

before(async () => {
  const user = "test_user3";
  const email = "test_user3@example.com";
  const password = "password123";
  const userResponse = await request(app)
    .post('/user/register')
    .send({
    username: user,
    email: email,
    password: password
  });
  expect(userResponse.status).to.equal(201);
	const loginResponse = await request(app)
		.post('/user/login')
		.send({
			email: email,
			password: password
		});
	expect(loginResponse.status).to.equal(200);
  const data = loginResponse.body;
	token = data.result.result.token;
});

after(async () => {
  await dbAdapter.deleteMany(User, { username: "test_user3" });
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
});

describe('PUT /Organization', () => {
  it('should update the organization created', async () => {
    const orgName = "OrganizationExample_3";
    const newName = "OrganizationExample_4";
    const response = await request(app)
      .put('/organization/')
      .set('Authorization', `${token}`)
      .query({ name: orgName })
      .send({
        members: [{ user: "test_user3", role: "admin" }],
        newName: newName
      });
    expect(response.status).to.equal(200);
    expect(response.body.error).to.equal(false);
    expect(response.body.result).to.be.an('object');
    expect(response.body.result.name).to.equal(newName);
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
});

