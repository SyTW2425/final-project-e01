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
 * @brief File that contains the adapter of the database
 */
import { Model } from 'mongoose';
import { databaseAdapter } from '../types/APITypes';


/**
 * MongoDB
 * @brief Class that implements the database adapter
 * @implements databaseAdapter
 */
export default class MongoDB implements databaseAdapter {
  async findOne(model : Model<any>, query : any, filter : object = {}) : Promise<any> {
    return await model.findOne(query, filter);
  }
  
  async find(model : Model<any>, query : any, filter : object = {}) : Promise<any> {
    return await model.find(query, filter);
  }

  async create(model : Model<any>, data : any) : Promise<any> {
    return await new model(data).save();
  }

  async updateOne(model : Model<any>, query : any, data : any) : Promise<any> {
    return await model.findOneAndUpdate(query, data);
  }
  
  async updateMany(model : Model<any>, query : any, data : any) : Promise<any> {
    return await model.updateMany(query, data);
  }

  async deleteOne(model : Model<any>, query : any) : Promise<any> {
    return await model.findOneAndDelete(query);
  }

  async deleteMany(model : Model<any>, query : any) : Promise<any> {
    return await model.deleteMany(query);
  }
}