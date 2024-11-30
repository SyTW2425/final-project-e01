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
import { organizationLogic } from '../Routers/organizations.js';
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
      const projects = await this.dbAdapter.find(Project, { 'users.user': userId }, {__v: 0});
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

  async searchProjectById(id: string): Promise<APIResponseFormat> {
    try {
      const project = await this.dbAdapter.findOne(Project, { _id: id }, {__v: 0}, {
        path: 'users.user',
        model: 'Users',
        select: 'username email img_path '
      });
      if (!project) {
        return createResponseFormat(true, 'Project not found!');
      }
      if (project.users && Array.isArray(project.users)) {
        project.users = project.users.map((user: any) => {
          if (user.user && typeof user.user === 'object') {
            const userObj = user.user.toObject ? user.user.toObject() : user.user;
            const { password, ...restOfUser } = userObj;
            return {
              ...user,
              user: restOfUser,
            };
          }
          return user;
        });
      }
      return createResponseFormat(false, project);
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
    if (!project_saved) {
      return createResponseFormat(true, 'Cannot save project');
    }
    // console.log('Project saved: ', project_saved);
    /// Add the project to the organization
    const organizationObj = await organizationLogic.addProjectToOrganization(organization, project_saved._id);
    if (organizationObj.error) {
      return createResponseFormat(true, 'Cannot save project');
    }
    // console.log('Organization updated: ', organizationObj);
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

  public async addUserToProject(projectID: string, user: any): Promise<APIResponseFormat> {
    const query = { _id: projectID };
    const project = await this.dbAdapter.findOne(Project, query, {});
    if (!project) {
      return createResponseFormat(true, 'Project not found');
    }
    const usersProject = project.users;
    usersProject.push(user);
    const data = {
      users: usersProject
    };
    const projectUpdated = await this.dbAdapter.updateOne(Project, query, data);
    if (!projectUpdated) {
      return createResponseFormat(true, 'Cannot update project');
    }
    return createResponseFormat(false, projectUpdated);
  }

  public async deleteUserFromProject(projectID: string, users: string): Promise<APIResponseFormat> {
    const query = { _id: projectID };
    /// Obtener el proyecto 
    const project = await this.dbAdapter.findOne(Project, query, {});
    if (!project) {
      return createResponseFormat(true, 'Project not found');
    }
    const usersProject = project.users;
    const newUsers = usersProject.filter((user: any) => user.user != users);
    const data = {
      users: newUsers
    };
    const projectUpdated = await this.dbAdapter.updateOne(Project, query, data);
    if (!projectUpdated) {
      return createResponseFormat(true, 'Cannot update project');
    }
    return createResponseFormat(false, projectUpdated);
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

  public async updateRoleOfUserInProject(projectID: string, userID: string, role: string): Promise<APIResponseFormat> {
    const query = { _id: projectID, 'users.user': userID };
    const project = await this.dbAdapter.findOne(Project, query, {});
    if (!project) {
      return createResponseFormat(true, 'Project not found');
    }
    const users = project.users;
    const userIndex = users.findIndex((user: any) => user.user == userID);
    users[userIndex].role = role;
    const data = {
      users
    };
    const projectUpdated = await this.dbAdapter.updateOne(Project, query, data);
    if (!projectUpdated) {
      return createResponseFormat(true, 'Cannot update project');
    }
    return createResponseFormat(false, projectUpdated);
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