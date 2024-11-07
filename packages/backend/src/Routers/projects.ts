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
projectsRouter.get('/sprints', jwtMiddleware, async (req, res) => {
  try {
    let { name } = req.query;
    const projects = await Project.find({name: { $regex: new RegExp('^' + name as string, 'i') }}).select('-name -description -startDate -endDate -users');
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
projectsRouter.get('/users', jwtMiddleware, async (req, res) => {
  try {
    let { name } = req.query;
    const projects = await Project.find({name: { $regex: new RegExp('^' + name as string, 'i') }}).select('-name -description -startDate -endDate -sprints');
    res.status(200).send(projects);
  } catch (error) {
    res.status(500).send('Failed to search projects!');
  }
});