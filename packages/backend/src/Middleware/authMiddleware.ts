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
 * @brief Middleware to verify the JWT
 */

import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Load the JWT_SECRET from the .env file
const JWT_SECRET  = process.env.JWT_SECRET || 'CHILINDRINA';

// Custom type to add the userId to the Request
export type ParsedRequest = Request & { userId: string };

/**
 * Middleware to verify the JWT
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
export default function verifyToken(req : Request, res : Response, next : NextFunction) {
  const token = req.headers['authorization'];
  if (!token) {
    res.status(401).send('Unauthorized');
    return;
  }
  try {
    const decoded : jwt.JwtPayload | string = jwt.verify(token, JWT_SECRET);
    if (!decoded || typeof decoded === 'string') {
      res.status(401).send('Unauthorized');
      return;
    }
    req.userId = decoded.userId;
    next();
    return;
  } catch (error) {
    res.status(401).send('Unauthorized');
  }
}