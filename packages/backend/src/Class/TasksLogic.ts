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
    let tasks = await this.dbAdapter.find(Task, query, '-_id -__v');
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

  private buildSearchQuery(name: string | null, projectID: string, organizationID: string): any {
    let query = {};
    if (name) query = { ...query, name };
    query = { ...query, project: projectID };
    query = { ...query, organization: organizationID };
    return query;
  }
}