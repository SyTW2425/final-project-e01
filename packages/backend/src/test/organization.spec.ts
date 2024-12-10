/**
 * Proyecto Final: Aplicación gestora de proyectos
 * Asignatura: Sistemas y Tecnologías Web
 * Grado en Ingeniería Informática
 * Universidad de La Laguna
 *
 * @author Pablo Rodríguez de la Rosa
 * @author Javier Almenara Herrera
 * @author Omar Suárez Doro
 * @version 1.0
 * @date 28/10/2024
 * @brief organization.spec.ts - Tests for the organization endpoints
 */

import { expect } from 'chai';
import 'mocha';
import request from 'supertest';
import { app } from '../index.js';
import MongoDB from '../Class/DBAdapter.js';
import User from '../Models/User.js';
import Organization from '../Models/Organization.js';

const dbAdapter = new MongoDB();
let token = '';
let token1 = '';
let orgId = '';
let userId = '';
let user2Id = '';

describe('Organization', () => {
  before(async () => {
    const user = 'test_user3';
    const email = 'test_user3@example.com';
    const password = 'password123';
    const user1 = 'test_user4';
    const email1 = 'test_user4@example.com';
    const password1 = 'password123';
    const userResponse = await request(app).post('/user/register').send({
      username: user,
      email: email,
      password: password,
    });
    userId = userResponse.body.result._id;
    userId;
    expect(userResponse.status).to.equal(201);
    const userResponse1 = await request(app).post('/user/register').send({
      username: user1,
      email: email1,
      password: password1,
    });
    user2Id = userResponse1.body.result._id;
    expect(userResponse1.status).to.equal(201);
    const loginResponse = await request(app).post('/user/login').send({
      email: email,
      password: password,
    });
    const loginResponse1 = await request(app).post('/user/login').send({
      email: email1,
      password: password1,
    });
    expect(loginResponse.status).to.equal(200);
    token = loginResponse.body.result.token;
    token1 = loginResponse1.body.result.token;
  });

  after(async () => {
    await dbAdapter.deleteMany(User, { username: 'test_user3' });
    await dbAdapter.deleteMany(User, { username: 'test_user4' });
    await dbAdapter.deleteMany(Organization, { name: 'OrganizationExample_3' });
    await dbAdapter.deleteMany(Organization, { name: 'OrganizationExample_6' });
    await dbAdapter.deleteMany(Organization, {
      name: 'Organization_Member_Test',
    });
    await dbAdapter.deleteMany(Organization, {
      name: 'Organization_Search_By_ID',
    });
    await dbAdapter.deleteMany(Organization, { name: 'Organization_Get_Test' });
    await dbAdapter.deleteMany(Organization, {
      name: 'Organization_Search_By_Name',
    });
    await dbAdapter.deleteMany(Organization, {
      name: 'Organization_Search_By_User',
    });
    await dbAdapter.deleteMany(Organization, {
      name: 'Organization_Delete_Member_Test',
    });
  });

  describe('POST /Organization', () => {
    it('should create a new organization', async () => {
      const orgName = 'OrganizationExample_3';
      const response = await request(app)
        .post('/organization/')
        .set('Authorization', `${token}`)
        .send({
          name: orgName,
          members: [{ user: 'test_user3', role: 'admin' }],
        });
      expect(response.status).to.equal(201);
    });

    it('should not create a new organization with the same name', async () => {
      const orgName = 'OrganizationExample_3';
      const response = await request(app)
        .post('/organization/')
        .set('Authorization', `${token}`)
        .send({
          name: orgName,
          members: [{ user: 'test_user3', role: 'admin' }],
        });
      expect(response.status).to.equal(409);
    });

    it('should not create a new organization with a user that does not exist', async () => {
      const orgName = 'OrganizationExample_5';
      const response = await request(app)
        .post('/organization/')
        .set('Authorization', `${token}`)
        .send({
          name: orgName,
          members: [
            { user: 'nottest_user', role: 'admin' },
            { user: 'test_user3', role: 'admin' },
          ],
        });
      expect(response.status).to.equal(404);
    });

    it('should create a new organization with several users', async () => {
      const orgName = 'OrganizationExample_6';
      const response = await request(app)
        .post('/organization/')
        .set('Authorization', `${token}`)
        .send({
          name: orgName,
          members: [
            { user: 'test_user3', role: 'admin' },
            { user: 'test_user4', role: 'admin' },
          ],
        });
      expect(response.status).to.equal(201);
    });

    it('should not create a new organization because the user is not authenticated', async () => {
      const orgName = 'OrganizationExample_7';
      const response = await request(app)
        .post('/organization/')
        .send({
          name: orgName,
          members: [{ user: 'test_user3', role: 'admin' }],
        });
      expect(response.status).to.equal(401);
    });
  });

  describe('POST /organization/member', () => {
    before(async () => {
      const orgResponse = await request(app)
        .post('/organization/')
        .set('Authorization', `${token}`)
        .send({
          name: 'Organization_Member_Test',
        });
      expect(orgResponse.status).to.equal(201);
      orgId = orgResponse.body.result._id;
    });

    it('should add a member to an organization', async () => {
      const response = await request(app)
        .post('/organization/member')
        .set('authorization', `${token}`)
        .send({
          organization: orgId,
          member: `${user2Id}`,
        });
      expect(response.status).to.equal(200);
      expect(response.body.error).to.equal(false);
    });

    it('should return 403 when the user is not an admin', async () => {
      const response = await request(app)
        .post('/organization/member')
        .set('authorization', `${token1}`) // Usuario sin permisos de administrador
        .send({
          organization: orgId,
          member: `${userId}`,
        });
      expect(response.status).to.equal(403);
      expect(response.body.error).to.equal(true);
    });

    it('should return 403 when the user is already a member', async () => {
      const response = await request(app)
        .post('/organization/member')
        .set('authorization', `${token}`)
        .send({
          organization: orgId,
          member: `${userId}`,
        });
      expect(response.status).to.equal(403);
      expect(response.body.error).to.equal(true);
    });

    it('should return 404 when the organization does not exist', async () => {
      const invalidOrgId = '61a5f2118dfe0b1a98765432';
      const response = await request(app)
        .post('/organization/member')
        .set('authorization', `${token}`)
        .send({
          organization: invalidOrgId,
          member: `${userId}`,
        });
      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal(true);
    });

    it('should return 401 when the user is not authenticated', async () => {
      const response = await request(app)
        .post('/organization/member')
        .send({
          organization: orgId,
          member: `${userId}`,
        });
      expect(response.status).to.equal(401);
    });
  });

  describe('GET /Organization', () => {
    it('should get the organization created', async () => {
      const orgName = 'OrganizationExample_3';
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
      const orgName = 'OrganizationExample_7';
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
      const orgName = 'OrganizationExample_3';
      const response = await request(app)
        .get('/organization/')
        .query({ name: orgName });
      expect(response.status).to.equal(401);
    });
  });

  describe('GET /organization/:id', () => {
    before(async () => {
      // Crear una organización para probar
      const orgResponse = await request(app)
        .post('/organization/')
        .set('Authorization', `${token}`)
        .send({
          name: 'Organization_Get_Test',
          members: [{ user: 'test_user3', role: 'admin' }],
        });
      expect(orgResponse.status).to.equal(201);
      orgId = orgResponse.body.result._id; // Guardar el ID de la organización creada
    });

    it('should retrieve an organization by its ID', async () => {
      const response = await request(app)
        .get(`/organization/${orgId}`)
        .set('Authorization', `${token}`);
      expect(response.status).to.equal(200);
      expect(response.body.error).to.equal(false);
    });

    it('should return 404 for a non-existent organization ID', async () => {
      const nonExistentId = '61a5f2118dfe0b1a98765432';
      const response = await request(app)
        .get(`/organization/${nonExistentId}`)
        .set('Authorization', `${token}`);
      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal(true);
    });

    it('should return 401 for an unauthenticated user', async () => {
      const response = await request(app).get(`/organization/${orgId}`);
      expect(response.status).to.equal(401);
    });
  });

  describe('GET /searchorganizations/:id', () => {
    before(async () => {
      // Crear una organización para probar
      const orgResponse = await request(app)
        .post('/organization/')
        .set('Authorization', `${token}`)
        .send({
          name: 'Organization_Search_By_ID',
        });
      expect(orgResponse.status).to.equal(201);
      orgId = orgResponse.body.result._id; // Guardar ID de la organización creada
    });

    it('should retrieve an organization by ID', async () => {
      const response = await request(app)
        .get(`/organization/searchorganizations/${orgId}`)
        .set('Authorization', `${token}`);
      expect(response.status).to.equal(200);
      expect(response.body.error).to.equal(false);
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app).get(
        `/organization/searchorganizations/${orgId}`,
      );
      expect(response.status).to.equal(401);
    });
  });

  describe('GET /searchorganizations/name/:name', () => {
    before(async () => {
      // Crear una organización para probar
      await request(app)
        .post('/organization/')
        .set('Authorization', `${token}`)
        .send({
          name: 'Organization_Search_By_Name',
        });
    });

    it('should retrieve an organization by name', async () => {
      const response = await request(app)
        .get(
          '/organization/searchorganizations/name/Organization_Search_By_Name',
        )
        .set('Authorization', `${token}`);
      expect(response.status).to.equal(200);
      expect(response.body.error).to.equal(false);
      expect(response.body.result.name).to.equal('Organization_Search_By_Name');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app).get(
        '/organization/searchorganizations/name/Organization_Search_By_Name',
      );
      expect(response.status).to.equal(401);
    });
  });

  describe('GET /searchorganizations/user/:username', () => {
    before(async () => {
      // Crear una organización para probar
      await request(app)
        .post('/organization/')
        .set('Authorization', `${token}`)
        .send({
          name: 'Organization_Search_By_User',
        });
    });

    it('should retrieve organizations associated with a user', async () => {
      const response = await request(app)
        .get('/organization/searchorganizations/user/test_user3')
        .set('Authorization', `${token}`);
      expect(response.status).to.equal(200);
      expect(response.body.error).to.equal(false);
    });

    it('should return 500 when the user has no organizations', async () => {
      const response = await request(app)
        .get('/organization/searchorganizations/user/nonexistent_user')
        .set('Authorization', `${token}`);
      expect(response.status).to.equal(500);
      expect(response.body.error).to.equal(true);
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app).get(
        '/organization/searchorganizations/user/test_user3',
      );
      expect(response.status).to.equal(401);
    });
  });

  describe('PUT /Organization', () => {
    it('should update the organization created', async () => {
      const orgName = 'OrganizationExample_3';
      const newName = 'OrganizationExample_4';
      const response = await request(app)
        .put('/organization/')
        .set('Authorization', `${token}`)
        .query({ name: orgName })
        .send({
          members: [{ user: 'test_user3', role: 'admin' }],
          newName: newName,
        });
      expect(response.status).to.equal(200);
      expect(response.body.error).to.equal(false);
      expect(response.body.result).to.be.an('object');
      expect(response.body.result.name).to.equal(newName);
    });

    it('should not update the organization created because the user is not authenticated', async () => {
      const orgName = 'OrganizationExample_4';
      const newName = 'OrganizationExample_5';
      const response = await request(app)
        .put('/organization/')
        .query({ name: orgName })
        .send({
          members: [{ user: 'test_user3', role: 'admin' }],
          newName: newName,
        });
      expect(response.status).to.equal(401);
    });

    it('should not update the organization created because the user is not an admin', async () => {
      const orgName = 'OrganizationExample_4';
      const newName = 'OrganizationExample_5';
      const response = await request(app)
        .put('/organization/')
        .set('Authorization', `${token1}`)
        .query({ name: orgName })
        .send({
          members: [{ user: 'test_user3', role: 'member' }],
          newName: newName,
        });
      expect(response.status).to.equal(403);
    });

    it('should not update the organization created because the organization does not exist', async () => {
      const orgName = 'OrganizationExample_8';
      const newName = 'OrganizationExample_9';
      const response = await request(app)
        .put('/organization/')
        .set('Authorization', `${token}`)
        .query({ name: orgName })
        .send({
          members: [{ user: 'test_user3', role: 'admin' }],
          newName: newName,
        });
      expect(response.status).to.equal(404);
    });
  });

  describe('DELETE /Organization', () => {
    it('should not delete the organization created because the user is not an admin', async () => {
      const orgName = 'OrganizationExample_4';
      const response = await request(app)
        .delete('/organization/')
        .set('Authorization', `${token1}`)
        .send({
          name: orgName,
        });
      expect(response.status).to.equal(403);
    });

    it('should delete the organization created', async () => {
      const orgName = 'OrganizationExample_4';
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
      const orgName = 'OrganizationExample_4';
      const response = await request(app).delete('/organization/').send({
        name: orgName,
      });
      expect(response.status).to.equal(401);
    });

    it('should not delete the organization created because the organization does not exist', async () => {
      const orgName = 'OrganizationExample_8';
      const response = await request(app)
        .delete('/organization/')
        .set('Authorization', `${token}`)
        .send({
          name: orgName,
        });
      expect(response.status).to.equal(404);
    });
  });

  describe('DELETE /organization/member', () => {
    before(async () => {
      // Crear una organización base para las pruebas
      const orgResponse = await request(app)
        .post('/organization/')
        .set('Authorization', `${token}`)
        .send({
          name: 'Organization_Delete_Member_Test',
          members: [{ user: 'test_user4', role: 'member' }],
        });
      expect(orgResponse.status).to.equal(201);
      orgId = orgResponse.body.result._id; // Guardar ID de la organización creada
    });

    it('should delete a member from an organization', async () => {
      const response = await request(app)
        .delete('/organization/member')
        .set('Authorization', `${token}`)
        .send({
          id: orgId,
          member: `${user2Id}`,
        });
      expect(response.status).to.equal(200);
      expect(response.body.error).to.equal(false);
    });

    it('should return 403 when the user is not an admin', async () => {
      const response = await request(app)
        .delete('/organization/member')
        .set('Authorization', `${token1}`) // Usuario sin permisos de administrador
        .send({
          id: orgId,
          member: 'test_user3',
        });
      expect(response.status).to.equal(403);
      expect(response.body.error).to.equal(true);
    });

    it('should return 404 when the organization does not exist', async () => {
      const invalidOrgId = '61a5f2118dfe0b1a98765432';
      const response = await request(app)
        .delete('/organization/member')
        .set('Authorization', `${token}`)
        .send({
          id: invalidOrgId,
          member: 'test_user4',
        });
      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal(true);
    });

    it('should return 401 when the user is not authenticated', async () => {
      const response = await request(app).delete('/organization/member').send({
        id: orgId,
        member: 'test_user4',
      });
      expect(response.status).to.equal(401);
    });
  });
});
