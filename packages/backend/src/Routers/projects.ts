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

import express from 'express';
import jwtMiddleware from '../Middleware/authMiddleware.js';
import { Project } from '../Models/Project.js';
import { User } from '../Models/User.js';

export const projectsRouter = express.Router();

/**
 * @brief Ruta para añadir un nuevo proyecto a la base de datos.
 * @param req El objeto de solicitud (debe incluir los datos del proyecto en el cuerpo).
 * @param res El objeto de respuesta.
 * @returns Respuesta con el proyecto creado o un mensaje de error.
 */
projectsRouter.post('/', jwtMiddleware,  async (req, res) => {
  try {
    const { name, description, startDate, endDate, users, sprints } = req.body;

    // Obtener los ObjectId de los usuarios basados en sus nombres de usuario
    const userIds = await Promise.all(users.map(async (user: { user: any; role: any; productivity: any; }) => {
      const foundUser = await User.findOne({ username: user.user });
      if (!foundUser) throw new Error(`User ${user.user} not found`);
      return {
        user: foundUser._id, // Asignar el ObjectId encontrado
        role: user.role,
        productivity: user.productivity
      };
    }));

    // Crear un nuevo proyecto con los ObjectId de los usuarios
    const newProject = new Project({
      name,
      description,
      startDate,
      endDate,
      users: userIds, // Asigna los usuarios con ObjectId
      sprints
    });

    // Guardar el proyecto en la base de datos
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo guardar el proyecto' });
  }
});