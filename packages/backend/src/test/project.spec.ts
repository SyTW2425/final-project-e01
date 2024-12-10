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
 * @brief project.test.ts - Tests for the project endpoints
 */

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
    const registerResponse = await request.post('/user/register').send({
      username: 'testUser',
      email: 'test@example.com',
      password: 'Password123',
    });
    expect(registerResponse.status).to.equal(201);
    userId = registerResponse.body.result._id;

    const registerResponse2 = await request.post('/user/register').send({
      username: 'testUser2',
      email: 'testUser2@example.com',
      password: 'Password123',
    });
    expect(registerResponse2.status).to.equal(201);
    user2Id = registerResponse2.body.result._id;

    const registerResponse3 = await request.post('/user/register').send({
      username: 'testUser3',
      email: 'testUser3@example.com',
      password: 'Password123',
    });
    expect(registerResponse3.status).to.equal(201);
    user3Id = registerResponse3.body.result._id;

    const loginResponse = await request
      .post('/user/login')
      .send({ email: 'test@example.com', password: 'Password123' });
    expect(loginResponse.status).to.equal(200);
    token = loginResponse.body.result.token;

    const loginResponse2 = await request
      .post('/user/login')
      .send({ email: 'testUser2@example.com', password: 'Password123' });
    expect(loginResponse2.status).to.equal(200);
    token2 = loginResponse2.body.result.token;

    // Crear una organización para asociar proyectos
    const createOrganizationResponse = await request
      .post('/organization')
      .set('Authorization', `${token}`)
      .send({
        name: organizationName,
        description: 'Organization for testing',
        users: [],
      });
    expect(createOrganizationResponse.status).to.equal(201);
    orgId = createOrganizationResponse.body.result._id;
  });

  after(async () => {
    await request
      .delete('/project')
      .set('Authorization', `${token}`)
      .send({ organization: organizationName, name: projectName });

    await request
      .delete('/organization')
      .set('Authorization', `${token}`)
      .send({ name: organizationName });

    await request
      .delete('/user/delete')
      .set('Authorization', `${token}`)
      .send({ email: 'test@example.com' });

    await request
      .delete('/user/delete')
      .set('Authorization', `${token}`)
      .send({ email: 'testUser2@example.com' });

    await request
      .delete('/user/delete')
      .set('Authorization', `${token}`)
      .send({ email: 'testUser3@example.com' });
  });

  describe('POST /projects', () => {
    it('should create a new project successfully', async () => {
      const response = await request
        .post('/project')
        .set('Authorization', `${token}`)
        .send({
          organization: organizationName,
          name: projectName,
          description: 'Test project description',
          startDate: '2024-11-30T00:00:00Z',
          endDate: '2025-01-30T00:00:00Z',
          users: [{ user: 'testUser', role: 'admin' }],
        });
      expect(response.status).to.equal(201);
    });

    it('should return 404 if the organization not exist', async () => {
      const response = await request
        .post('/projects')
        .set('Authorization', `${token}`)
        .send({
          organization: 'NonAdminOrg',
          name: projectName,
          description: 'Test project description',
          startDate: '2024-11-30T00:00:00Z',
          endDate: '2025-01-30T00:00:00Z',
          users: [{ user: 'testUser', role: 'admin' }],
        });
      expect(response.status).to.equal(404);
    });

    it('should return 403 if the user is not an admin of the organization', async () => {
      const response = await request
        .post('/project')
        .set('Authorization', `${token2}`)
        .send({
          organization: organizationName,
          name: projectName,
          description: 'Test project description',
          startDate: '2024-11-30T00:00:00Z',
          endDate: '2025-01-30T00:00:00Z',
          users: [{ user: 'testUser2', role: 'developer' }],
        });
      expect(response.status).to.equal(403);
    });

    it('should return 500 if the project already exists', async () => {
      const response = await request
        .post('/project')
        .set('Authorization', `${token}`)
        .send({
          organization: organizationName,
          name: projectName,
          description: 'Test project description',
          startDate: '2024-11-30T00:00:00Z',
          endDate: '2025-01-30T00:00:00Z',
          users: [{ user: 'testUser', role: 'admin' }],
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
          member: user2Id,
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
      const response = await request.post('/project/user').send({
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

      const response = await request.post('/project/sprint').send({
        project: projectId,
        sprint: sprint,
      });
      expect(response.status).to.equal(401);
    });
  });

  describe('GET /projects', () => {
    it('should retrieve projects by organization', async () => {
      const response = await request
        .get('/project')
        .set('Authorization', `${token}`)
        .query({ organization: organizationName });

      expect(response.status).to.equal(200);
      expect(response.body.result).to.be.an('array');
    });

    it('should return 404 if organization is not found', async () => {
      const response = await request
        .get('/project')
        .set('Authorization', `${token}`)
        .query({ organization: 'NonExistentOrg' });

      expect(response.status).to.equal(404);
    });

    it('should retrieve a project by organization and name', async () => {
      const response = await request
        .get('/project')
        .set('Authorization', `${token}`)
        .query({ organization: organizationName, name: projectName });

      expect(response.status).to.equal(200);
      expect(response.body.result[0]).to.have.property('organization');
      expect(response.body.result[0]).to.have.property('name');
    });
  });

  describe('GET /project/user', () => {
    let projectId: string;

    before(async () => {
      // Crear un proyecto con el usuario actual
      const projectResponse = await request
        .post('/project')
        .set('Authorization', `${token}`)
        .send({
          organization: organizationName,
          name: 'UserProjects',
          description: 'Project to test user projects retrieval',
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
        .set('Authorization', `${token}`)
        .send({
          organization: organizationName,
          project: 'UserProjects',
        });
      expect(deleteResponse.status).to.equal(200);
    });

    it('should retrieve all projects for the authenticated user', async () => {
      const response = await request
        .get('/project/user')
        .set('Authorization', `${token}`);
      expect(response.status).to.equal(200);
      expect(response.body.error).to.equal(false);
      expect(response.body.result).to.be.an('array');
      expect(
        response.body.result.some((project: any) => project._id === projectId),
      ).to.be.true;
    });

    it('should return 401 if user is not authenticated', async () => {
      const response = await request.get('/project/user');
      expect(response.status).to.equal(401);
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

  describe('GET /project/sprints', () => {
    let projectId: string;
    let sprintId: string;

    before(async () => {
      // Crear un proyecto y un sprint
      const projectResponse = await request
        .post('/project')
        .set('Authorization', `${token}`)
        .send({
          organization: organizationName,
          name: 'SprintsProjectsWithBody',
          description: 'Project to test sprint retrieval with body',
          startDate: '2024-11-30T00:00:00Z',
          endDate: '2025-01-30T00:00:00Z',
          users: [],
        });
      expect(projectResponse.status).to.equal(201);
      projectId = projectResponse.body.result._id;

      const sprintResponse = await request
        .post('/project/sprint')
        .set('Authorization', `${token}`)
        .send({
          project: projectId,
          sprint: {
            name: 'Sprint Retrieval Test with Body',
            description: 'Sprint to test retrieval',
            startDate: '2024-12-01T00:00:00Z',
            endDate: '2024-12-15T00:00:00Z',
            tasks: [],
          },
        });
      expect(sprintResponse.status).to.equal(201);
      sprintId = sprintResponse.body.result._id;
    });

    after(async () => {
      // Eliminar el proyecto después de las pruebas
      const deleteResponse = await request
        .delete('/project')
        .set('Authorization', `${token}`)
        .send({
          organization: organizationName,
          project: 'SprintsProjectsWithBody',
        });
      expect(deleteResponse.status).to.equal(200);
    });

    it('should retrieve sprints for a project successfully using body parameter', async () => {
      const response = await request
        .get('/project/sprints')
        .set('Authorization', `${token}`)
        .send({
          id: projectId,
        });
      expect(response.status).to.equal(200);
      expect(response.body.error).to.equal(false);
      expect(response.body.result).to.be.an('array');
      expect(
        response.body.result.some((sprint: any) => sprint._id === sprintId),
      ).to.be.true;
    });

    it('should return 404 if project does not exist', async () => {
      const response = await request
        .get('/project/sprints')
        .set('Authorization', `${token}`)
        .send({
          id: '61a5f2118dfe0b1a98765432', // ID no existente
        });
      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal(true);
      expect(response.body.result).to.equal('Project not found!');
    });

    it('should return 401 if user is not authenticated', async () => {
      const response = await request.get('/project/sprints').send({
        id: projectId,
      });
      expect(response.status).to.equal(401);
    });
  });

  describe('GET /searchprojects/:username', () => {
    let projectId: string;

    before(async () => {
      // Crear un proyecto para el usuario
      const projectResponse = await request
        .post('/project')
        .set('Authorization', `${token}`)
        .send({
          organization: organizationName,
          name: 'SearchProjectsByUsername',
          description: 'Project to test project retrieval by username',
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
        .set('Authorization', `${token}`)
        .send({
          organization: organizationName,
          project: 'SearchProjectsByUsername',
        });
      expect(deleteResponse.status).to.equal(200);
    });

    it('should retrieve projects for a given username', async () => {
      const response = await request
        .get(`/project/searchprojects/testUser`)
        .set('Authorization', `${token}`);
      expect(response.status).to.equal(200);
      expect(response.body.error).to.equal(false);
      expect(response.body.result).to.be.an('array');
      expect(
        response.body.result.some((project: any) => project._id === projectId),
      ).to.be.true;
    });

    it('should return 404 if user does not exist', async () => {
      const response = await request
        .get('/project/searchprojects/nonexistentuser')
        .set('Authorization', `${token}`);
      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal(true);
      expect(response.body.result).to.equal('User not found');
    });

    it('should return 401 if user is not authenticated', async () => {
      const response = await request.get(`/project/searchprojects/testUser`);
      expect(response.status).to.equal(401);
    });
  });

  describe('PUT /projects', () => {
    it('should update a project successfully', async () => {
      const response = await request
        .put('/project')
        .set('Authorization', `${token}`)
        .send({
          organization: organizationName,
          name: projectName,
          description: 'Updated description',
          startDate: '2024-11-30T00:00:00Z',
          endDate: '2025-01-30T00:00:00Z',
          users: [{ user: 'testUser', role: 'scrum_master' }],
        });

      expect(response.status).to.equal(200);
    });

    it('should return 404 if organization is not found', async () => {
      const response = await request
        .put('/project')
        .set('Authorization', `${token}`)
        .send({
          organization: 'NonExistentOrg',
          name: projectName,
          description: 'Updated description',
          startDate: '2024-11-30T00:00:00Z',
          endDate: '2025-01-30T00:00:00Z',
          users: [{ user: 'testUser', role: 'scrum_master' }],
        });

      expect(response.status).to.equal(404);
    });

    it('should return 404 if project is not found', async () => {
      const response = await request
        .put('/project')
        .set('Authorization', `${token}`)
        .send({
          organization: organizationName,
          name: 'NonExistentProject',
          description: 'Updated description',
          startDate: '2024-11-30T00:00:00Z',
          endDate: '2025-01-30T00:00:00Z',
          users: [{ user: 'testUser', role: 'scrum_master' }],
        });
      expect(response.status).to.equal(404);
    });

    it('should return 403 if the user is not an admin of the organization', async () => {
      const response = await request
        .put('/project')
        .set('Authorization', `${token2}`)
        .send({
          organization: organizationName,
          name: projectName,
          description: 'Updated description',
          startDate: '2024-11-30T00:00:00Z',
          endDate: '2025-01-30T00:00:00Z',
          users: [{ user: 'testUser', role: 'scrum_master' }],
        });
      expect(response.status).to.equal(403);
    });
  });

  describe('PUT /project/user', () => {
    let projectId: string;
    let userToUpdateId: string;

    before(async () => {
      // Crear un proyecto para las pruebas
      const projectResponse = await request
        .post('/project')
        .set('Authorization', `${token}`)
        .send({
          organization: organizationName,
          name: 'ProjectWithUserRoleUpdate',
          description: 'Project for user role update tests',
          startDate: '2024-11-30T00:00:00Z',
          endDate: '2025-01-30T00:00:00Z',
          users: [],
        });
      expect(projectResponse.status).to.equal(201);
      projectId = projectResponse.body.result._id;

      const addUserToProjectResponse = await request
        .post('/project/user')
        .set('Authorization', `${token}`)
        .send({
          project: projectId,
          user: user2Id,
          role: 'developer',
        });
      expect(addUserToProjectResponse.status).to.equal(201);

      userToUpdateId = user2Id;
    });

    after(async () => {
      // Eliminar el proyecto al finalizar las pruebas
      const deleteResponse = await request
        .delete('/project')
        .set('Authorization', `${token}`)
        .send({
          organization: organizationName,
          project: 'ProjectWithUserRoleUpdate',
        });
      expect(deleteResponse.status).to.equal(200);
      // BORRAR
      userToUpdateId;
    });

    it('should update the role of a user in a project successfully', async () => {
      const response = await request
        .put('/project/user')
        .set('Authorization', `${token}`)
        .send({
          project: projectId,
          user: userToUpdateId,
          role: 'scrum_master',
        });
      expect(response.status).to.equal(200);
      expect(response.body.error).to.equal(false);
      expect(response.body.result.users).to.deep.include({
        user: userToUpdateId,
        role: 'scrum_master',
      });
    });

    it('should return 404 if project does not exist', async () => {
      const response = await request
        .put('/project/user')
        .set('Authorization', `${token}`)
        .send({
          project: '61a5f2118dfe0b1a98765432', // ID no existente
          user: userToUpdateId,
          role: 'scrum_master',
        });
      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal(true);
      expect(response.body.result).to.equal('Project not found');
    });

    it('should return 404 if user is not found in the project', async () => {
      const response = await request
        .put('/project/user')
        .set('Authorization', `${token}`)
        .send({
          project: projectId,
          user: '61a5f2118dfe0b1a98765432', // Usuario no existente
          role: 'scrum_master',
        });
      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal(true);
      expect(response.body.result).to.equal('User not found');
    });

    it('should return 403 if user is not admin or owner of the project', async () => {
      const response = await request
        .put('/project/user')
        .set('Authorization', `${token2}`) // Usuario sin permisos
        .send({
          project: projectId,
          user: userToUpdateId,
          role: 'scrum_master',
        });
      expect(response.status).to.equal(403);
      expect(response.body.error).to.equal(true);
      expect(response.body.result).to.equal(
        'User is not an admin or owner of the project',
      );
    });

    it('should return 401 if user is not authenticated', async () => {
      const response = await request.put('/project/user').send({
        project: projectId,
        user: userToUpdateId,
        role: 'scrum_master',
      });
      expect(response.status).to.equal(401);
    });
  });

  describe('PUT /project/sprint', () => {
    let projectId: string;
    let sprintId: string;

    before(async () => {
      // Crear un proyecto para las pruebas
      const projectResponse = await request
        .post('/project')
        .set('Authorization', `${token}`)
        .send({
          organization: organizationName,
          name: 'ProjectWithSprintUpdates',
          description: 'Project for sprint update tests',
          startDate: '2024-11-30T00:00:00Z',
          endDate: '2025-01-30T00:00:00Z',
          users: [],
        });
      expect(projectResponse.status).to.equal(201);
      projectId = projectResponse.body.result._id;

      // Crear un sprint inicial para el proyecto
      const sprintResponse = await request
        .post('/project/sprint')
        .set('Authorization', `${token}`)
        .send({
          project: projectId,
          sprint: {
            name: 'Initial Sprint',
            description: 'Sprint to be updated',
            startDate: '2024-12-01T00:00:00Z',
            endDate: '2024-12-15T00:00:00Z',
            tasks: [],
          },
        });
      expect(sprintResponse.status).to.equal(201);
      sprintId = sprintResponse.body.result.sprints[0]._id;
    });

    after(async () => {
      // Eliminar el proyecto al finalizar las pruebas
      const deleteResponse = await request
        .delete('/project')
        .set('Authorization', `${token}`)
        .send({
          organization: organizationName,
          project: 'ProjectWithSprintUpdates',
        });
      expect(deleteResponse.status).to.equal(200);
    });

    it('should update a sprint in a project successfully', async () => {
      const updatedSprint = {
        name: 'Updated Sprint',
        description: 'Updated description for the sprint',
        startDate: '2024-12-01T00:00:00Z',
        endDate: '2024-12-20T00:00:00Z',
      };

      const response = await request
        .put('/project/sprint')
        .set('Authorization', `${token}`)
        .send({
          project: projectId,
          sprintID: sprintId,
          sprint: updatedSprint,
        });
      expect(response.status).to.equal(200);
      expect(response.body.error).to.equal(false);
    });

    it('should return 404 if project does not exist', async () => {
      const updatedSprint = {
        name: 'Updated Sprint',
        description: 'Updated description for the sprint',
        startDate: '2024-12-01T00:00:00Z',
        endDate: '2024-12-20T00:00:00Z',
      };

      const response = await request
        .put('/project/sprint')
        .set('Authorization', `${token}`)
        .send({
          project: '61a5f2118dfe0b1a98765432', // ID no existente
          sprintID: sprintId,
          sprint: updatedSprint,
        });
      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal(true);
      expect(response.body.result).to.equal('Project not found');
    });

    it('should return 404 if sprint does not exist', async () => {
      const updatedSprint = {
        name: 'Updated Sprint',
        description: 'Updated description for the sprint',
        startDate: '2024-12-01T00:00:00Z',
        endDate: '2024-12-20T00:00:00Z',
      };

      const response = await request
        .put('/project/sprint')
        .set('Authorization', `${token}`)
        .send({
          project: projectId,
          sprintID: '61a5f2118dfe0b1a98765432', // ID de sprint no existente
          sprint: updatedSprint,
        });
      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal(true);
    });

    it('should return 403 if user is not admin or owner of the project', async () => {
      const updatedSprint = {
        name: 'Updated Sprint',
        description: 'Updated description for the sprint',
        startDate: '2024-12-01T00:00:00Z',
        endDate: '2024-12-20T00:00:00Z',
      };

      const response = await request
        .put('/project/sprint')
        .set('Authorization', `${token2}`) // Usuario sin permisos
        .send({
          project: projectId,
          sprintID: sprintId,
          sprint: updatedSprint,
        });
      expect(response.status).to.equal(403);
      expect(response.body.error).to.equal(true);
      expect(response.body.result).to.equal(
        'User is not an admin or owner of the project',
      );
    });

    it('should return 401 if user is not authenticated', async () => {
      const updatedSprint = {
        name: 'Updated Sprint',
        description: 'Updated description for the sprint',
        startDate: '2024-12-01T00:00:00Z',
        endDate: '2024-12-20T00:00:00Z',
      };

      const response = await request.put('/project/sprint').send({
        project: projectId,
        sprintID: sprintId,
        sprint: updatedSprint,
      });
      expect(response.status).to.equal(401);
    });
  });

  describe('DELETE /projects', () => {
    it('should delete a project successfully', async () => {
      const response = await request
        .delete('/project')
        .set('Authorization', `${token}`)
        .send({ organization: organizationName, project: projectName });

      expect(response.status).to.equal(200);
    });

    it('should return 404 if project is not found', async () => {
      const response = await request
        .delete('/project')
        .set('Authorization', `${token}`)
        .send({
          organization: organizationName,
          project: 'NonExistentProject',
        });
      expect(response.status).to.equal(404);
    });

    it('should return 404 if organization is not found', async () => {
      const response = await request
        .delete('/project')
        .set('Authorization', `${token}`)
        .send({ organization: 'NonExistentOrg', project: projectName });
      expect(response.status).to.equal(404);
    });
  });

  describe('DELETE /project/user', () => {
    let projectId: string;

    before(async () => {
      // Crear un proyecto para las pruebas
      const projectResponse = await request
        .post('/project')
        .set('Authorization', `${token}`)
        .send({
          organization: organizationName,
          name: 'ProjectWithUserDeletion',
          description: 'Project for user deletion tests',
          startDate: '2024-11-30T00:00:00Z',
          endDate: '2025-01-30T00:00:00Z',
          users: [],
        });
      expect(projectResponse.status).to.equal(201);
      projectId = projectResponse.body.result._id;

      // Asegurar que el usuario esté en el proyecto
      const addUserToProjectResponse = await request
        .post('/project/user')
        .set('Authorization', `${token}`)
        .send({
          project: projectId,
          user: user2Id,
          role: 'developer',
        });
      expect(addUserToProjectResponse.status).to.equal(201);
    });

    after(async () => {
      // Eliminar el proyecto al finalizar las pruebas
      const deleteResponse = await request
        .delete('/project')
        .set('Authorization', `${token}`)
        .send({
          organization: organizationName,
          project: 'ProjectWithUserDeletion',
        });
      expect(deleteResponse.status).to.equal(200);
    });

    it('should delete a user from a project successfully', async () => {
      const response = await request
        .delete('/project/user')
        .set('Authorization', `${token}`)
        .send({
          project: projectId,
          user: user2Id,
        });
      expect(response.status).to.equal(200);
      expect(response.body.error).to.equal(false);
      expect(response.body.result.users).to.not.deep.include({
        user: user2Id,
      });
    });

    it('should return 404 if project does not exist', async () => {
      const response = await request
        .delete('/project/user')
        .set('Authorization', `${token}`)
        .send({
          project: '61a5f2118dfe0b1a98765432', // ID no existente
          user: user2Id,
        });
      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal(true);
      expect(response.body.result).to.equal('Project not found');
    });

    it('should return 404 if user is not found in the project', async () => {
      const response = await request
        .delete('/project/user')
        .set('Authorization', `${token}`)
        .send({
          project: projectId,
          user: '61a5f2118dfe0b1a98765432', // ID de usuario no existente
        });
      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal(true);
      expect(response.body.result).to.equal('User not found');
    });

    it('should return 403 if user is not admin or owner of the project', async () => {
      const response = await request
        .delete('/project/user')
        .set('Authorization', `${token2}`) // Usuario sin permisos
        .send({
          project: projectId,
          user: user2Id,
        });
      expect(response.status).to.equal(403);
      expect(response.body.error).to.equal(true);
      expect(response.body.result).to.equal(
        'User is not an admin or owner of the project',
      );
    });

    it('should return 401 if user is not authenticated', async () => {
      const response = await request.delete('/project/user').send({
        project: projectId,
        user: user2Id,
      });
      expect(response.status).to.equal(401);
    });
  });

  describe('DELETE /project/sprint', () => {
    let projectId: string;
    let sprintId: string;

    before(async () => {
      // Crear un proyecto para las pruebas
      const projectResponse = await request
        .post('/project')
        .set('Authorization', `${token}`)
        .send({
          organization: organizationName,
          name: 'ProjectWithSprintDeletion',
          description: 'Project for sprint deletion tests',
          startDate: '2024-11-30T00:00:00Z',
          endDate: '2025-01-30T00:00:00Z',
          users: [],
        });
      expect(projectResponse.status).to.equal(201);
      projectId = projectResponse.body.result._id;

      // Crear un sprint inicial para el proyecto
      const sprintResponse = await request
        .post('/project/sprint')
        .set('Authorization', `${token}`)
        .send({
          project: projectId,
          sprint: {
            name: 'Sprint to Delete',
            description: 'Sprint to be deleted during tests',
            startDate: '2024-12-01T00:00:00Z',
            endDate: '2024-12-15T00:00:00Z',
            tasks: [],
          },
        });
      expect(sprintResponse.status).to.equal(201);
      sprintId = sprintResponse.body.result._id;
    });

    after(async () => {
      // Eliminar el proyecto al finalizar las pruebas
      const deleteResponse = await request
        .delete('/project')
        .set('Authorization', `${token}`)
        .send({
          organization: organizationName,
          project: 'ProjectWithSprintDeletion',
        });
      expect(deleteResponse.status).to.equal(200);
    });

    it('should delete a sprint from a project successfully', async () => {
      const response = await request
        .delete('/project/sprint')
        .set('Authorization', `${token}`)
        .send({
          project: projectId,
          sprintID: sprintId,
        });
      expect(response.status).to.equal(200);
      expect(response.body.error).to.equal(false);
      expect(response.body.result.sprints).to.not.deep.include({
        _id: sprintId,
      });
    });

    it('should return 404 if project does not exist', async () => {
      const response = await request
        .delete('/project/sprint')
        .set('Authorization', `${token}`)
        .send({
          project: '61a5f2118dfe0b1a98765432', // ID no existente
          sprintID: sprintId,
        });
      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal(true);
      expect(response.body.result).to.equal('Project not found');
    });

    it('should return 403 if user is not admin or owner of the project', async () => {
      const response = await request
        .delete('/project/sprint')
        .set('Authorization', `${token2}`) // Usuario sin permisos
        .send({
          project: projectId,
          sprintID: sprintId,
        });
      expect(response.status).to.equal(403);
      expect(response.body.error).to.equal(true);
      expect(response.body.result).to.equal(
        'User is not an admin or owner of the project',
      );
    });

    it('should return 401 if user is not authenticated', async () => {
      const response = await request.delete('/project/sprint').send({
        project: projectId,
        sprintID: sprintId,
      });
      expect(response.status).to.equal(401);
    });
  });
});
