import { expect } from 'chai';
import request from 'supertest';
import { app } from '../index.js';


before(async () => {
  const orgName = "OrganizationExample2";
  const projectName = "Nuevo Proyecto";
  const user = "test2";
  const email = "test2@example.com";
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
	console.log(userResponse.body.data);
	const token = userResponse.body.data.token;
  // Crear Organización
  const orgResponse = await request(app)
    .post('/organization/')
		.set('authorization', `Bearer ${token}`)
    .send({
      name: orgName,
      members: [{ user, role: "admin" }]
    });

  expect(orgResponse.status).to.equal(201);
  expect(orgResponse.body.data.name).to.equal(orgName);

  // Crear Proyecto
  const projectResponse = await request(app)
    .post('/project/')
		.set('Authorization', `Bearer ${token}`)
    .send({
      organization: orgName,
      name: projectName,
      description: "Este es un proyecto de ejemplo",
      startDate: "2024-11-30T00:00:00Z",
      endDate: "2025-01-30T00:00:00Z",
      users: [{ user, role: "admin" }]
    });

  expect(projectResponse.status).to.equal(201);
  expect(projectResponse.body.data.name).to.equal(projectName);
});



describe('POST /task', () => {
  it('should create a task successfully', async () => {
    const response = await request(app)
      .post('/task')
      .send({
        startDate: "2024-11-30T00:00:00Z",
        endDate: "2024-12-15T00:00:00Z",
        name: "Implementación de la interfaz de usuario",
        description: "Tarea para desarrollar la interfaz de usuario en el proyecto",
        priority: "high",
        dependenciesTasks: [],
        status: "in_progress",
        comments: ["Asegurarse de seguir el diseño", "Revisar con el equipo de UX"],
        users: ["test2"],
        projectName: "Nuevo Proyecto",
        organizationName: "OrganizationExample2"
      });

    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true; // Según implementación
    expect(response.body.data.name).to.equal("Implementación de la interfaz de usuario");
  });
});

