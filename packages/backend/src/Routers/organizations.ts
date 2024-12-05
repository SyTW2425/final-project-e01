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
 * @brief organizations.ts - Organizations routes
 */

import Express from 'express';
import jwtMiddleware from '../Middleware/authMiddleware.js';
import MongoDB from '../Class/DBAdapter.js';
import OrganizationLogic from '../Class/OrganizationLogic.js';
import User from '../Models/User.js';
import { createResponseFormat, mapMembersToObjectIds, getAuthenticatedUser, isAdminOfOrganization, getUserFromHeader, isMemberOfOrganization } from '../Utils/CRUD-util-functions.js';

export const organizationsRouter = Express.Router();

const dbAdapter = new MongoDB();
export const organizationLogic = new OrganizationLogic(dbAdapter);

/**
 * @brief This endpoint is used to get all organizations
 * @param req The request object
 * @param res The response object
 * @returns void
 */
organizationsRouter.get('/', jwtMiddleware, async (req, res) => {
  try {
    const { name } = req.query;
    const response = await organizationLogic.searchOrganizations(name as string);
    res.status(200).send(response);
  } catch (error) {
    // console.error(error);
    res.status(500).json(createResponseFormat(true, 'Error to search organizations'));
  }
});

/**
 * @brief This endpoint is used to get an organization by its id
 * @param req The request object
 * @param res The response object
 * @returns void
 */
organizationsRouter.get('/:id', jwtMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const response = await organizationLogic.searchOrganizationById(id);
    if (response.error) {
      res.status(404).json(response);
      return;
    }
    res.status(200).send(response);
  } catch (error) {
    // console.error(error);
    res.status(500).json(createResponseFormat(true, 'Error to search organization'));
  }
});

/**
 * @brief This endpoint is used to get an organization by its id 
 * @param req The request object
 * @param res The response object
 * @returns void
 */
organizationsRouter.get('/searchorganizations/:id', jwtMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const response = await organizationLogic.searchOrganizations(id);
    res.status(200).send(response);
  } catch (error) {
    // console.error(error);
    res.status(500).json(createResponseFormat(true, 'Error to search organizations'));
  }
})

/**
 * @brief This endpoint is used to search organizations by name
 * @param req The request object
 * @param res The response object
 * @returns void
 */
organizationsRouter.get('/searchorganizations/name/:name', jwtMiddleware, async (req, res) => {
  try {
    const { name } = req.params;
    const response = await organizationLogic.searchOrganizationsByName(name);
    res.status(200).send(response);
  } catch (error) {
    // console.error(error);
    res.status(500).json(createResponseFormat(true, 'Error to search organizations'));
  }
})

/**
 * @brief This endpoint is used search the organization by user
 * @param req The request object
 * @param res The response object
 * @returns void
 */
organizationsRouter.get('/searchorganizations/user/:username', jwtMiddleware, async (req, res) => {
  try {
    const { username } = req.params;
    const response = await organizationLogic.searchOrganizationByUser(username);
    res.status(200).send(response);
  } catch (error) {
    // console.error(error);
    res.status(500).json(createResponseFormat(true, 'Error to search organizations'));
  }
})

/**
 * @brief This endpoint is used create a new organization
 * @param req The request object
 * @param res The response object
 * @returns void
 */
organizationsRouter.post('/', jwtMiddleware, async (req, res) => {
  try {
    const { name, members } = req.body;
    // Check if organization already exists
    const organization = await organizationLogic.searchOrganizations(name) as any;
    if (organization.result.length !== 0) {
      res.status(409).json(createResponseFormat(true, 'Organization already exists'));
      return;
    }
    // Map members to ObjectIds and add the creator as an admin
    let membersWithObjectIds: any[] = [];
    if (members && members.length !== 0) {
      try {
        membersWithObjectIds = await mapMembersToObjectIds(members);
      } catch (error: any) {
        res.status(404).send(createResponseFormat(true, error.message));
        return;
      }
    }
    const user = await getAuthenticatedUser(req, res);
    if (!user) return;
    membersWithObjectIds.push({ user: user._id, role: 'admin' });
    const organization_saved = await organizationLogic.createOrganization(name, membersWithObjectIds);
    res.status(201).send(organization_saved);
  } catch (error) {
    res.status(500).send(createResponseFormat(true, 'Cannot create organization'));
  }
});

/**
 * @brief This endpoint is used add a user to an organization
 * @param req The request object
 * @param res The response object
 * @returns void
 */
organizationsRouter.post('/member', jwtMiddleware, async (req, res) => {
  try {
    const { organization, member } = req.body;
    const user = await getUserFromHeader(req) as any;
    if (!user) {
      res.status(403).json(createResponseFormat(true, 'Forbidden'));
      return;
    }
    const organizationResult = await organizationLogic.searchOrganizationById(organization) as any;
    if (organizationResult.error) {
      res.status(404).json(createResponseFormat(true, 'Organization not found'));
      return;
    }
    if (isMemberOfOrganization(organizationResult.result, member)) {
      res.status(403).json(createResponseFormat(true, 'The user is already a member of the organization'));
      return;
    }
    if (!isAdminOfOrganization(organizationResult.result, user._id)) {
      res.status(403).json(createResponseFormat(true, 'Forbidden'));
      return;
    }
    const response = await organizationLogic.addMemberToOrganization(organization, member);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(createResponseFormat(true, 'Cannot add member to organization'));
  }
});

/** 
 * @brief This endpoint is used to update an organization
 * @param req The request object
 * @param res The response object
 * @returns void
 */
organizationsRouter.put('/', jwtMiddleware, async (req, res) => {
  try {
    const { newName, members } = req.body;
    const { name } = req.query;
    const user = await getAuthenticatedUser(req, res);
    if (!name || !user) {
      res.status(403).json(createResponseFormat(true, 'Forbidden'));
      return;
    }
    const organization = await organizationLogic.searchOrganizationByName(name as string) as any;
    if (!organization) {
      res.status(404).json(createResponseFormat(true, 'Organization not found'));
      return;
    }
    if (!isAdminOfOrganization(organization, user._id)) {
      res.status(403).json(createResponseFormat(true, 'Forbidden'));
      return;
    }
    let membersWithObjectIds: any[] = [];
    if (members && members.length !== 0) {
      try {
        membersWithObjectIds = await mapMembersToObjectIds(members);
      } catch (error: any) {
        res.status(404).json(createResponseFormat(true, error.message));
        return;
      }
    }
    if (membersWithObjectIds.length === 0 || !membersWithObjectIds.some((m: any) => m.role === 'admin')) {
      membersWithObjectIds.push({ user: user._id, role: 'admin' });
    }
    const response = await organizationLogic.updateOrganization(name as string, membersWithObjectIds, newName);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(createResponseFormat(true, 'Cannot update organization'));
  }
});

/**
 * @brief This endpoint is used to delete an organization
 * @param req The request object
 * @param res The response object
 * @returns void
 */
organizationsRouter.delete('/', jwtMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const user = await getAuthenticatedUser(req, res);
    if (!user) return;

    const organization = await organizationLogic.searchOrganizationByName(name) as any;
    if (!organization) {
      res.status(404).json(createResponseFormat(true, 'Organization not found'));
      return;
    }

    if (!isAdminOfOrganization(organization, user._id)) {
      res.status(403).json(createResponseFormat(true, 'Forbidden'));
      return;
    }

    const response = await organizationLogic.deleteOrganization(name);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(createResponseFormat(true, 'Cannot delete organization'));
  }
});

/**
 * @brief This endpoint is used to delete a member from an organization
 * @param req The request object
 * @param res The response object
 * @returns void
 */
organizationsRouter.delete('/member', jwtMiddleware, async (req, res) => {
  try {
    const { id, member } = req.body;
    const user = await getUserFromHeader(req) as any;
    const organizationResult = await organizationLogic.searchOrganizationById(id) as any;
    if (organizationResult.error) {
      res.status(404).json(createResponseFormat(true, 'Organization not found'));
      return;
    }
    if (!isAdminOfOrganization(organizationResult.result, user._id)) {
      res.status(403).json(createResponseFormat(true, 'Forbidden'));
      return;
    }
    const user_member = await dbAdapter.findOne(User, { _id: member });
    const response = await organizationLogic.deleteMember(id, user_member);
    if (response.error) {
      res.status(404).json(response);
      return;
    }
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(createResponseFormat(true, 'Cannot delete member from organization'));
  }
});