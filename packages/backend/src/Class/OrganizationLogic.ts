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

  async searchOrganizations(name: string | null) : Promise<APIResponseFormat> {
    const query = this.buildSearchQuery(name);
    let organizations = await this.dbAdapter.find(Organization, query, {_id: 0, __v: 0, members: 0, projects: 0});
    return createResponseFormat(false, organizations);
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
            console.warn(`Member ${JSON.stringify(member)} has no user field`);
          }
        })
      );
  
      return createResponseFormat(false, organization_saved);
    } catch (error) {
      return createResponseFormat(true, "Cannot create organization");
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
              console.warn(`Member ${JSON.stringify(member)} has no user field`);
            }
          })
        );
        await Promise.all(
          membersToRemove.map(async (member: any) => {
            if (member.user) {
              await userLogic.removeOrganizationFromUser(member.user, organizationToUpdate._id);
            } else {
              console.warn(`Member ${JSON.stringify(member)} has no user field`);
            }
          })
        );
      }
      return createResponseFormat(false, organizationToUpdate);
    } catch (error) {
      return createResponseFormat(true, "Unknown error occurred");
    }
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
              console.warn(`Member ${JSON.stringify(member)} has no user field`);
            }
          })
        );
      } else {
        console.warn(`Organization "${nameOrg}" has no members or members is not an array.`);
      }
      return createResponseFormat(false, organization_deleted);
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
