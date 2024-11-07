/**
 * Proyecto Final: Aplicación gestora de proyectos
 * Asignatura: Sistemas y Tecnologías Web
 * Grado en Ingeniería Informática
 * Universidad de La Laguna
 * @author Pablo Rodríguez de la Rosa
 * @author Javier Almenara Herrera
 * @author Omar Suárez Doro
 * @version 1.0
 * @date 28/10/2024
 * @brief Main 
 */

import 'dotenv/config';
import Express from 'express';
import jwtMiddleware from '../Middleware/authMiddleware.js';
import { isAdmin } from './users.js';

import { Project } from '../Models/Project.js';

export const projectsRouter = Express.Router();


async function executeQuery(req : Express.Request, isAdminUser : boolean) {
  const query = req.query.name ? { name: { $regex: req.query.name, $options: 'i' } } : {};
  let projects = null;
  if (isAdminUser) return await Project.find(query).select('-id -__v');
  if (req.query.searching) return await Project.find(query).select('name organization description').limit(5);

  switch (req.params.toList) {
    case 'sprints':
      projects = await Project.find(query).select('sprints -id -__v'); 
      break;
    case 'users':
      projects = await Project.find(query).select('users -id -__v');
      break;
    case 'settings':
      projects = await Project.find(query).select('settings -id -__v');
      break;
    default:
      // TODO: REMOVE THIS
      projects = await Project.find(query).select('-id -__v');
      break;
  }
  return projects;
}

/**
 * @brief This endpoint is used to search for users
=======
 * @date 30/10/2024
 * @brief Router de los usuarios
 */

import { Router } from 'express';
import { Project } from '../Models/Project';
import  jwtMiddleware from '../Middleware/authMiddleware';

export const projectsRouter = Router();




/**
 * @brief This endpoint is used to search for projects
 * @param req The request object
 * @param res The response object
 * @returns void
 */
projectsRouter.get('/:tolist', jwtMiddleware, async (req, res) => {
  try {
    let { name } = req.query;
    
    const projects = await Project.find({name: { $regex: new RegExp('^' + name as string, 'i') }}).select('-sprints -users');
    res.status(200).send(projects);
  } catch (error) {
    res.status(500).send('Failed to search projects!');
  }
});

/**
 * @brief This endpoint is used to search for projects
 * @param req The request object
 * @param res The response object
 * @returns void
 */
projectsRouter.get('/:toList', jwtMiddleware, async (req, res) => {
  try {
    const isAdminUser = await isAdmin(req);
    const resultQuery = await executeQuery(req, isAdminUser);
    if (isAdminUser) res.status(200).json(resultQuery);

    resultQuery.forEach((project) => {
      if (project.settings.isPublic) return;
      if (project.users.some((user) => user.user === req.userId)) return;
      if (req.query.searching) return;
      res.status(403).send('You do not have permission to access this project!');
    });

    res.status(200).json(resultQuery);
  } catch (error) {
    res.status(500).send('Failed to search projects!');
  }
});


/**
 * @brief This endpoint is used to search for projects
 * @param req The request object
 * @param res The response object
 * @returns void
 */
projectsRouter.get('/users', jwtMiddleware, async (req, res) => {
  try {
    let { name } = req.query;
    const projects = await Project.find({name: { $regex: new RegExp('^' + name as string, 'i') }}).select('-name -description -startDate -endDate -sprints');
    res.status(200).send(projects);
  } catch (error) {
    res.status(500).send('Failed to search projects!');
  }
});