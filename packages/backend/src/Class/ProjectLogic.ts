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
import { LIMIT } from './DBAdapter.js';

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
  
  async searchPorjectsFromUser(userId : any) : Promise<APIResponseFormat> {
    try {
      const projects = await this.dbAdapter.find(Project, { 'users.user': userId }, {_id: 0, __v: 0});
      return createResponseFormat(false, projects);
    } catch (error) {
      return createResponseFormat(true, error);
    }
  }

  async searchProjects(orgID: string, projectName: string, page: number = 1): Promise<APIResponseFormat> {
    try { 
      const query = this.buildSearchQuery(orgID, projectName);
      const limit = LIMIT;
      const skip = (page - 1) * limit;
      const projects = await this.dbAdapter.find(Project, query, {_id: 0, __v: 0}, skip, limit);
      const total = await this.dbAdapter.countDocuments(Project, query);
      const totalPages = Math.ceil(total / limit);
      if (page > totalPages) {
        return createResponseFormat(true, 'Page out of range');
      }
      return createResponseFormat(false, { projects, totalPages });
    } catch (error) {
      return createResponseFormat(true, error);
    }
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
    return this.dbAdapter.findOne(Project, this.buildSearchQuery(orgID, projectName), {});
  }

  public async checkifUserIsOnProject(organizationID: string, projectName: string, userID: string): Promise<boolean> {
    const query = this.buildSearchQuery(organizationID, projectName);
    const project = await this.dbAdapter.find(Project, query, {_id: 0, __v: 0});
    const users = project[0].users;
    for (let i = 0; i < users.length; i++) {
      if (users[i].user == userID) {
        return true;
      }
    }
    return false;
  }

  public async deleteProject(nameOrg: string, projectToDelete: string): Promise<APIResponseFormat> {
    const query = this.buildSearchQuery(nameOrg, projectToDelete);
    const project = await this.dbAdapter.deleteOne(Project, query);
    return createResponseFormat(false, project);
  }

  public async updateProject(nameProject: string, description: string, startDate: string, endDate: string, users: string[], sprints: any): Promise<APIResponseFormat> {
    const query = this.buildSearchQuery('', nameProject);
    const data = {
      description,
      startDate,
      endDate,
      users,
      sprints
    };
    const project = await this.dbAdapter.updateOne(Project, query, data);
    return createResponseFormat(false, project);
  }

  private buildSearchQuery(orgID: string, projectName: string): any {
    let query: any = {};
    if (orgID) {
      query.organization = orgID;
    }
    if (projectName) {
      query.name =  { $regex: projectName, $options: 'i' };
    }
    return query;
  }
}