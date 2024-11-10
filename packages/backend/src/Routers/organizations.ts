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
 * @brief organizations.ts file that contains the routes for the organizations
 */

import Express from 'express';
import jwtMiddleware from '../Middleware/authMiddleware.js';
import MongoDB from '../Class/DBAdapter.js';
import OrganizationLogic from '../Class/OrganizationLogic.js';
import { createResponseFormat, mapMembersToObjectIds, getAuthenticatedUser, isAdminOfOrganization } from '../Utils/CRUD-util-functions.js';

export const organizationsRouter = Express.Router();

const dbAdapter = new MongoDB();
export const organizationLogic = new OrganizationLogic(dbAdapter);

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
        res.status(404).json(createResponseFormat(true, error.message));
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
    console.error(error);
    res.status(500).json(createResponseFormat(true, 'Error to search organizations'));
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
    const { name, newName, members } = req.body;
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

    const response = await organizationLogic.updateOrganization(name, membersWithObjectIds, newName);
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