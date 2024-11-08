import jwt from 'jsonwebtoken';
import User from '../Models/User.js';
import { APIResponseFormat } from '../types/APITypes.js';


const JWT_SECRET = process.env.JWT_SECRET || 'CHILINDRINA';


/**
 * This function gets the user from a JWT token
 * @param token The token to get the user from
 * @returns The user object
 */
export async function getUserofJWT(token: string) {
  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    const userId = payload.userId;
    if (!userId) {
      throw new Error('UserID not found');
    }
    const usuario = await User.findById(userId);
    if (!usuario) {
      throw new Error('User not found');
    }
    return usuario;
  } catch (error) {
    console.error('Error getting user from JWT', error);
    throw new Error('Error getting user from JWT');
  }
}


/**
 * This function creates a response format
 * @param error The error status
 * @param result The result of the request
 * @returns APIResponseFormat
 */
export function createResponseFormat(error: boolean, result: any) : APIResponseFormat {
  return {
    error,
    result
  }
}