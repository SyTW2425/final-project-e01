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
import MongoDB from '../Class/DBAdapter.js';
import ProjectLogic from '../Class/ProjectLogic.js';
import { createResponseFormat } from '../Utils/CRUD-util-functions.js';
import { Role } from '../Models/Project.js';
import { getUserFromHeader, isAdminOfOrganization } from '../Utils/CRUD-util-functions.js';
import { organizationLogic } from './organizations.js';
import { userLogic } from './users.js';

export const projectsRouter = Express.Router();

const dbAdapter = new MongoDB();
export const projectLogic = new ProjectLogic(dbAdapter);


/**
 * @brief This endpoint is used to create a new project
 * @param req The request object
 * @param res The response object
 * @returns void
 */
projectsRouter.post('/', jwtMiddleware, async (req, res) => {
  try {
    // We need obtain the user from the JWT
    const user: any = await getUserFromHeader(req);
    if (!user) {
      res.status(401).send(createResponseFormat(true, 'User not found'));
      return;
    }
    const { organization, name, description, startDate, endDate, users } = req.body;
    // We need search the organization
    const organizationResult = await organizationLogic.searchOrganizationByName(organization);
    if (organizationResult.length === 0) {
      res.status(404).send(createResponseFormat(true, 'Organization not found'));
      return;
    }
    const organizationId = organizationResult._id;
    // Check if the user is an Admin of the organization
    const isAdmin = await isAdminOfOrganization(organizationResult, user._id);
    if (!isAdmin) {
      res.status(403).send(createResponseFormat(true, 'User is not an admin of the organization'));
      return;
    }
    // Obtain the users with their roles
    const usersWithRoles = await Promise.all(users.map(async (userEntry: any) => {
      const userResult = await userLogic.searchUser(userEntry.user) as any;
      if (!userResult) {
        throw new Error(`User ${userEntry.user} not found`);
      }
      return {
        user: userResult._id,
        role: userEntry.role
      };
    }));
    // Add the user that creates the project as OWNER
    usersWithRoles.push({
      user: user._id,
      role: Role.OWNER // Asignar el rol de OWNER
    });
    // Create the project
    const project_saved = await projectLogic.createProject(
      organizationId,
      name,
      description,
      startDate,
      endDate,
      usersWithRoles
    );

    res.status(201).send(project_saved);
  } catch (error: any) {
    res.status(500).send(createResponseFormat(true, error.message));
  }
});

/**
 * @brief This endpoint is used to search projects
 * @param req The request object
 * @param res The response object
 * @returns void
 */
projectsRouter.get('/', jwtMiddleware, async (req, res) => {
  try {
    const { organization, name } = req.body;
    // We need search the organization
    const organizationResult = await organizationLogic.searchOrganizationByName(organization);
    if (!organizationResult) {
      res.status(404).send(createResponseFormat(true, 'Organization not found'));
      return;
    }
    // Check if the user is on the organization
    const user: any = await getUserFromHeader(req);
    if (!user) {
      res.status(401).send(createResponseFormat(true, 'User not found'));
      return;
    }
    const isUserInOrganization = organizationResult.members.find((member: any) => member.user.toString() === user._id.toString());
    if (!isUserInOrganization) {
      res.status(403).send(createResponseFormat(true, 'User is not in the organization'));
      return;
    }
    const projects = await projectLogic.searchProjects(organizationResult._id.toString(), name);
    res.status(200).send(projects);
  } catch (error: any) {
    res.status(500).send(createResponseFormat(true, error.message));
  }
});

/**
 * @brief This endpoint is used to update a project
 * @param req The request object
 * @param res The response object
 * @returns void
 */
projectsRouter.put('/', jwtMiddleware, async (req, res) => {
  try {
    const { organization, name, description, startDate, endDate, users, sprints } = req.body;
    // We need search the organization
    const organizationResult = await organizationLogic.searchOrganizationByName(organization);
    if (!organizationResult) {
      res.status(404).send(createResponseFormat(true, 'Organization not found'));
      return;
    }
    // Obtain the user from the JWT
    const user: any = await getUserFromHeader(req);
    if (!user) {
      res.status(401).send(createResponseFormat(true, 'User not found'));
      return;
    }
    // Check if the user is an Admin of the organization
    const isAdmin = await isAdminOfOrganization(organizationResult, user._id);
    if (!isAdmin) {
      res.status(403).send(createResponseFormat(true, 'User is not an admin of the organization'));
      return;
    }
    // Obtain the users with their roles
    const usersWithRoles = await Promise.all(users.map(async (userEntry: any) => {
      const userResult = await userLogic.searchUser(userEntry.user) as any;
      if (!userResult) {
        throw new Error(`User ${userEntry.user} not found`);
      }
      return {
        user: userResult._id,
        role: userEntry.role
      };
    }));
    // Update the project
    const projectUpdate = await projectLogic.updateProject(name, description, startDate, endDate, usersWithRoles, sprints);
    res.status(200).send(projectUpdate);
  } catch (error: any) {
    res.status(500).send(createResponseFormat(true, error.message));
  }
});

/**
 * @brief This endpoint is used to delete a project
 * @param req The request object
 * @param res The response object
 * @returns void
 */
projectsRouter.delete('/', jwtMiddleware, async (req, res) => {
  try {
    const { organization, project } = req.body;
    // We need search the organization
    const organizationResult = await organizationLogic.searchOrganizationByName(organization);
    if (!organizationResult) {
      res.status(404).send(createResponseFormat(true, 'Organization not found'));
      return;
    }
    // Obtain the user from the JWT
    const user: any = await getUserFromHeader(req);
    if (!user) {
      res.status(401).send(createResponseFormat(true, 'User not found'));
      return;
    }
    // Check if the user is an Admin of the organization
    const isAdmin = await isAdminOfOrganization(organizationResult, user._id);
    if (!isAdmin) {
      res.status(403).send(createResponseFormat(true, 'User is not an admin of the organization'));
      return;
    }
    // Delete the project
    const projectDelete = await projectLogic.deleteProject(organizationResult._id.toString(), project);
    res.status(200).send(projectDelete);
  } catch (error: any) {
    res.status(500).send(createResponseFormat(true, error.message));
  }
});