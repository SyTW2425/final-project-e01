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
 * @brief tasks.ts file that contains the routes for the tasks
 */

import Express from 'express';
import MongoDB from '../Class/DBAdapter.js';
import TasksLogic from '../Class/TasksLogic.js';
import jwtMiddleware from '../Middleware/authMiddleware.js';
import { createResponseFormat, mapUsersToObjectIds, validateRequiredFields, authenticateAndAuthorizeUser } from '../Utils/CRUD-util-functions.js';

export const tasksRouter = Express.Router();

const dbAdapter = new MongoDB();
export const taskLogic = new TasksLogic(dbAdapter);

/**
 * @brief This endpoint is used to search for tasks
 * @param req The request object
 * @param res The response object
 * @returns void
 */
tasksRouter.get('/', jwtMiddleware, async (req, res) => {
  try {
    const { name, projectName, organizationName, page } = req.query;
    if (!validateRequiredFields(req.query, ['name', 'projectName', 'organizationName'], res)) return;
    const authResult = await authenticateAndAuthorizeUser(req, projectName as string, organizationName as string);
    if (authResult.status !== 200) {
      res.status(authResult.status).send(createResponseFormat(true, authResult.message));
      return;
    }
    let pageSelected: number = parseInt(page as string);
    if (isNaN(pageSelected) || pageSelected < 1) {
      pageSelected = 1;
    }
    const response = await taskLogic.searchTasks(name as string, authResult.projectId.toString(), authResult.organizationId.toString(), pageSelected);
    if (response.error) {
      res.status(404).send(response);
      return;
    }
    res.set('totalPages', response.result.totalPages);
    response.result = response.result.tasks;
    res.status(200).send(response);
  } catch (error: unknown) {
    const errorParsed = error as Error;
    res.status(500).send(createResponseFormat(true, errorParsed.message));
  }
});

/**
 * @brief This endpoint is used to create a task
 * @param req The request object
 * @param res The response object
 * @returns void
 */
tasksRouter.post('/', jwtMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, name, description, priority, dependenciesTasks, status, comments, users, projectName, organizationName } = req.body;
    if (!validateRequiredFields(req.body, ['startDate', 'endDate', 'name', 'description', 'priority', 'status', 'comments', 'users', 'projectName', 'organizationName'], res)) return;
    const authResult = await authenticateAndAuthorizeUser(req, projectName, organizationName);
    if (authResult.status !== 200) {
      res.status(authResult.status).send(createResponseFormat(true, authResult.message));
      return;
    }
    let usersIds: any[] = [];
    if (users && users.length !== 0) {
      try {
        usersIds = await mapUsersToObjectIds(users);
      } catch (error: any) {
        res.status(404).json(createResponseFormat(true, error.message));
        return;
      }
    }
    const response = await taskLogic.createTask(startDate, endDate, name, description, priority, dependenciesTasks, status, comments, usersIds, authResult.projectId.toString(), authResult.organizationId.toString());
    res.status(201).send(response);
  } catch (error: unknown) {
    const errorParsed = error as Error;
    res.status(500).send(createResponseFormat(true, errorParsed.message));
  }
});

/**
 * @brief This endpoint is used to delete a task
 * @param req The request object
 * @param res The response object
 * @returns void
 */
tasksRouter.delete('/', jwtMiddleware, async (req, res) => {
  try {
    const { name, projectName, organizationName } = req.body;
    if (!validateRequiredFields(req.body, ['name', 'projectName', 'organizationName'], res)) return;
    const authResult = await authenticateAndAuthorizeUser(req, projectName, organizationName);
    if (authResult.status !== 200) {
      res.status(authResult.status).send(createResponseFormat(true, authResult.message));
      return;
    }
    const response = await taskLogic.deleteTask(name, authResult.projectId.toString());
    res.status(200).send(response);
  } catch (error: unknown) {
    const errorParsed = error as Error;
    res.status(500).send(createResponseFormat(true, errorParsed.message));
  }
});

/**
 * @brief This endpoint is used to update a task
 * @param req The request object
 * @param res The response object
 * @returns void
 */
tasksRouter.put('/', jwtMiddleware, async (req, res) => {
  try { 
    const { name, description, endDate, priority, status, projectName, organizationName, assignedTo } = req.body;
    if (!validateRequiredFields(req.body, ['name', 'projectName', 'organizationName'], res)) return;
    const authResult = await authenticateAndAuthorizeUser(req, projectName, organizationName);
    if (authResult.status !== 200) {
      res.status(authResult.status).send(createResponseFormat(true, authResult.message));
      return;
    }
    const response = await taskLogic.updateTask(name, description, endDate, priority, status, projectName, organizationName, assignedTo);
    res.status(200).send(response);
  } catch (error: unknown) {
    const errorParsed = error as Error;
    res.status(500).send(createResponseFormat(true, errorParsed.message));
  }
})