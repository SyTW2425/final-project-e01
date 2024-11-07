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
import jwt from 'jsonwebtoken';
import jwtMiddleware from '../Middleware/authMiddleware.js';
import { Task } from '../Models/Task.js';
import { User, UserDocumentInterface } from '../Models/User.js';
import { Project } from '../Models/Project.js';
import { ObjectId } from 'mongoose';
export const tasksRouter = Express.Router();

const JWT_SECRET  = process.env.JWT_SECRET || 'CHILINDRINA';

/**
 * @brief This endpoint is used to search for tasks
 * @param req The request object
 * @param res The response object
 * @returns void
 */
tasksRouter.get('/', jwtMiddleware, async (req, res) => {
  try {
    /// Obtener el usuario del JWT
    if (!req.headers['authorization']) {
      return res.status(401).send({
        error: 'Unauthorized',
      });
    }
    const user = await getUserofJWT(req.headers['authorization']) as { _id: string };
    if (!user) {
      return res.status(401).send({
        error: 'Unauthorized'
      });
    }
    console.log(user);
    /// Obtener el nombre del proyecto que viene en la request
    let { projectName } = req.body;
    console.log(projectName);
    const projects = await Project.find({ name: projectName })
    if (projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    console.log(`projects: ${projects}`);
    // Verificar si el usuario actual es miembro de alguno de los proyectos encontrados
    // Buscar el proyecto en el que el usuario es miembro    
    const project = projects.find((p) => p.users.some((u) => u.user.toString() === user._id.toString()));
    if (!project) {
      return res.status(403).send({
        error: 'Forbidden: You are not a member of any matching projects'
      });
    }
    console.log(`project: ${project}`);
    // Si el usuario no está en ningún proyecto, devolver un error
    if (!project) {
      return res.status(403).json({ error: 'User is not a member of any matching projects' });
    }
    // Buscar todas las tareas que pertenezcan al proyecto
    const tasks = await Task.find({ project: project._id });
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).send('Failed to search tasks!');
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
    // Verificar si el token de autorización está presente
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Obtener el usuario del JWT
    const user = await getUserofJWT(authorizationHeader) as { _id: string };
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Obtener los datos de la tarea y el nombre del proyecto desde la solicitud
    const { startDate, endDate, name, type, progress, description, priority, dependenciesTasks, createdAt, updatedAt, status, comments, users: usersNames, project: projectName } = req.body;

    // Buscar todos los proyectos que coincidan con el nombre del proyecto
    const projects = await Project.find({ name: projectName })
    if (projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Verificar si el usuario actual es miembro de alguno de los proyectos encontrados
    // Buscar el proyecto en el que el usuario es miembro
    const project = projects.find((p) => p.users.some((u) => u.user.toString() === user._id.toString()));
    if (!project) {
      return res.status(403).send({
        error: 'Forbidden: You are not a member of any matching projects'
      });
    }
    console.log(`project: ${project}`); 

    // Si el usuario no está en ningún proyecto, devolver un error
    if (!project) {
      return res.status(403).json({ error: 'User is not a member of any matching projects' });
    }

    // Obtener los ObjectId de los usuarios especificados en `usersNames` que pertenezcan al proyecto
    const assignedUsers = [];
    for (const username of usersNames) {
      const projectUser = project.users.find((u) => (u.user as unknown as UserDocumentInterface).username === username);
      if (projectUser) {
        assignedUsers.push((projectUser.user as unknown as UserDocumentInterface)._id); // Agregar el ObjectId del usuario al array de asignados
      }
    }

    // Crear la tarea con la información y asignarla a los usuarios y proyecto especificados
    const task = new Task({
      startDate,
      endDate,
      name,
      type,
      progress,
      description,
      priority,
      dependenciesTasks,
      createdAt: createdAt || new Date(),
      updatedAt: updatedAt || new Date(),
      status,
      comments,
      users: assignedUsers, // Usar el array de IDs de los usuarios asignados
      project: project._id,
    });

    // Guardar la tarea en la base de datos
    await task.save();
    return res.status(201).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create task' });
  }
});

/**
 * @brief This endpoint is used to update a task
 * @param req The request object
 * @param res The response object
 * @returns void
 */
tasksRouter.put('/:id', jwtMiddleware, async (req, res) => {
  try {
    // Verificar si el token de autorización está presente
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Obtener el usuario del JWT
    const user = await getUserofJWT(authorizationHeader) as { _id: string };
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Obtener los datos de la tarea y el nombre del proyecto desde la solicitud
    const { startDate, endDate, name, type, progress, description, priority, dependenciesTasks, createdAt, updatedAt, status, comments, users: usersNames, project: projectName } = req.body;

    // Buscar todos los proyectos que coincidan con el nombre del proyecto
    const projects = await Project.find({ name: projectName })
    if (projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    console.log(`projects: ${projects}`);

    // Verificar si el usuario actual es miembro de alguno de los proyectos encontrados
    // Buscar el proyecto en el que el usuario es miembro
    const project = projects.find((p) => p.users.some((u) => u.user.toString() === user._id.toString()));
    if (!project) {
      return res.status(403).send({
        error: 'Forbidden: You are not a member of any matching projects'
      });
    }
    console.log(`project: ${project}`); 

    // Si el usuario no está en ningún proyecto, devolver un error
    if (!project) {
      return res.status(403).json({ error: 'User is not a member of any matching projects' });
    }

    // Obtener los ObjectId de los usuarios especificados en `usersNames` que pertenezcan al proyecto
    const assignedUsers = [];
    for (const username of usersNames) {
      const projectUser = project.users.find((u) => (u.user as unknown as UserDocumentInterface).username === username);
      if (projectUser) {
        assignedUsers.push((projectUser.user as unknown as UserDocumentInterface)._id); // Agregar el ObjectId del usuario al array de asignados
      }
    }

    // Buscar la tarea a actualizar
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Actualizar la tarea con la información y asignarla a los usuarios y proyecto especificados
    task.startDate = startDate;
    task.endDate = endDate;
    task.name = name;
    task.type = type;
    task.progress = progress;
    task.description = description;
    task.priority = priority;
    task.dependenciesTasks = dependenciesTasks;
    task.createdAt = createdAt;
    task.updatedAt = updatedAt || new Date();
    task.status = status;
    task.comments = comments;
    task.users = assignedUsers as unknown as ObjectId[]; // Usar el array de IDs de los usuarios asignados
    task.project = project._id as unknown as ObjectId;
    // Guardar la tarea en la base de datos
    await task.save();
    return res.status(200).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update task' });
  }
});

export async function getUserofJWT(token: string) {
  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    const userId = payload.userId;
    if (!userId) {
      throw new Error('UserID not found');
    }
    const usuario = await User.findById(userId);
    if (!usuario) {
      throw new Error('User not found');
    }
    return usuario;
  } catch (error) {
    console.error('Error getting user from JWT', error);
    throw new Error('Error getting user from JWT');
  }
}