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
 * @brief CRUD util functions file
 */

import jwt from 'jsonwebtoken';
import Organization, { OrganizationInterface } from '../Models/Organization.js';
import { APIResponseFormat } from '../types/APITypes.js';
import { userLogic } from '../Routers/users.js';
import { organizationLogic } from '../Routers/organizations.js';
import { projectLogic } from '../Routers/projects.js';

const JWT_SECRET = process.env.JWT_SECRET || 'CHILINDRINA';

/**
 * This function gets the user from a the header of a request
 * @param req The request object
 * @returns The user object
 */
export async function getUserFromHeader(req: any) {
  try {
    if (!req.headers.authorization) {
      throw new Error('Authorization header not found');
    }
    const authorizationHeader = req.headers['authorization'];
    const usuario = await getUserofJWT(authorizationHeader);
    return usuario;
  } catch (error) {
    console.error('Error getting user from header', error);
    throw new Error('Error getting user from header');
  }
}

/**
 * This function gets the user from a JWT token
 * @param token The token to get the user from
 * @returns The user object
 */
export async function getUserofJWT(token: string) {
  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    const userId = payload.userId;
    if (!userId) {
      throw new Error('UserID not found');
    }
    const usuario = await userLogic.searchUserById(userId);
    if (!usuario) {
      throw new Error('User not found');
    }
    return usuario;
  } catch (error) {
    console.error('Error getting user from JWT', error);
    throw new Error('Error getting user from JWT');
  }
}

/**
 * This function creates a response format
 * @param error The error status
 * @param result The result of the request
 * @returns APIResponseFormat
 */
export function createResponseFormat(error: boolean, result: any) : APIResponseFormat {
  return {
    error,
    result
  }
}

/**
 * This function checks if an organization exists
 * @param name The name of the organization
 * @returns the organization if it exists, null otherwise
 */
export async function checkIfOrganizationExists(name: string) : Promise<OrganizationInterface | null> {
  return Organization.findOne({ name: name });
}

/**
 * Helper to get user from header and check authorization
 * @param req The request object
 * @returns The user object or null if unauthorized
 */
export async function getAuthenticatedUser(req: any, res: any) {
  const user = await getUserFromHeader(req) as unknown as { _id: string } | null;
  if (!user) {
    res.status(401).json(createResponseFormat(true, 'Unauthorized'));
    return null;
  }
  return user;
}

/**
 * Helper to check if a user is an admin of an organization
 * @param organization The organization object
 * @param userId The user ID to check
 * @returns Boolean indicating if the user is an admin
 */
export function isAdminOfOrganization(organization: any, userId: string) {
  let member = organization.members.find((m: any) => m.user.toString() === userId.toString());
  if (!member) {
    member = organization.members.find((m: any) => m.user._id.toString() === userId.toString()); 
  }
  return member && member.role === 'admin';
}

/**
 * Helper to check if a user is a member of an organization
 * @param organization The organization object
 * @param userId The user ID to check
 * @returns Boolean indicating if the user is a member
 */
export function isMemberOfOrganization(organization: any, userId: string) {
  return organization.members.some((member: any) => member.user.toString() === userId.toString());
}

/**
 * Helper to check if a user is a admin or a owner of a project
 * @param project The project object
 * @param userId The user ID to check
 * @returns Boolean indicating if the user is a member
 */
export function isAdminOrOwnerOfProject(project: any, userId: string): boolean {
  return project.users.some((user: any) => 
    user.user._id.toString() === userId.toString() && 
    (user.role === 'admin' || user.role === 'owner')
  );
}

/**
 * Helper to map members to ObjectIds with roles, checking if users exist
 * @param members Array of members to be mapped
 * @returns Array of mapped members with ObjectIds
 */
export async function mapMembersToObjectIds(members: any[]) {
  return await Promise.all(members.map(async (member: any) => {
    const foundUser = await userLogic.searchUser(member.user) as any;
    if (!foundUser) throw new Error(`User ${member.user} not found`);
    return {
      user: foundUser._id,
      role: member.role,
    };
  }));
}

/**
 * Helper to check if a user is a member of an organization
 * @param organization The organization object
 * @param userId The user ID to check
 * @returns Boolean indicating if the user is a member
 */
export async function mapUsersToObjectIds(users: any[]) {
  return await Promise.all(users.map(async (user: any) => {
    const foundUser = await userLogic.searchUser(user) as any;
    if (!foundUser) throw new Error(`User ${user} not found`);
    return foundUser._id;
  }));
}

/**
 * Helper to validate required fields in request body
 */
export function validateRequiredFields(body: any, requiredFields: string[], res: any) {
  for (const field of requiredFields) {
    if (!body[field]) {
      res.status(400).send(createResponseFormat(true, `You must provide the ${field} to proceed`));
      return false;
    }
  }
  return true;
}

/**
 * Helper to authenticate user and check project membership
 */
export async function authenticateAndAuthorizeUser(req: any, projectName: string, organizationName: string) {
  const user = await getUserFromHeader(req) as any;
  if (!user) return { status: 401, message: 'Unauthorized' };

  const organizationResult = await organizationLogic.searchOrganizationByName(organizationName) as any;
  if (!organizationResult) return { status: 404, message: 'Organization not found' };

  const project = await projectLogic.searchProjectByName(organizationResult._id, projectName) as any;
  if (!project) return { status: 404, message: 'Project not found' };

  const isMember = await projectLogic.checkifUserIsOnProject(organizationResult._id, projectName, user._id.toString());
  if (!isMember) return { status: 403, message: 'Forbidden: You are not a member of the project' };

  return { status: 200, user, organizationId: organizationResult._id, projectId: project._id };
}