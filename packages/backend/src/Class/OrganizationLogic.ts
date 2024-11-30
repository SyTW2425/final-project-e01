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
 * @brief File that contains the logic of the organizations
 */

import { createResponseFormat } from '../Utils/CRUD-util-functions.js';
import { APIResponseFormat, OrganizationsAPI, databaseAdapter } from '../types/APITypes.js';
import Organization from '../Models/Organization.js';
import { userLogic } from '../Routers/users.js';
import { projectLogic } from '../Routers/projects.js';

/**
 * Class that contains the logic of the organizations
 * @class
 * @implements OrganizationsAPI
 */
export default class OrganizationLogic implements OrganizationsAPI {
  private dbAdapter: databaseAdapter;

  constructor(dbAdapter: databaseAdapter) {
    this.dbAdapter = dbAdapter;
  }

  async searchOrganizationsById(id: string) : Promise<APIResponseFormat>  {
    let organizations = await this.dbAdapter.find(Organization, {_id: id }, {_id: 0, __v: 0, members: 0, projects: 0})
    return createResponseFormat(false, organizations);
  }

  async searchOrganizationById(id: string) : Promise<APIResponseFormat> { // Realizar cambio de los usuarios de la organización por sus usuarios de forma completa
    let organization = await this.dbAdapter.findOne(Organization, { _id: id }, {_id: 0, __v: 0}, ['members.user', 'projects']);
    if (!organization) {
      return createResponseFormat(true, "Organization not found");
    }
    if (organization.members && Array.isArray(organization.members)) {
      organization.members = organization.members.map((member: any) => {
        if (member.user && typeof member.user === "object") {
          const userObj = member.user.toObject ? member.user.toObject() : member.user;
          const { password, ...restOfUser } = userObj;
          return {
            ...member,
            user: restOfUser, 
          };
        }
        return member;
      });
    }
    return createResponseFormat(false, organization);
  }

  async searchOrganizations(name: string | null) : Promise<APIResponseFormat> {
    const query = this.buildSearchQuery(name);
    let organizations = await this.dbAdapter.find(Organization, query, {_id: 0, __v: 0, members: 0, projects: 0});
    return createResponseFormat(false, organizations);
  }

  async searchOrganizationByProject(projectID: string) : Promise<any> {
    return this.dbAdapter.findOne(Organization, { projects: projectID }, {});
  }

  async searchUsersFromOrganization(organizationID: string) : Promise<any> {
    return this.dbAdapter.find(Organization, { _id: organizationID }, { members: 1 });
  }

  async createOrganization(name: string, members: any): Promise<APIResponseFormat> {
    try {
      const organization_saved = await this.dbAdapter.create(Organization, {
        name,
        members
      });
  
      const organization = await this.dbAdapter.findOne(Organization, { name }, {});
      if (!organization) {
        throw new Error("Organization not found after creation.");
      }
  
      await Promise.all(
        members.map(async (member: any) => {
          if (member.user) {
            await userLogic.addOrganizationToUser(member.user, organization._id);
          } else {
            // console.warn(`Member ${JSON.stringify(member)} has no user field`);
          }
        })
      );
  
      return createResponseFormat(false, organization_saved);
    } catch (error) {
      return createResponseFormat(true, "Cannot create organization");
    }
  }

  async addMemberToOrganization(idOrg: string, member: any): Promise<APIResponseFormat> {
    try {
      const query = { _id: idOrg };
      const organization = await this.dbAdapter.findOne(Organization, query, {});
      if (!organization) {
        throw new Error(`Organization with ID "${idOrg}" not found.`);
      }
      const newMember = await userLogic.searchUserById(member.user);
      if (newMember.error) {
        throw new Error(`User with ID "${member.user}" not found.`);
      }
      const members = organization.members || [];
      members.push(member);
      const data = {
        members
      };
      const organization_updated = await this.dbAdapter.updateOne(Organization, query, data);
      if (!organization_updated) {
        throw new Error(`Failed to update organization with ID "${idOrg}".`);
      }
      await userLogic.addOrganizationToUser(member.user, organization._id);
      return createResponseFormat(false, organization_updated);
    } catch (error) {
      return createResponseFormat(true, "Cannot add member to organization");
    }
  }

  async updateOrganization(
    nameOrg: string,
    members: any,
    newName: string | null
  ): Promise<APIResponseFormat> {
    try {
      const query = { name: nameOrg };
  
      const organizationToUpdate = await this.dbAdapter.findOne(Organization, query, {});
      if (!organizationToUpdate) {
        throw new Error(`Organization with name "${nameOrg}" not found.`);
      }
  
      if (newName && newName.length > 0) {
        organizationToUpdate.name = newName;
      }
      if (members) {
        organizationToUpdate.members = members;
      }
  
      const organization_updated = await this.dbAdapter.updateOne(Organization, query, organizationToUpdate);
      if (!organization_updated) {
        throw new Error(`Failed to update organization with name "${nameOrg}".`);
      }
  
      if (members) {
        const oldMembers = organizationToUpdate.members || [];
        const newMembers = members;
        const membersToAdd = newMembers.filter(
          (newMember: any) => !oldMembers.some((oldMember: any) => oldMember.user === newMember.user)
        );
        const membersToRemove = oldMembers.filter(
          (oldMember: any) => !newMembers.some((newMember: any) => newMember.user === oldMember.user)
        );
        await Promise.all(
          membersToAdd.map(async (member: any) => {
            if (member.user) {
              await userLogic.addOrganizationToUser(member.user, organizationToUpdate._id);
            } else {
              // console.warn(`Member ${JSON.stringify(member)} has no user field`);
            }
          })
        );
        await Promise.all(
          membersToRemove.map(async (member: any) => {
            if (member.user) {
              await userLogic.removeOrganizationFromUser(member.user, organizationToUpdate._id);
            } else {
              // console.warn(`Member ${JSON.stringify(member)} has no user field`);
            }
          })
        );
      }
      return createResponseFormat(false, organizationToUpdate);
    } catch (error) {
      return createResponseFormat(true, "Unknown error occurred");
    }
  }

  public async addProjectToOrganization(idOrg: string, projectID: string): Promise<any> {
    const query = { _id: idOrg };
    const organization = await this.dbAdapter.findOne(Organization, query, {});
    if (!organization) {
      return createResponseFormat(true, "Organization not found");
    }
    const projects = organization.projects || [];
    projects.push(projectID);
    const data = {
      projects
    };
    const organizationUpdated = await this.dbAdapter.updateOne(Organization, query, data);
    if (!organizationUpdated) {
      return createResponseFormat(true, "Cannot update organization");
    }
    return createResponseFormat(false, organizationUpdated);
  }
  
  async deleteOrganization(nameOrg: string): Promise<APIResponseFormat> {
    try {
      const query = { name: nameOrg };
        const organization = await this.dbAdapter.findOne(Organization, query, {});
      if (!organization) {
        throw new Error(`Organization with name "${nameOrg}" not found.`);
      }
  
      const organization_deleted = await this.dbAdapter.deleteOne(Organization, query);
      if (!organization_deleted) {
        throw new Error(`Failed to delete organization with name "${nameOrg}".`);
      }
  
      if (organization.members && Array.isArray(organization.members)) {
        await Promise.all(
          organization.members.map(async (member: any) => {
            if (member.user) {
              await userLogic.removeOrganizationFromUser(member.user, organization._id);
            } else {
              // console.warn(`Member ${JSON.stringify(member)} has no user field`);
            }
          })
        );
      } else {
        // console.warn(`Organization "${nameOrg}" has no members or members is not an array.`);
      }
      return createResponseFormat(false, organization_deleted);
    } catch (error) {
      return createResponseFormat(true, "Unknown error occurred");
    }
  }

  async deleteMember(orgId: string, memberId: string): Promise<APIResponseFormat> {
    try {
      const query = { _id: orgId };
      const organization = await this.dbAdapter.findOne(Organization, query, {});
      if (!organization) {
        throw new Error(`Organization with ID "${orgId}" not found.`);
      }
      const members = organization.members || [];
      const memberIndex = members.findIndex((member: any) => member.user === memberId);
      if (memberIndex === -1) {
        throw new Error(`Member with ID "${memberId}" not found in organization with ID "${orgId}".`);
      }
      const member = members[memberIndex];
      members.splice(memberIndex, 1);
      const data = {
        members
      };
      const organization_updated = await this.dbAdapter.updateOne(Organization, query, data);
      if (!organization_updated) {
        throw new Error(`Failed to update organization with ID "${orgId}".`);
      }
      await userLogic.removeOrganizationFromUser(member.user, organization._id);
      /// Delete user from each project of the organization
      if (organization.projects && Array.isArray(organization.projects)) {
        await Promise.all(
          organization.projects.map(async (projectID: string) => {
            const project = await projectLogic.searchProjectById(projectID);
            if (project.error) {
              // console.warn(`Project with ID "${projectID}" not found.`);
              return;
            }
            const project_updated = await projectLogic.deleteUserFromProject(projectID, memberId);
            if (project_updated.error) {
              // console.warn(`Failed to update project with ID "${projectID}".`);
            }            
          })
        );
      }
      return createResponseFormat(false, organization_updated);
    } catch (error) {
      return createResponseFormat(true, "Unknown error occurred");
    }
  }
  
  public searchOrganizationByName(nameOrg: string) : Promise<any> {
    return this.dbAdapter.findOne(Organization, { name: nameOrg }, {} );
  }

  private buildSearchQuery(name: string | null) : any {
    let query : any = {};
    if (name) query['name'] = name;
    return query;
  }
}
