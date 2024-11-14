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
 * @brief Main
 */

import Express from 'express';
import UserLogic from '../Class/UsersLogic.js';
import MongoDB from '../Class/DBAdapter.js';
import { createResponseFormat } from '../Utils/CRUD-util-functions.js';
import jwtMiddleware from '../Middleware/authMiddleware.js';

export const usersRouter = Express.Router();

// Initialize the logic
const dbAdapter = new MongoDB();
export const userLogic = new UserLogic(dbAdapter);

/**
 * @brief This endpoint is used to search for users
 * @param req The request object
 * @param res The response object
 * @returns void
 */
usersRouter.get('/', jwtMiddleware, async (req, res) => { 
  try {
    const { username, email, page = 1 } = req.query;
    if (!username && !email) {
      res.status(400).send(createResponseFormat(true, 'You must provide a username or email to search for users'));
      return;
    }
    let response = await userLogic.searchUsers(username as string, email as string, parseInt(page as string));
    if (response.error) {
      res.status(400).send(response);
      return;
    }
    res.set('totalPages', response.result.totalPages);
    response.result = response.result.users;
    res.status(200).send(response);
  } catch (error : unknown) {
    const errorParsed = error as Error;
    res.status(500).send(createResponseFormat(true, errorParsed.message));
  }
});

/**
 * @brief This endpoint is used to register a new user
 * @param req The request object
 * @param res The response object
 * @returns void
 */
usersRouter.post('/register', async (req, res) => {
  try {
    let { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).send(createResponseFormat(true, 'You must provide a username, email and password to register a user'));
      return;
    }
    const response = await userLogic.registerUser(username, email, password);
    res.status(201).send(response);
  } catch (error) {
    const errorParsed = error as Error;
    res.status(500).send(createResponseFormat(true, errorParsed.message));
  }
});

/**
 * @brief This endpoint is used to login a user
 * @param req The request object
 * @param res The response object
 * @returns void
 */
usersRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send(createResponseFormat(true, 'You must provide an email and password to login'));
      return;
    }
    const response = await userLogic.loginUser(email, password);
    res.status(200).send(response);
  } catch (error) {
    const errorParsed = error as Error;
    res.status(500).send(createResponseFormat(true, errorParsed.message));
  }
});

/**
 * @brief This endpoint is used to delete a user
 * @param req The request object
 * @param res The response object
 * @returns void
 */
usersRouter.delete('/delete', jwtMiddleware, async (req, res) => {
  try {
    const response = await userLogic.deleteUser(req.body.email, req.userId);
    res.status(200).send(response);
  } catch (error) {
    const errorParsed = error as Error;
    res.status(500).send(createResponseFormat(true, errorParsed.message));
  }
});

/**
 * @brief This endpoint is used to update a user
 * @param req The request object
 * @param res The response object
 * @returns void
 */
usersRouter.patch('/update', jwtMiddleware, async (req, res) => {
  try {
    const { username, email,  password, role } = req.body;
    if (!email) {
      res.status(400).send(createResponseFormat(true, 'You must provide an email to update a user'));
      return;
    }
    const response = await userLogic.updateUser(email, username ?? null, password ?? null, role ?? null, req.userId);
    res.status(200).send(response);
  } catch (error) {
    const errorParsed = error as Error;
    res.status(500).send(createResponseFormat(true, errorParsed.message));
  }
});