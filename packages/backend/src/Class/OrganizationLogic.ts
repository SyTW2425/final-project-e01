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

  async createOrganization(name: string, members: any) : Promise<APIResponseFormat> {
    let organization_saved = await this.dbAdapter.create(Organization, {
      name,
      members
    });
    return createResponseFormat(false, organization_saved); 
  }

  async updateOrganization(nameOrg: string, members: any, newName: string | null) : Promise<APIResponseFormat> {
    const query = { name: nameOrg };
    let organizationToUpdate = await this.dbAdapter.findOne(Organization, query, {});
    if (newName && newName.length > 0) {
      organizationToUpdate.name = newName;
    } else {
      organizationToUpdate.members = members;
    }
    return createResponseFormat(false, organizationToUpdate);
  }

  async deleteOrganization(nameOrg: string) : Promise<APIResponseFormat> {
    const query = { name: nameOrg };
    let organization_deleted = await this.dbAdapter.deleteOne(Organization, query);
    return createResponseFormat(false, organization_deleted);
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
