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
 * @brief API Types file, contains the interfaces of the API
 */

import { Model } from "mongoose";

/**
 * APIResponseFormat
 * @description API response format
 */
export interface APIResponseFormat {
  error : boolean;
  result : any;
}

/**
 * ApplicationAdapter
 */
export interface ApplicationAdapter {
  usersAPI : UsersAPI;
  tasksAPI : TasksAPI;
  projectsAPI : ProjectsAPI;
  organizationsAPI : OrganizationsAPI;
}


/**
 * UsersAPI
 * @description Users API
 */
export interface UsersAPI {
  searchUsers(username : string | null, email : string | null, page? : number) : Promise<APIResponseFormat>;
  registerUser(username : string, email : string, password : string) : Promise<APIResponseFormat>;
  loginUser(email : string, password : string) : Promise<APIResponseFormat>;
  deleteUser(userToDelete : string, userId : any) : Promise<APIResponseFormat>;
  updateUser(email : string, username : string | null, password : string | null, role : string | null, userId : any) : Promise<APIResponseFormat>;
}


/**
 * OrganizationsAPI
 * @description Organizations API
 * @brief This interface is used to define the methods that the organization API must implement
 */
export interface TasksAPI {
  searchTasks(name : string, project: string, organization : string, page?: number) : Promise<APIResponseFormat>;
  createTask(name : string, startDate : string, endDate : string, description : string, priority : string, dependenciesTasks : string[], status : string, comments : string[], users : string[], project : string, organization : string) : Promise<APIResponseFormat>;
  deleteTask(taskToDelete : string, projectTask: string) : Promise<APIResponseFormat>;
  updateTask(name : string, description : string | null, deadline : string | null, priority : string | null, state : string | null, project : string | null, assignedTo : string | null) : Promise<APIResponseFormat>;
}


/**
 * ProjectsAPI
 * @description Projects API
 */
export interface ProjectsAPI {
  searchProjects(nameOrg : string, nameProject : string) : Promise<APIResponseFormat>;
  createProject(organization : string, name : string, description : string, startDate : string, endDate : string, users : any) : Promise<APIResponseFormat>;
  deleteProject(nameOrg: string, projectToDelete : string) : Promise<APIResponseFormat>;
  updateProject(nameProject : string, description : string, startDate : string, endDate : string, users : string[], sprints : any) : Promise<APIResponseFormat>;
}


/**
 * OrganizationsAPI
 * @description Organizations API
 */
export interface OrganizationsAPI {
  searchOrganizations(name : string) : Promise<APIResponseFormat>;
  createOrganization(name : string, members : any) : Promise<APIResponseFormat>;
  deleteOrganization(organizationToDelete : string) : Promise<APIResponseFormat>;
  updateOrganization(name : string, newName:string, members : any) : Promise<APIResponseFormat>;
}


export interface databaseAdapter {
  findOne(model : Model<any>, query : any, filter : object) : Promise<any>;
  find(model : Model<any>, query : any, filter : object, skip? : number, limit? : number) : Promise<any>;
  create : (model : Model<any>, data : any) => Promise<any>;
  updateOne : (model : Model<any>, query : any, data : any) => Promise<any>;
  updateMany: (model: Model<any>, query: any, data: any) => Promise<any>;
  deleteOne : (model : Model<any>, query : any) => Promise<any>;
  deleteMany : (model : Model<any>, query : any) => Promise<any>;
  countDocuments : (model : Model<any>, query : any) => Promise<number>;
}

