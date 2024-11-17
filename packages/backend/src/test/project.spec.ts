import * as chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../index.js'; // Asegúrate de que apunta al archivo principal de tu app
import supertest from 'supertest';
import { describe, it, before, after } from 'mocha';

const { expect } = chai;
chai.use(chaiHttp);
const request = supertest(app);

describe('Projects API Endpoints', () => {
  let token: string;
  let token2: string;
  let organizationName: string = 'TestOrganization';
  let projectName: string = 'TestProject';

  before(async () => {
    // Crear y autenticar usuario para obtener token
    const registerResponse = await request.post('/user/register')
      .send({ username: 'testUser', email: 'test@example.com', password: 'Password123' });
    expect(registerResponse.status).to.equal(201);

    const registerResponse2 = await request.post('/user/register')
      .send({ username: 'testUser2', email: 'testUser2@example.com', password: 'Password123' });
    expect(registerResponse2.status).to.equal(201);

    const loginResponse = await request.post('/user/login')
      .send({ email: 'test@example.com', password: 'Password123' });
    expect(loginResponse.status).to.equal(200);
    token = loginResponse.body.result.token;

    const loginResponse2 = await request.post('/user/login')
      .send({ email: 'testUser2@example.com', password: 'Password123' });
    expect(loginResponse2.status).to.equal(200);
    token2 = loginResponse2.body.result.token;

    // Crear una organización para asociar proyectos
    const createOrganizationResponse = await request.post('/organization')
      .set('Authorization', `${token}`)
      .send({ name: organizationName, 
              description: 'Organization for testing',
              users: [{ user: 'testUser', role: 'admin' },
                      { user: 'testUser2', role: 'member' }] });
    expect(createOrganizationResponse.status).to.equal(201);
  });


  after(async () => {
    await request.delete('/project')
      .set('Authorization', `${token}`)
      .send({ organization: organizationName, name: projectName });
    
    await request.delete('/organization')
      .set('Authorization', `${token}`)
      .send({ name: organizationName });

    await request.delete('/user/delete')
      .set('Authorization', `${token}`)
      .send({ email: 'test@example.com' });
    
    await request.delete('/user/delete')
      .set('Authorization', `${token}`)
      .send({ email: 'testUser2@example.com' });
  });

  describe('POST /projects', () => {
    it('should create a new project successfully', async () => {
      const response = await request.post('/project')
        .set('Authorization', `${token}`)
        .send({
          organization: organizationName,
          name: projectName,
          description: 'Test project description',
          startDate: '2024-11-30T00:00:00Z',
          endDate: '2025-01-30T00:00:00Z',
          users: [{ user: 'testUser', role: 'admin' }]
        });
      expect(response.status).to.equal(201);
    });

    it('should return 404 if the organization not exist', async () => {
      const response = await request.post('/projects')
        .set('Authorization', `${token}`)
        .send({
          organization: 'NonAdminOrg',
          name: projectName,
          description: 'Test project description',
          startDate: '2024-11-30T00:00:00Z',
          endDate: '2025-01-30T00:00:00Z',
          users: [{ user: 'testUser', role: 'admin' }]
        });
      expect(response.status).to.equal(404);
    });

    it('should return 403 if the user is not an admin of the organization', async () => {
      const response = await request.post('/project')
        .set('Authorization', `${token2}`)
        .send({
          organization: organizationName,
          name: projectName,
          description: 'Test project description',
          startDate: '2024-11-30T00:00:00Z',
          endDate: '2025-01-30T00:00:00Z',
          users: [{ user: 'testUser2', role: 'developer' }]
        });
      expect(response.status).to.equal(403);
    });

    it('should return 500 if the project already exists', async () => {
      const response = await request.post('/project')
        .set('Authorization', `${token}`)
        .send({
          organization: organizationName,
          name: projectName,
          description: 'Test project description',
          startDate: '2024-11-30T00:00:00Z',
          endDate: '2025-01-30T00:00:00Z',
          users: [{ user: 'testUser', role: 'admin' }]
        });
      expect(response.status).to.equal(500);
    });
  });

  describe('GET /projects', () => {
    it('should retrieve projects by organization', async () => {
      const response = await request.get('/project')
        .set('Authorization', `${token}`)
        .query({ organization: organizationName });

      expect(response.status).to.equal(200);
      expect(response.body.result).to.be.an('array');
    });

    it('should return 404 if organization is not found', async () => {
      const response = await request.get('/project')
        .set('Authorization', `${token}`)
        .query({ organization: 'NonExistentOrg' });

      expect(response.status).to.equal(404);
    });

    it('should retrieve a project by organization and name', async () => {
      const response = await request.get('/project')
        .set('Authorization', `${token}`)
        .query({ organization: organizationName, name: projectName });

      expect(response.status).to.equal(200);
      expect(response.body.result[0]).to.have.property('organization');
      expect(response.body.result[0]).to.have.property('name');
    });
  });

  describe('PUT /projects', () => {
    it('should update a project successfully', async () => {
      const response = await request.put('/project')
        .set('Authorization', `${token}`)
        .send({
          organization: organizationName,
          name: projectName,
          description: 'Updated description',
          startDate: '2024-11-30T00:00:00Z',
          endDate: '2025-01-30T00:00:00Z',
          users: [{ user: 'testUser', role: 'scrum_master' }]
        });

      expect(response.status).to.equal(200);
    });

    it('should return 404 if organization is not found', async () => {
      const response = await request.put('/project')
        .set('Authorization', `${token}`)
        .send({
          organization: 'NonExistentOrg',
          name: projectName,
          description: 'Updated description',
          startDate: '2024-11-30T00:00:00Z',
          endDate: '2025-01-30T00:00:00Z',
          users: [{ user: 'testUser', role: 'scrum_master' }]
        });

      expect(response.status).to.equal(404);
    });

    it('should return 404 if project is not found', async () => {
      const response = await request.put('/project')
        .set('Authorization', `${token}`)
        .send({
          organization: organizationName,
          name: 'NonExistentProject',
          description: 'Updated description',
          startDate: '2024-11-30T00:00:00Z',
          endDate: '2025-01-30T00:00:00Z',
          users: [{ user: 'testUser', role: 'scrum_master' }]
        });
      expect(response.status).to.equal(404);
    });

    it('should return 403 if the user is not an admin of the organization', async () => {
      const response = await request.put('/project')
        .set('Authorization', `${token2}`)
        .send({
          organization: organizationName,
          name: projectName,
          description: 'Updated description',
          startDate: '2024-11-30T00:00:00Z',
          endDate: '2025-01-30T00:00:00Z',
          users: [{ user: 'testUser', role: 'scrum_master' }]
        });
      expect(response.status).to.equal(403);
    });
  });

  describe('DELETE /projects', () => {
    it('should delete a project successfully', async () => {
      const response = await request.delete('/project')
        .set('Authorization', `${token}`)
        .send({ organization: organizationName, project: projectName });

      expect(response.status).to.equal(200);
    });

    it('should return 404 if project is not found', async () => {
      const response = await request.delete('/project')
        .set('Authorization', `${token}`)
        .send({ organization: organizationName, project: 'NonExistentProject' });
      expect(response.status).to.equal(404);
    });

    it('should return 404 if organization is not found', async () => {
      const response = await request.delete('/project')
        .set('Authorization', `${token}`)
        .send({ organization: 'NonExistentOrg', project: projectName });
      expect(response.status).to.equal(404);
    });
  });
});
