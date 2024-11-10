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
import { APIResponseFormat, ProjectsAPI, databaseAdapter } from '../types/APITypes.js';
import Project from '../Models/Project.js';

/**
 * Class that contains the logic of the projects
 * @class
 * @implements ProjectsAPI
 */
export default class ProjectLogic implements ProjectsAPI {
  private dbAdapter: databaseAdapter;

  constructor(dbAdapter: databaseAdapter) {
    this.dbAdapter = dbAdapter;
  }

  async searchProjects(orgID: string, projectName: string): Promise<APIResponseFormat> {
    const query = this.buildSearchQuery(orgID, projectName);
    let projects = await this.dbAdapter.find(Project, query, '-_id -__v');
    return createResponseFormat(false, projects);
  }

  async createProject(organization: string, nameProject: string, description: string, stardDate: string, endDate: string, users: any) : Promise<APIResponseFormat> {
    const project_saved = await this.dbAdapter.create(Project, {
      organization,
      name: nameProject,
      description,
      startDate: stardDate,
      endDate,
      users
    });
    return createResponseFormat(false, project_saved);
  }

  async searchProjectByName(orgID: string, projectName: string) : Promise<any> {
    return this.dbAdapter.findOne(Project, this.buildSearchQuery(orgID, projectName), '');
  }

  public async checkifUserIsOnProject(organizationID: string, projectName: string, userID: string): Promise<boolean> {
    const query = this.buildSearchQuery(organizationID, projectName);
    const project = await this.dbAdapter.find(Project, query, '-_id -__v');
    const users = project[0].users;
    for (let i = 0; i < users.length; i++) {
      if (users[i].user == userID) {
        return true;
      }
    }
    return false;
  }

  private buildSearchQuery(orgID: string, projectName: string): any {
    let query: any = {};
    if (orgID) {
      query.organization = orgID;
    }
    if (projectName) {
      query.name = projectName;
    }
    return query;
  }
}