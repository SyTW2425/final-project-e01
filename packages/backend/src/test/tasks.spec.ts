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
 * @brief tasks.spec.ts - Tests for the task endpoints
 */

import { expect } from 'chai';
import 'mocha';
import request from 'supertest';
import { app } from '../index.js';
import MongoDB from '../Class/DBAdapter.js';
import User from '../Models/User.js';
import Organization from '../Models/Organization.js';
import Project from '../Models/Project.js';

const dbAdapter = new MongoDB();
let token = "";
describe('Task', () => {
  before(async () => {
    const orgName = "OrganizationExample_2";
    const projectName = "Nuevo_Proyecto_2";
    const user = "test_user2";
    const email = "test_user2@example.com";
    const password = "password123";  // Define el password para el usuario
    
    // Crear el Usuario
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
    token = loginResponse.body.result.token;
    const orgResponse = await request(app)
      .post('/organization/')
      .set('Authorization', `${token}`)
      .send({
        name: orgName,
        members: [{ user: user, role: "admin" }]
      });

    expect(orgResponse.status).to.equal(201);

    // Crear Proyecto
    const projectResponse = await request(app)
      .post('/project/')
      .set('Authorization', `${token}`)
      .send({
        organization: orgName,
        name: projectName,
        description: "Este es un proyecto de ejemplo",
        startDate: "2024-11-30T00:00:00Z",
        endDate: "2025-01-30T00:00:00Z",
        users: [{ user, role: "admin" }]
      });

    expect(projectResponse.status).to.equal(201);
  });

  after(async () => {
    await dbAdapter.deleteOne(Organization, { name: 'OrganizationExample_2' });
    await dbAdapter.deleteOne(User, { username: 'test_user2' });
    await dbAdapter.deleteOne(Project, { name: 'Nuevo_Proyecto_2' });
  });


  describe('POST /task', () => {
    it('should create a task successfully', async () => {
      const response = await request(app)
        .post('/task')
        .set('Authorization', `${token}`)
        .send({
          startDate: "2025-12-10T00:00:00Z",
          endDate: "2025-12-30T00:00:00Z",
          name: "Implementación de la interfaz de usuario",
          description: "Tarea para desarrollar la interfaz de usuario en el proyecto",
          priority: "high",
          dependenciesTasks: [],
          status: "in_progress",
          comments: ["Asegurarse de seguir el diseño", "Revisar con el equipo de UX"],
          users: ["test_user2"],
          projectName: "Nuevo_Proyecto_2",
          organizationName: "OrganizationExample_2"
        });
      expect(response.status).to.equal(201);
      expect(response.body.result.name).to.equal("Implementación de la interfaz de usuario");
    });

    it('should not create a task with a user that does not exist', async () => {
      const response = await request(app)
        .post('/task')
        .set('Authorization', `${token}`)
        .send({
          startDate: "2024-11-30T00:00:00Z",
          endDate: "2024-12-15T00:00:00Z",
          name: "Implementación de la interfaz de usuario",
          description: "Tarea para desarrollar la interfaz de usuario en el proyecto",
          priority: "high",
          dependenciesTasks: [],
          status: "in_progress",
          comments: ["Asegurarse de seguir el diseño", "Revisar con el equipo de UX"],
          users: ["nottest_user"],
          projectName: "Nuevo_Proyecto_2",
          organizationName: "OrganizationExample_2"
        });

      expect(response.status).to.equal(404);
    });
  });

  describe('POST /task', () => {
    let taskId: string;
  
    it('should create a task successfully', async () => {
      const response = await request(app)
        .post('/task')
        .set('Authorization', `${token}`)
        .send({
          startDate: "2025-12-10T00:00:00Z",
          endDate: "2025-12-30T00:00:00Z",
          name: "TaskPostTest",
          description: "Task creation test",
          priority: "high",
          dependenciesTasks: [],
          status: "todo",
          comments: ["Initial setup required"],
          users: ["test_user2"],
          projectName: "Nuevo_Proyecto_2",
          organizationName: "OrganizationExample_2"
        });
  
      expect(response.status).to.equal(201);
      expect(response.body.error).to.equal(false);
      expect(response.body.result.name).to.equal("TaskPostTest");
      taskId = response.body.result._id; // Guardar el ID de la tarea creada
    });
  
    it('should return 404 if user does not exist', async () => {
      const response = await request(app)
        .post('/task')
        .set('Authorization', `${token}`)
        .send({
          startDate: "2025-12-10T00:00:00Z",
          endDate: "2025-12-30T00:00:00Z",
          name: "TaskInvalidUser",
          description: "Testing with invalid user",
          priority: "medium",
          dependenciesTasks: [],
          status: "todo",
          comments: [],
          users: ["invalid_user"],
          projectName: "Nuevo_Proyecto_2",
          organizationName: "OrganizationExample_2"
        });
  
      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal(true);
      expect(response.body.result).to.equal("User invalid_user not found");
    });
  
    it('should return 401 if the user is not authenticated', async () => {
      const response = await request(app)
        .post('/task')
        .send({
          startDate: "2025-12-10T00:00:00Z",
          endDate: "2025-12-30T00:00:00Z",
          name: "TaskUnauthenticated",
          description: "Testing without authentication",
          priority: "low",
          dependenciesTasks: [],
          status: "todo",
          comments: [],
          users: ["test_user2"],
          projectName: "Nuevo_Proyecto_2",
          organizationName: "OrganizationExample_2"
        });
  
      expect(response.status).to.equal(401);
    });
  
    after(async () => {
      if (taskId) {
        const response = await request(app)
          .delete(`/task/${taskId}`)
          .set('Authorization', `${token}`);
        expect(response.status).to.equal(200);
      }
    });
  });

  describe('GET /task', () => {
    it('should get the task successfully', async () => {
      const response = await request(app)
        .get('/task')
        .set('Authorization', `${token}`)
        .query({
          name: "Implementación de la interfaz de usuario",
          projectName: "Nuevo_Proyecto_2",
          organizationName: "OrganizationExample_2"
        });
      expect(response.status).to.equal(200);
      expect(response.body.result).to.be.an('array');
    });

    it('should not get the task because the user is not authenticated', async () => {
      const response = await request(app)
        .get('/task')
        .query({
          name: "Implementación de la interfaz de usuario",
          projectName: "Nuevo_Proyecto_2",
          organizationName: "OrganizationExample_2"
        });
      expect(response.status).to.equal(401);
    });

    it('should not get the task because the organization does not exists', async () => {
      const response = await request(app)
        .get('/task')
        .set('Authorization', `${token}`)
        .query({
          name: "Implementación de la interfaz de usuario",
          projectName: "Nuevo_Proyecto_2",
          organizationName: "OrganizationExample_9"
        });
      expect(response.status).to.equal(404);
    });
  });

  describe('GET /task/:id', () => {
    let taskId: string;
  
    before(async () => {
      // Crear una tarea para la prueba
      const taskResponse = await request(app)
        .post('/task')
        .set('Authorization', `${token}`)
        .send({
          startDate: "2025-12-10T00:00:00Z",
          endDate: "2025-12-30T00:00:00Z",
          name: "TaskById",
          description: "Testing retrieval by ID",
          priority: "medium",
          dependenciesTasks: [],
          status: "todo",
          comments: [],
          users: ["test_user2"],
          projectName: "Nuevo_Proyecto_2",
          organizationName: "OrganizationExample_2"
        });
      expect(taskResponse.status).to.equal(201);
      taskId = taskResponse.body.result._id;
    });
  
    after(async () => {
      // Eliminar la tarea creada
      const deleteResponse = await request(app)
        .delete(`/task/${taskId}`)
        .set('Authorization', `${token}`);
      expect(deleteResponse.status).to.equal(200);
    });
  
    it('should retrieve a task by ID successfully', async () => {
      const response = await request(app)
        .get(`/task/${taskId}`)
        .set('Authorization', `${token}`);
      expect(response.status).to.equal(200);
      expect(response.body.error).to.equal(false);
      expect(response.body.result.name).to.equal("TaskById");
    });
  
    it('should return 404 if task ID does not exist', async () => {
      const response = await request(app)
        .get('/task/61a5f2118dfe0b1a98765432') // ID inexistente
        .set('Authorization', `${token}`);
      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal(true);
      expect(response.body.result).to.equal('Task not found');
    });
  
    it('should return 401 if user is not authenticated', async () => {
      const response = await request(app).get(`/task/${taskId}`);
      expect(response.status).to.equal(401);
    });
  });
  
  describe('PUT /task', () => {
    it('should update a task successfully', async () => {
      const taskName = "Implementación de la interfaz de usuario";
      const updatedDescription = "Tarea actualizada para desarrollar la interfaz de usuario en el proyecto";
      const updatedEndDate = "2025-12-16T00:00:00Z";
      const updatedPriority = "low";
      const updatedState = "done";
      const projectName = "Nuevo_Proyecto_2";
      const organizationName = "OrganizationExample_2";
      const assignedTo = "test_user2"; 

      const response = await request(app)
        .put('/task') 
        .set('Authorization', `${token}`) 
        .send({
          name: taskName, 
          description: updatedDescription,
          endDate: updatedEndDate, 
          priority: updatedPriority, 
          status: updatedState, 
          projectName, 
          organizationName,
          assignedTo: assignedTo 
        });
      expect(response.status).to.equal(200);
      expect(response.body.result.priority).to.equal(updatedPriority);
      expect(response.body.result.status).to.equal(updatedState);
      expect(response.body.result.description).to.equal(updatedDescription);
      expect(new Date(response.body.result.endDate).getTime()).to.equal(new Date(updatedEndDate).getTime());
    });

    it('should not update the task because the user is not authenticated', async () => {
      const taskName = "Implementación de la interfaz de usuario";
      const updatedDescription = "Tarea actualizada para desarrollar la interfaz de usuario en el proyecto";
      const updatedEndDate = "2024-12-16T00:00:00Z";
      const updatedPriority = "low";
      const updatedState = "done";
      const projectName = "Nuevo_Proyecto_2";
      const organizationName = "OrganizationExample_2";
      const assignedTo = "test_user2"; 

      const response = await request(app)
        .put('/task') 
        .send({
          name: taskName, 
          description: updatedDescription,
          endDate: updatedEndDate, 
          priority: updatedPriority, 
          status: updatedState, 
          projectName, 
          organizationName,
          assignedTo: assignedTo 
        });
      expect(response.status).to.equal(401);
    });
  });

  describe('DELETE /task', () => {
    it('should delete a task successfully', async () => {
      const response = await request(app)
        .delete('/task')
        .set('Authorization', `${token}`)
        .send({
          name: "Implementación de la interfaz de usuario",
          projectName: "Nuevo_Proyecto_2",
          organizationName: "OrganizationExample_2"
        });

      expect(response.status).to.equal(200);
    });

    it('should not delete the task because the user is not authenticated', async () => {
      const response = await request(app)
        .delete('/task')
        .send({
          name: "Implementación de la interfaz de usuario",
          projectName: "Nuevo_Proyecto_2",
          organizationName: "OrganizationExample_2"
        });
      expect(response.status).to.equal(401);
    });

    it('should not delete the task because the organization does not exists', async () => {
      const response = await request(app)
        .delete('/task')
        .set('Authorization', `${token}`)
        .send({
          name: "Implementación de la interfaz de usuario",
          projectName: "Nuevo_Proyecto_2",
          organizationName: "OrganizationExample_9"
        });
      expect(response.status).to.equal(404);
    });

    it('should not delete because the prohect does not exists', async () => {
      const response = await request(app)
        .delete('/task')
        .set('Authorization', `${token}`)
        .send({
          name: "Implementación de la interfaz de usuario",
          projectName: "Nuevo_Proyecto_7",
          organizationName: "OrganizationExample_2"
        });
      expect(response.status).to.equal(404);
    });
  });

  describe('DELETE /task/:id', () => {
    let taskId: string;
  
    before(async () => {
      // Crear una tarea para la prueba
      const taskResponse = await request(app)
        .post('/task')
        .set('Authorization', `${token}`)
        .send({
          startDate: "2025-12-10T00:00:00Z",
          endDate: "2025-12-30T00:00:00Z",
          name: "TaskToDelete",
          description: "Tarea para probar eliminación",
          priority: "medium",
          dependenciesTasks: [],
          status: "todo",
          comments: [],
          users: ["test_user2"],
          projectName: "Nuevo_Proyecto_2",
          organizationName: "OrganizationExample_2"
        });
      expect(taskResponse.status).to.equal(201);
      taskId = taskResponse.body.result._id;
    });
  
    it('should delete a task successfully by ID', async () => {
      const response = await request(app)
        .delete(`/task/${taskId}`)
        .set('Authorization', `${token}`);
      expect(response.status).to.equal(200);
      expect(response.body.error).to.equal(false);
    });
  
    it('should return 404 if the task ID does not exist', async () => {
      const response = await request(app)
        .delete('/task/61a5f2118dfe0b1a98765432') // ID inexistente
        .set('Authorization', `${token}`);
      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal(true);
      expect(response.body.result).to.equal('Task not found');
    });
  
    it('should return 401 if the user is not authenticated', async () => {
      const response = await request(app)
        .delete(`/task/${taskId}`);
      expect(response.status).to.equal(401);
    });
  });  
});