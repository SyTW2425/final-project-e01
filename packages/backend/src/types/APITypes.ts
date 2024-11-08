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
  searchUsers(username : string | null, email : string | null) : Promise<APIResponseFormat>;
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
  searchTasks(name : string) : Promise<APIResponseFormat>;
  createTask(name : string, description : string, deadline : string, priority : string, state : string, project : string, assignedTo : string) : Promise<APIResponseFormat>;
  deleteTask(taskToDelete : string) : Promise<APIResponseFormat>;
  updateTask(name : string, description : string, deadline : string, priority : string, state : string, project : string, assignedTo : string) : Promise<APIResponseFormat>;
}


/**
 * ProjectsAPI
 * @description Projects API
 */
export interface ProjectsAPI {
  searchProjects(name : string) : Promise<APIResponseFormat>;
  createProject(name : string, description : string, deadline : string, priority : string, state : string, organization : string) : Promise<APIResponseFormat>;
  deleteProject(projectToDelete : string) : Promise<APIResponseFormat>;
  updateProject(name : string, description : string, deadline : string, priority : string, state : string, organization : string) : Promise<APIResponseFormat>;
}


/**
 * OrganizationsAPI
 * @description Organizations API
 */
export interface OrganizationsAPI {
  searchOrganizations(name : string) : Promise<APIResponseFormat>;
  createOrganization(name : string, description : string, deadline : string, priority : string, state : string) : Promise<APIResponseFormat>;
  deleteOrganization(organizationToDelete : string) : Promise<APIResponseFormat>;
  updateOrganization(name : string, description : string, deadline : string, priority : string, state : string) : Promise<APIResponseFormat>;
}


export interface databaseAdapter {
  findOne(model : Model<any>, query : any, filter : string) : Promise<any>;
  find(model : Model<any>, query : any, filter : string) : Promise<any>
  create : (model : Model<any>, data : any) => Promise<any>;
  updateOne : (model : Model<any>, query : any, data : any) => Promise<any>;
  updateMany: (model: Model<any>, query: any, data: any) => Promise<any>;
  deleteOne : (model : Model<any>, query : any) => Promise<any>;
  deleteMany : (model : Model<any>, query : any) => Promise<any>;
}

