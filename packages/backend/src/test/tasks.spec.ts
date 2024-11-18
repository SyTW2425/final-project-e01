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
        startDate: "2024-11-30T00:00:00Z",
        endDate: "2024-12-15T00:00:00Z",
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
});

describe('POST /task', () => {
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
});

describe('GET /task', () => {
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
});

describe('GET /task', () => {
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

describe('PUT /task', () => {
  it('should update a task successfully', async () => {
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
});

describe('PUT /task', () => {
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
});

describe('DELETE /task', () => {
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
});

describe('DELETE /task', () => {
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
});

describe('DELETE /task', () => {
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


