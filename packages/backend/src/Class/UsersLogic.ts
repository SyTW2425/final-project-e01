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
 * @brief File that contains the logic of the user
 */

import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { Role } from "../Models/User.js";
import { createResponseFormat } from "../Utils/CRUD-util-functions.js";
import { APIResponseFormat, UsersAPI, databaseAdapter } from "../types/APITypes.js";
import { LIMIT } from './DBAdapter.js';

const JWT_SECRET = process.env.JWT_SECRET || 'CHILINDRINA';

/** 
 * Class that contains the logic of the users
 * @class
 * @implements UsersAPI
 */
export default class UserLogic implements UsersAPI {
  private dbAdapter : databaseAdapter;
  
  constructor(dbAdapter : databaseAdapter) {
    this.dbAdapter = dbAdapter;
  }

  async searchUsers(username : string | null, email : string | null, page : number = 1) : Promise<APIResponseFormat> {
    try {
      const limit = LIMIT;
      const skip = (page - 1) * limit;
      const query = this.buildSearchQuery(username, email);
      const users = await this.dbAdapter.find(User, query, {password: 0, _id:0, __v: 0}, skip, limit);
      const totalUsers = await this.dbAdapter.countDocuments(User, query);
      const totalPages = Math.ceil(totalUsers / limit);
      if (page > totalPages) {
        return createResponseFormat(true, 'Page out of range');
      }
      return createResponseFormat(false, { users, totalPages });
    } catch (error : unknown) {
      return createResponseFormat(true, (error as Error).message);
    }
  }

  async registerUser(username : string, email : string, password : string, profilePicPath?: string) : Promise<APIResponseFormat> {
    let user_saved = await this.dbAdapter.create(User, {
      username,
      email,
      role: Role.User,
      password: await bcrypt.hash(password, 10),
      ...(profilePicPath && { img_path: profilePicPath })
    });
    return createResponseFormat(false, user_saved);    
  }
  
  async loginUser(email : string, password : string) : Promise<APIResponseFormat> {
    const query = { email };
    const user = await this.dbAdapter.findOne(User, query, {});
    if (!user) throw new Error('User not found');
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new Error('Authentication failed by password');
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h'});
    const userObject = { ...user.toObject() };
    delete userObject.password;
    delete userObject._id;
    delete userObject.__v;
    return createResponseFormat(false, { token, userObject });
  }


  async deleteUser(userToDelete : string, userID : any) : Promise<APIResponseFormat> {
    const isAdminUser = await this.isAdmin(userID);
    userToDelete = !isAdminUser ? userToDelete : userToDelete;
    const userDelete = await this.dbAdapter.deleteOne(User, { email: userToDelete });
    return createResponseFormat(false, userDelete);
  }

  async updateUser(email : string, username : string | null, password : string | null, role : string | null, userID : any) : Promise<APIResponseFormat>{
    const isAdminUser = await this.isAdmin(userID);
    const modifierUser = await this.dbAdapter.find(User, { _id: userID }, {});
    if (!modifierUser || (modifierUser.length === 0)) throw new Error('User not found');

    const isModifyingItself = modifierUser.email === email;

    if (!isAdminUser && !isModifyingItself) {
      throw new Error('You do not have permission to update this user');
    }

    let obj : any = {};
    if (username) obj['username'] = username;
    if (email) obj['email'] = email;
    if (password) obj['password'] = await bcrypt.hash(password, 10);
    if (isAdminUser && role) obj['role'] = role; 

    const user = await this.dbAdapter.updateOne(User, { email }, { username, email, password, role });
    if (!user) {
      throw new Error('User not found');
    }
    return createResponseFormat(false, user);
  }
  
  public async isAdmin(userId : any): Promise<boolean> {
    const user = await this.dbAdapter.findOne(User, { _id: userId }, {});
    if (!user) return false;
    return user?.role === Role.Admin;
  }

  public async searchUserById(userId : any) : Promise<APIResponseFormat> {
    const user = await this.dbAdapter.findOne(User, { _id: userId }, {})
    return user;
  }

  public async searchUser(name : string) : Promise<APIResponseFormat> {
    const user = await this.dbAdapter.findOne(User, { username: name }, {});
    return user;
  }

  private buildSearchQuery(username : string | null, email : string | null) : any {
    const query: any = {};
    // TODO: Implement validations
    if (username) {
      query.username = { $regex: `^${username}`, $options: 'i' };
    }
    if (email) {
      query.email = { $regex: `^${email}`, $options: 'i' };
    }
    return query;
  }
}