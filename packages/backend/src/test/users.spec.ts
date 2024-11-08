// import { expect } from 'chai';
// import request from 'supertest';
// import sinon from 'sinon';
// import { app } from '../index.js'; // Adjust path as needed
// import bcrypt from 'bcrypt';
// import { User, Role } from '../Models/User.js'; // Adjust path as needed

// // Initialize the Express app and apply middleware

// describe('POST /user/register', () => {
//   let saveStub: sinon.SinonStub;

//   beforeEach(() => {
//     // Stub the `save` method for User model
//     saveStub = sinon.stub(User.prototype, 'save');
//   });

//   afterEach(() => {
//     // Restore the original `save` method
//     saveStub.restore();
//   });

//   it('should register a new user and return a success message', async () => {
//     const newUser = {
//       username: 'testUser',
//       email: 'test@example.com',
//       password: 'password123',
//     };
//     saveStub.resolves(newUser); // Mock successful save operation

//     const res = await request(app).post('/user/register').send(newUser);

//     expect(res.status).to.equal(201);
//     expect(res.body.result).to.equal('User registered');
//     expect(res.body.userInfo).to.include({
//       username: newUser.username,
//       email: newUser.email,
//       role: Role.User, // Make sure this matches your enum or role definition
//     });
//   });

//   it('should return a 500 error if a problem occurs', async () => {
//     saveStub.rejects(new Error('Error saving user')); // Mock a failed save operation

//     const res = await request(app).post('/user/register').send({
//       username: 'testUser',
//       email: 'test@example.com',
//       password: 'password123',
//     });

//     expect(res.status).to.equal(500);
//     expect(res.text).to.contain('Error:');
//   });
// });

// describe('POST /user/login', () => {
//   let findOneStub: sinon.SinonStub;
//   let compareSyncStub: sinon.SinonStub;

//   beforeEach(() => {
//     // Stub para el método `findOne` de User (simulando búsqueda en base de datos)
//     findOneStub = sinon.stub(User, 'findOne');
//     // Stub para la comparación de contraseñas (simulando bcrypt.compareSync)
//     compareSyncStub = sinon.stub(bcrypt, 'compareSync');
//   });

//   afterEach(() => {
//     // Restauramos los métodos originales después de cada prueba
//     findOneStub.restore();
//     compareSyncStub.restore();
//   });

//   it('should login a user and return a success message with a token', async () => {
//     const user = {
//       _id: '12345',
//       username: 'testUser',
//       email: 'test@example.com',
//       password: bcrypt.hashSync('password123', 10),
//     };

//     // Stub of `findOne` to simulate that the user exists in the database
//     findOneStub.resolves(user);
//     // stub for `compareSync` to simulate a successful password comparison
//     compareSyncStub.returns(true);

//     const loginData = {
//       username: 'testUser',
//       password: 'password123',
//     };

//     const res = await request(app).post('/user/login').send(loginData);

//     expect(res.status).to.equal(201);
//     expect(res.body.result).to.equal('Authentication successful');
//     expect(res.body).to.have.property('token');
//     expect(res.body.token).to.be.a('string');
//   });

//   it('should return a 404 error if user is not found', async () => {
//     // Stub for `findOne` to simulate that the user does not exist in the database
//     findOneStub.resolves(null);

//     const loginData = {
//       username: 'nonExistentUser',
//       password: 'password123',
//     };

//     const res = await request(app).post('/user/login').send(loginData);

//     expect(res.status).to.equal(404);
//     expect(res.body.result).to.equal('Authentication failed by user');
//   });

//   it('should return a 404 error if password does not match', async () => {
//     const user = {
//       _id: '12345',
//       username: 'testUser',
//       email: 'test@example.com',
//       password: bcrypt.hashSync('password123', 10),
//     };

//     // Stub for `findOne` to simulate that the user exists in the database
//     findOneStub.resolves(user);
//     // Stub for `compareSync` to simulate a failed password comparison
//     compareSyncStub.returns(false);

//     const loginData = {
//       username: 'testUser',
//       password: 'wrongPassword',
//     };

//     const res = await request(app).post('/user/login').send(loginData);

//     expect(res.status).to.equal(404);
//     expect(res.body.result).to.equal('Authentication failed by user');
//   });

//   it('should return a 505 error if there is a server error', async () => {
//     // Simulates a server error when searching for the user
//     findOneStub.rejects(new Error('Server error'));

//     const loginData = {
//       username: 'testUser',
//       password: 'password123',
//     };

//     const res = await request(app).post('/user/login').send(loginData);

//     expect(res.status).to.equal(505);
//     expect(res.body.result).to.equal('Authentication failed by server');
//   });
// });
