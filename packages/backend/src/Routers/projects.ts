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
import { getUserFromHeader, isAdminOfOrganization, isAdminOrOwnerOfProject, isMemberOfOrganization } from '../Utils/CRUD-util-functions.js';
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
    const isAdmin = isAdminOfOrganization(organizationResult, user._id);
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
 * @brief This endpoint is used to add a user to a project
 * @param req The request object
 * @param res The response object
 * @returns void
 */
projectsRouter.post('/user', jwtMiddleware, async (req, res) => {
  try {
    const { project, user, role } = req.body;
    // We need search the project
    const projectResult = await projectLogic.searchProjectById(project as string);
    if (projectResult.error) {
      res.status(404).send(createResponseFormat(true, 'Project not found'));
      return;
    }
    const userResult = await userLogic.searchUserById(user);
    if (!userResult) {
      res.status(404).send(createResponseFormat(true, 'User not found'));
      return;
    }
    // Check if the user is an Admin or Owner of the project
    const userFromHeader = await getUserFromHeader(req) as any;
    if (!userFromHeader) {
      res.status(401).send(createResponseFormat(true, 'User not found'));
      return;
    }
    // Check if the user is an Admin or Owner of the project
    const isAdminOrOwner = isAdminOrOwnerOfProject(projectResult.result, userFromHeader._id);
    if (!isAdminOrOwner) {
      res.status(403).send(createResponseFormat(true, 'User is not an admin or owner of the project'));
      return;
    }
    // Obtain the organization of the project 
    const organizationResult = await organizationLogic.searchOrganizationByProject(project);
    if (!organizationResult) {
      res.status(404).send(createResponseFormat(true, 'Organization not found'));
      return;
    }
    // Check if the user is in the organization
    const isUserInOrganization = await isMemberOfOrganization(organizationResult, user);
    if (!isUserInOrganization) {
      res.status(403).send(createResponseFormat(true, 'User is not in the organization'));
      return;
    }
    // Add the user to the project
    const userToAdd = { user, role };
    const userAdded = await projectLogic.addUserToProject(project, userToAdd);
    if (!userAdded.result) {
      res.status(404).send(createResponseFormat(true, 'User not added to the project'));
      return;
    }
    res.status(201).send(userAdded);
  } catch (error: any) {
    res.status(500).send(createResponseFormat(true, error.message));
  }
});


/**
 * @brief This endpoint is used to add a sprint to a project
 * @param req The request object
 * @param res The response object
 * @returns void
 */
projectsRouter.post('/sprint', jwtMiddleware, async (req, res) => {
  try {
    const { project, sprint } = req.body;
    // We need search the project
    const projectResult = await projectLogic.searchProjectById(project);
    if (projectResult.error) {
      res.status(404).send(createResponseFormat(true, 'Project not found'));
      return;
    }
    // Obtain the user from the JWT
    const user: any = await getUserFromHeader(req);
    if (!user) {
      res.status(401).send(createResponseFormat(true, 'User not found'));
      return;
    }
    // Check if the user is an Admin or Owner of the project
    const isAdminOrOwner = isAdminOrOwnerOfProject(projectResult.result, user._id);
    if (!isAdminOrOwner) {
      res.status(403).send(createResponseFormat(true, 'User is not an admin or owner of the project'));
      return;
    }
    // Add the sprint to the project
    const sprintAdded = await projectLogic.addSprintToProject(project, sprint);
    if (!sprintAdded.result) {
      res.status(404).send(createResponseFormat(true, 'Sprint not added to the project'));
      return;
    }
    res.status(201).send(sprintAdded);
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
    let { organization, name, page } = req.query;
    // We need search the organization
    const organizationResult = await organizationLogic.searchOrganizationByName(organization as string);
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
    let pageSelected: number = parseInt(page as string);
    if (isNaN(parseInt(page as string)) || parseInt(page as string) < 1) {
      pageSelected = 1;
    }
    const response = await projectLogic.searchProjects(organizationResult._id.toString(), name as string, pageSelected);
    if (response.error) {
      res.status(404).send(response);
      return;
    }
    res.set('totalPages', response.result.totalPages);
    response.result = response.result.projects;
    res.status(200).send(response);
  } catch (error: any) {
    res.status(500).send(createResponseFormat(true, error.message));
  }
});

/**
 * @brief This endpoint is used to search projects from a user
 * @param req The request object
 * @param res The response object
 * @returns void
 */
projectsRouter.get('/user', jwtMiddleware, async (req, res) => {
  try {
    // We need obtain the user from the JWT
    const user: any = await getUserFromHeader(req);
    if (!user) {
      res.status(401).send(createResponseFormat(true, 'User not found'));
      return;
    }
    const response = await projectLogic.searchProjectsFromUser(user._id);
    res.status(200).send(response);
  } catch (error: any) {
    res.status(500).send(createResponseFormat(true, error.message));
  }
});

/**
 * @brief This endpoint is used to search projects from the id
 * @param req The request object
 * @param res The response object
 * @returns void
 */
projectsRouter.get('/sprints', jwtMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);
    const response = await projectLogic.searchProjectById(id);
    if (response.error) {
      res.status(404).send(response);
      return;
    }
    const user: any = await getUserFromHeader(req);
    const response_2 = await projectLogic.searchSprintsFromUser(user._id);
    res.status(200).send(response_2);
  } catch (error: any) {
    res.status(500).send(createResponseFormat(true, error.message));
  }
});

/**
 * @brief This endpoint is used to search projects from the id
 * @param req The request object
 * @param res The response object
 * @returns void
 */
projectsRouter.get('/id/:id', jwtMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);
    const response = await projectLogic.searchProjectById(id);
    if (response.error) {
      res.status(404).send(response);
      return;
    }
    res.status(200).send(response);
  } catch (error: any) {
    res.status(500).send(createResponseFormat(true, error.message));
  }
});

/**
 * @brief This endpoint is used to search projects from a user
 * @param req The request object
 * @param res The response object
 * @returns void
 */
projectsRouter.get('/searchprojects/:username', jwtMiddleware, async (req, res) => {
  try {
    const user = await userLogic.searchUsersByUsername(req.params.username);
    if (user.error) {
      res.status(404).send(user);
      return;
    }
    const response = await projectLogic.searchProjectsFromUser(user.result._id);
    res.status(200).send(response);
  } catch (error: any) {
    res.status(500).send(createResponseFormat(true, error.message));
  }
})

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
    const isAdmin = isAdminOfOrganization(organizationResult, user._id);
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
    if (!projectUpdate.result) {
      res.status(404).send(createResponseFormat(true, 'Project not found'));
    }
    res.status(200).send(projectUpdate);
  } catch (error: any) {
    res.status(500).send(createResponseFormat(true, error.message));
  }
});

/**
 * @brief This endpoint is used to update the role of a user in a project
 * @param req The request object
 * @param res The response object
 * @returns void
 */
projectsRouter.put('/user', jwtMiddleware, async (req, res) => {
  try {
    const { project, user, role } = req.body;
    // We need search the project
    const projectResult = await projectLogic.searchProjectById(project);
    if (!projectResult) {
      res.status(404).send(createResponseFormat(true, 'Project not found'));
      return;
    }
    // Obtain the user from the JWT
    const userFromHeader = await getUserFromHeader(req) as any;
    if (!userFromHeader) {
      res.status(401).send(createResponseFormat(true, 'User not found'));
      return;
    }
    // Check if the user is an Admin or Owner of the project
    const isAdminOrOwner = isAdminOrOwnerOfProject(projectResult.result, userFromHeader._id);
    if (!isAdminOrOwner) {
      res.status(403).send(createResponseFormat(true, 'User is not an admin or owner of the project'));
      return;
    }
    // Update the role of the user in the project
    const userUpdate = await projectLogic.updateRoleOfUserInProject(project, user, role);
    if (!userUpdate.result) {
      res.status(404).send(createResponseFormat(true, 'User not found in the project'));
      return;
    }
    res.status(200).send(userUpdate);
  } catch (error: any) {
    res.status(500).send(createResponseFormat(true, error.message));
  }
});

/**
 * @brief This endpoint is used to update the sprint of a project
 * @param req The request object
 * @param res The response object
 * @returns void
 */
projectsRouter.put('/sprint', jwtMiddleware, async (req, res) => {
  try {
    const { project, sprintID, sprint } = req.body;
    // We need search the project
    const projectResult = await projectLogic.searchProjectById(project);
    if (projectResult.error) {
      res.status(404).send(createResponseFormat(true, 'Project not found'));
      return;
    }
    // Obtain the user from the JWT
    const user: any = await getUserFromHeader(req);
    if (!user) {
      res.status(401).send(createResponseFormat(true, 'User not found'));
      return;
    }
    // Check if the user is an Admin or Owner of the project
    const isAdminOrOwner = isAdminOrOwnerOfProject(projectResult.result, user._id);
    if (!isAdminOrOwner) {
      res.status(403).send(createResponseFormat(true, 'User is not an admin or owner of the project'));
      return;
    }
    // Update the sprint of the project
    const sprintUpdate = await projectLogic.updateSprintOfProject(project, sprintID, sprint);
    if (!sprintUpdate.result) {
      res.status(404).send(createResponseFormat(true, 'Sprint not found in the project'));
      return;
    }
    res.status(200).send(sprintUpdate);
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
    const isAdmin = isAdminOfOrganization(organizationResult, user._id);
    if (!isAdmin) {
      res.status(403).send(createResponseFormat(true, 'User is not an admin of the organization'));
      return;
    }
    // Delete the project
    const projectDelete = await projectLogic.deleteProject(organizationResult._id.toString(), project);
    if (!projectDelete.result) {
      res.status(404).send(createResponseFormat(true, 'Project not found'));
      return;
    }
    res.status(200).send(projectDelete);
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
projectsRouter.delete('/user', jwtMiddleware, async (req, res) => {
  try {
    const { project, user } = req.body;
    // We need search the project 
    const projectResult = await projectLogic.searchProjectById(project);
    if (!projectResult) {
      res.status(404).send(createResponseFormat(true, 'Project not found'));
      return;
    }
    // Obtain the user from the JWT
    const userResult = await userLogic.searchUserById(user);
    if (!userResult) {
      res.status(404).send(createResponseFormat(true, 'User not found'));
      return;
    }
    // Check if the user is an Admin or Owner of the project
    const userFromHeader = await getUserFromHeader(req) as any;
    if (!userFromHeader) {
      res.status(401).send(createResponseFormat(true, 'User not found'));
      return;
    }
    // Delete the user from the project
    const projectDelete = await projectLogic.deleteUserFromProject(project, user); 
    if (!projectDelete.result) {
      res.status(404).send(createResponseFormat(true, 'User not found in the project'));
      return;
    }
    res.status(200).send(projectDelete);
  } catch (error: any) {
    res.status(500).send(createResponseFormat(true, error.message));
  }
});

/**
 * @brief This endpoint is used to delete a sprint from a project
 * @param req The request object
 * @param res The response object
 * @returns void
 */
projectsRouter.delete('/sprint', jwtMiddleware, async (req, res) => {
  try {
    const { project, sprintID } = req.body;

    // We need search the project
    const projectResult = await projectLogic.searchProjectById(project);
    if (!projectResult) {
      res.status(404).send(createResponseFormat(true, 'Project not found'));
      return;
    }
    // Obtain the user from the JWT
    const user: any = await getUserFromHeader(req);
    if (!user) {
      res.status(401).send(createResponseFormat(true, 'User not found'));
      return;
    }
    // Check if the user is an Admin or Owner of the project
    const isAdminOrOwner = isAdminOrOwnerOfProject(projectResult.result, user._id);
    if (!isAdminOrOwner) {
      res.status(403).send(createResponseFormat(true, 'User is not an admin or owner of the project'));
      return;
    }
    // Delete the sprint from the project
    const sprintDelete = await projectLogic.deleteSprintFromProject(project, sprintID);
    if (!sprintDelete.result) {
      res.status(404).send(createResponseFormat(true, 'Sprint not found in the project'));
      return;
    }
    res.status(200).send(sprintDelete);
  } catch (error: any) {
    res.status(500).send(createResponseFormat(true, error.message));
  }
});