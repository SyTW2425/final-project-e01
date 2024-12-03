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
  let userId: string;
  let user2Id: string;
  let user3Id: string;
  let orgId: string;

  before(async () => {
    // Crear y autenticar usuario para obtener token
    const registerResponse = await request.post('/user/register')
      .send({ username: 'testUser', email: 'test@example.com', password: 'Password123' });
    expect(registerResponse.status).to.equal(201);
    userId = registerResponse.body.result._id

    const registerResponse2 = await request.post('/user/register')
      .send({ username: 'testUser2', email: 'testUser2@example.com', password: 'Password123' });
    expect(registerResponse2.status).to.equal(201);
    user2Id = registerResponse2.body.result._id

    const registerResponse3 = await request.post('/user/register')
      .send({ username: 'testUser3', email: 'testUser3@example.com', password: 'Password123' });
    expect(registerResponse3.status).to.equal(201);
    user3Id = registerResponse3.body.result._id

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
              users: [] });
    expect(createOrganizationResponse.status).to.equal(201);
    orgId = createOrganizationResponse.body.result._id
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

    await request.delete('/user/delete')
      .set('Authorization', `${token}`)
      .send({ email: 'testUser3@example.com' }); 
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

  describe('POST /project/user', () => {
    let projectId: string;
  
    before(async () => {
      // Crear un proyecto para las pruebas
      const projectResponse = await request
        .post('/project')
        .set('Authorization', `${token}`)
        .send({
          organization: organizationName,
          name: 'ProjectWithUsers',
          description: 'Project for user addition tests',
          startDate: '2024-11-30T00:00:00Z',
          endDate: '2025-01-30T00:00:00Z',
          users: [],
        });
      expect(projectResponse.status).to.equal(201);
      projectId = projectResponse.body.result._id;

      // Asegurar que el usuario esté en la organización
      const addUserToOrgResponse = await request
        .post('/organization/member')
        .set('Authorization', `${token}`)
        .send({
          organization: orgId,
          member: user2Id
        });
      expect(addUserToOrgResponse.status).to.equal(200);
    });
  
    it('should add a user to a project successfully', async () => {
      const response = await request
        .post('/project/user')
        .set('authorization', `${token}`)
        .send({
          project: projectId,
          user: `${user2Id}`,
          role: 'developer',
        });
        userId;
      expect(response.status).to.equal(201);
      expect(response.body.error).to.equal(false);
    });
  
    it('should return 404 if project does not exist', async () => {
      const response = await request
        .post('/project/user')
        .set('Authorization', `${token}`)
        .send({
          project: '61a5f2118dfe0b1a98765432', // ID no existente
          user: user2Id,
          role: 'developer',
        });
      expect(response.status).to.equal(404);
    });
  
    it('should return 404 if user does not exist', async () => {
      const response = await request
        .post('/project/user')
        .set('Authorization', `${token}`)
        .send({
          project: projectId,
          user: '61a5f2118dfe0b1a98765432',
          role: 'developer',
        });
      expect(response.status).to.equal(404);
    });
  
    it('should return 403 if user is not admin or owner of the project', async () => {
      const response = await request
        .post('/project/user')
        .set('Authorization', `${token2}`)
        .send({
          project: projectId,
          user: user2Id,
          role: 'developer',
        });
      expect(response.status).to.equal(403);
    });
  
    it('should return 403 if user is not in the organization', async () => {
      const response = await request
        .post('/project/user')
        .set('Authorization', `${token}`)
        .send({
          project: projectId,
          user: user3Id,
          role: 'developer',
        });
      expect(response.status).to.equal(403);
    });
  
    it('should return 401 if user is not authenticated', async () => {
      const response = await request
        .post('/project/user')
        .send({
          project: projectId,
          user: 'testUser2',
          role: 'developer',
        });
      expect(response.status).to.equal(401);
    });
  });

  describe('POST /project/sprint', () => {
    let projectId: string;
  
    before(async () => {
      // Crear un proyecto para añadir sprints
      const projectResponse = await request
        .post('/project')
        .set('Authorization', `${token}`)
        .send({
          organization: organizationName,
          name: 'ProjectWithSprints',
          description: 'Project for sprint addition tests',
          startDate: '2024-11-30T00:00:00Z',
          endDate: '2025-01-30T00:00:00Z',
          users: [],
        });
      expect(projectResponse.status).to.equal(201);
      projectId = projectResponse.body.result._id;
    });

    after(async () => {
      // Eliminar el proyecto después de las pruebas
      const deleteResponse = await request
        .delete('/project')
        .set('authorization', `${token}`)
        .send({
          organization: organizationName,
          project: 'ProjectWithSprints',
        });
      expect(deleteResponse.status).to.equal(200);
    });
  
    it('should add a sprint to a project successfully', async () => {
      const sprint = {
        name: 'Sprint 1',
        description: 'First sprint of the project',
        startDate: '2024-12-01T00:00:00Z',
        endDate: '2024-12-15T00:00:00Z',
        tasks: [],
      };
  
      const response = await request
        .post('/project/sprint')
        .set('Authorization', `${token}`)
        .send({
          project: projectId,
          sprint: sprint,
        });
      expect(response.status).to.equal(201);
      expect(response.body.error).to.equal(false);
    });
  
    it('should return 404 if project does not exist', async () => {
      const sprint = {
        name: 'Sprint 2',
        description: 'Sprint for a non-existent project',
        startDate: '2024-12-16T00:00:00Z',
        endDate: '2024-12-31T00:00:00Z',
        tasks: [],
      };
  
      const response = await request
        .post('/project/sprint')
        .set('Authorization', `${token}`)
        .send({
          project: '61a5f2118dfe0b1a98765432', // ID no existente
          sprint: sprint,
        });
      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal(true);
    });
  
    it('should return 403 if user is not admin or owner of the project', async () => {
      const sprint = {
        name: 'Sprint 3',
        description: 'Sprint by unauthorized user',
        startDate: '2025-01-01T00:00:00Z',
        endDate: '2025-01-15T00:00:00Z',
        tasks: [],
      };
  
      const response = await request
        .post('/project/sprint')
        .set('Authorization', `${token2}`) // Usuario sin permisos
        .send({
          project: projectId,
          sprint: sprint,
        });
      expect(response.status).to.equal(403);
      expect(response.body.error).to.equal(true);
    });
  
    it('should return 401 if user is not authenticated', async () => {
      const sprint = {
        name: 'Sprint 4',
        description: 'Sprint without authentication',
        startDate: '2025-01-16T00:00:00Z',
        endDate: '2025-01-30T00:00:00Z',
        tasks: [],
      };
  
      const response = await request
        .post('/project/sprint')
        .send({
          project: projectId,
          sprint: sprint,
        });
      expect(response.status).to.equal(401);
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

  describe('GET /project/id/:id', () => {
    let projectId: string;
  
    before(async () => {
      // Crear un proyecto para las pruebas
      const projectResponse = await request
        .post('/project')
        .set('Authorization', `${token}`)
        .send({
          organization: organizationName,
          name: 'ProjectWithID',
          description: 'Project for ID-based retrieval tests',
          startDate: '2024-11-30T00:00:00Z',
          endDate: '2025-01-30T00:00:00Z',
          users: [],
        });
      expect(projectResponse.status).to.equal(201);
      projectId = projectResponse.body.result._id;
    });
  
    after(async () => {
      // Eliminar el proyecto al finalizar las pruebas
      const deleteResponse = await request
        .delete('/project')
        .set('Authorization', `${token}`)
        .send({
          organization: organizationName,
          project: 'ProjectWithID',
        });
      expect(deleteResponse.status).to.equal(200);
    });
  
    it('should retrieve a project by its ID successfully', async () => {
      const response = await request
        .get(`/project/id/${projectId}`)
        .set('Authorization', `${token}`);
      expect(response.status).to.equal(200);
      expect(response.body.error).to.equal(false);
      expect(response.body.result).to.have.property('_id', projectId);
      expect(response.body.result).to.have.property('name', 'ProjectWithID');
    });
  
    it('should return 404 if project does not exist', async () => {
      const nonExistentId = '61a5f2118dfe0b1a98765432';
      const response = await request
        .get(`/project/id/${nonExistentId}`)
        .set('Authorization', `${token}`);
      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal(true);
      expect(response.body.result).to.equal('Project not found!');
    });
  
    it('should return 401 if user is not authenticated', async () => {
      const response = await request.get(`/project/id/${projectId}`);
      expect(response.status).to.equal(401);
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
