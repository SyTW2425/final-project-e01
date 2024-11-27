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
 * @brief File that contains the logic of the tasks
 */

import 'dotenv/config';
import { createResponseFormat } from '../Utils/CRUD-util-functions.js';
import { APIResponseFormat, TasksAPI, databaseAdapter } from '../types/APITypes.js';
import Task from '../Models/Task.js';
import { LIMIT } from './DBAdapter.js';
import Organization from '../Models/Organization.js';
import Project from '../Models/Project.js';

/**
 * Class that contains the logic of the tasks
 * @class
 * @implements TasksAPI
 */
export default class TasksLogic implements TasksAPI {
  private dbAdapter: databaseAdapter;

  constructor(dbAdapter: databaseAdapter) {
    this.dbAdapter = dbAdapter;
  }

  async searchTasks(name: string | null, projectID: string, organizationID: string, page: number = 1): Promise<APIResponseFormat> {
    const query = this.buildSearchQuery(name, projectID, organizationID);
    const limit = LIMIT;
    const skip = (page - 1) * limit;
    const tasks = await this.dbAdapter.find(Task, query, { _id: 0, __v: 0 }, skip, limit);
    const totalTasks = await this.dbAdapter.countDocuments(Task, query);
    const totalPages = Math.ceil(totalTasks / limit);
    if (page > totalPages) {
      return createResponseFormat(true, 'Page out of range');
    }
    return createResponseFormat(false, { tasks, totalPages });
  }

  async getTaskById(id: string): Promise<APIResponseFormat> {
    const task = await this.dbAdapter.findOne(Task, { _id: id }, { _id: 0, __v: 0 }, ['users', 'project', 'organization']);
    if (!task) {
      return createResponseFormat(true, 'Task not found');
    }
    if (task.users && Array.isArray(task.users)) {
      task.users = task.users.map((user: any) => {
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
    return createResponseFormat(false, task);
  }

  async createTask(startDate: string, endDate: string, name: string, description: string, priority: string, dependenciesTasks: string[], status: string, comments: string[], users: string[], project: string, organization: string) : Promise<APIResponseFormat> {
    const actualDate = new Date();
    const progress : number = 0.0;
    let task_saved = await this.dbAdapter.create(Task, {
      startDate,
      endDate,
      name,
      progress,
      description,
      priority,
      dependenciesTasks,
      createdAt: actualDate.toString(),
      updatedAt: actualDate.toString(),
      status,
      comments,
      users,
      project,
      organization
    });
    return createResponseFormat(false, task_saved); 
  }

  async updateTask(name: string, description: string | null, endDate: string | null, priority: string | null, status: string | null, project: string, organization: string, assignedTo: string | null): Promise<APIResponseFormat> {
    const org_id = await this.dbAdapter.findOne(Organization, { name: organization }, {});
    const project_id = await this.dbAdapter.findOne(Project, { name: project, organization: org_id }, {});
    const taskToUpdate = await this.dbAdapter.findOne(Task, { name, project: project_id, organization: org_id }, {});
    if (!taskToUpdate) {
      throw new Error('Task not found');
    }
    let obj: any = {};
    if (description) obj['description'] = description;
    if (endDate) obj['endDate'] = new Date(endDate);
    if (priority) obj['priority'] = priority ;
    if (status) obj['status'] = status;
    if (assignedTo) obj['assignedTo'] = assignedTo;
    const task = await this.dbAdapter.updateOne(Task, { name }, obj);
    return createResponseFormat(false, task);
  }

  async deleteTask(taskToDelete: string, projectTask: string): Promise<APIResponseFormat> {
    const taskDelete = await this.dbAdapter.deleteOne(Task, { name: taskToDelete, project: projectTask });
    return createResponseFormat(false, taskDelete);
  }

  private buildSearchQuery(name: string | null, projectID: string, organizationID: string): any {
    let query: { [key: string]: any } = {};
    // We need an regex to search by name
    if (name) {
      query['name'] = { $regex: name, $options: 'i' };
    }
    query['project'] = projectID;
    query['organization'] = organizationID;
    return query; 
  }
}