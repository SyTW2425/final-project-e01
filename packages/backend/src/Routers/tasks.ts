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
import jwtMiddleware from '../Middleware/authMiddleware.js';
import { Task } from '../Models/Task.js';

export const tasksRouter = Express.Router();

/**
 * @brief This endpoint is used to search for tasks
 * @param req The request object
 * @param res The response object
 * @returns void
 */
tasksRouter.get('/', jwtMiddleware, async (_req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).send('Failed to search tasks!');
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
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).send('Failed to create task!');
  }
});
