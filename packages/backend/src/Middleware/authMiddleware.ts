import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET  = process.env.JWT_SECRET || 'CHILINDRINA';


export type ParsedRequest = Request & { userId: string };

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