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
import Organization from '../Models/Organization.js';

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

  async searchTasks(name: string | null, projectID: string, organizationID: string): Promise<APIResponseFormat> {
    const query = this.buildSearchQuery(name, projectID, organizationID);
    let tasks = await this.dbAdapter.find(Task, query, {_id: 0, __v: 0});
    return createResponseFormat(false, tasks);
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

  async updateTask(name: string, description: string | null, endDate: string | null, priority: string | null, state: string | null, project: string, assignedTo: string | null): Promise<APIResponseFormat> {
    const taskToUpdate = await this.dbAdapter.findOne(Task, { name, project, Organization }, {});
    if (!taskToUpdate) {
      throw new Error('Task not found');
    }
    let obj: any = {};
    if (description) obj['description'] = description;
    if (endDate) obj['endDate'] = endDate;
    if (priority) obj['priority'] = priority ;
    if (state) obj['state'] = state;
    if (assignedTo) obj['assignedTo'] = assignedTo;
    const task = await this.dbAdapter.updateOne(Task, { name }, obj);
    return createResponseFormat(false, task);
  }

  async deleteTask(taskToDelete: string, projectTask: string): Promise<APIResponseFormat> {
    const taskDelete = await this.dbAdapter.deleteOne(Task, { name: taskToDelete, project: projectTask });
    return createResponseFormat(false, taskDelete);
  }

  private buildSearchQuery(name: string | null, projectID: string, organizationID: string): any {
    let query = {};
    if (name) query = { ...query, name };
    query = { ...query, project: projectID };
    query = { ...query, organization: organizationID };
    return query;
  }
}