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
 * @brief Main
 */

import 'dotenv/config';
import Express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import jwtMiddleware from '../Middleware/authMiddleware.js';

import { User, Role } from '../Models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'CHILINDRINA';

export const usersRouter = Express.Router();

/**
 * @brief This endpoint is used to search for users
 * @param req The request object
 * @param res The response object
 * @returns void
 */
usersRouter.get('/', jwtMiddleware, async (req, res) => {
  try {
    const query = buildSearchQuery(req);
    let admin: boolean = await isAdmin(req);
    const usersRaw = await User.find(query);
    console.log(req.userId);
    const authorUser = await User.findById(req.userId)
    .select('-password')
    .populate('projects');
    console.log(authorUser); 
    if (!authorUser) {
      res.status(404).send('Failed to search users!');
      return;
    }
    
    // Need to remove administrative fields if the user is not an admin
    // Also, remove the email if the user is not in the same project as the author
    // of the query.
    if (!admin) {
      usersRaw.forEach((user) => {
        user.toObject();
        if (
          authorUser.projects &&
          !authorUser.projects.some((project) =>
            user.projects?.includes(project),
        )
      ) {
        user.email = '';
      }
      delete user._id;
      delete user.__v;
      delete user.projects;
    });
  }
  res.send(usersRaw);
} catch (error) {
  res.status(500).send('Error searching users!');
}
});

/**
 * @brief This endpoint is used to register a new user
 * @param req The request object
 * @param res The response object
 * @returns void
 */
usersRouter.post('/register', async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const user = new User({
      username,
      email,
      role: Role.User,
      password: await bcrypt.hash(password, 10),
    });
    await user.save();

    res.status(201).send({
      result: 'User registered',
      userInfo: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).send('Error: ' + error);
  }
});

/**
 * @brief This endpoint is used to login a user
 * @param req The request object
 * @param res The response object
 * @returns void
 */
usersRouter.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(username, email, password);
    // TODO: VALIDATION OF USERNAME, EMAIL AND PASSWORD
    const query = { $or: [{ username }, { email }] };

    const user = await User.findOne(query);

    if (!user) {
      res.status(404).json({ result: 'Authentication failed by user' });
      return;
    }
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      res.status(404).json({ result: 'Authentication failed by user' });
      return;
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({
      result: 'Authentication successful',
      token,
    });
  } catch (error) {
    res.status(505).json({ result: 'Authentication failed by server' });
  }
});

/**
 * @brief This endpoint is used to delete a user
 * @param req The request object
 * @param res The response object
 * @returns void
 */
usersRouter.delete('/delete', jwtMiddleware, async (req, res) => {
  try {
    let userToDelete = req.userId;
    const admin: boolean = await isAdmin(req);
    userToDelete = !admin
      ? userToDelete
      : (req.body.username ?? req.body.email);

    const userDelete = await User.findOneAndDelete({
      $or: [
        { _id: userToDelete },
        { username: userToDelete },
        { email: userToDelete },
      ],
    });
    if (!userDelete) {
      res.status(404).json({ result: 'Delete failed by user' });
      return;
    }
    res.status(201).json({ result: 'User deleted' });
  } catch (error) {
    res.status(500).json('Error deleting user');
    return;
  }
});

/**
 * @brief This endpoint is used to update a user
 * @param req The request object
 * @param res The response object
 * @returns void
 */
usersRouter.patch('/update', jwtMiddleware, async (req, res) => {
  try {
    const updaterUserId = req.userId;
    const isUpdatingSelf : boolean = Boolean(req.headers.modifyself) ?? false;
    const isAdminUser = await isAdmin(req);
    const { username, email, password, role } = req.body;
    
    const user = isUpdatingSelf
      ? await User.findById(updaterUserId)
      : await User.findOne({ username });
      
    if (!user) {
      res.status(404).json({ result: 'User not found or unauthorized' });
      return;
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;
    if (isAdminUser && role) user.role = role;
    
    await user.save();
    res.status(201).json({ result: 'User updated' });
  } catch (error) {
    res.status(500).json('Error updating user');
    return;
  }
});

/**
 * @brief This function checks if the user is an admin
 * @param req The request object
 * @returns Promise<boolean> A promise that resolves to a boolean indicating if the user is an admin 
 */ 
export async function isAdmin(req: Express.Request) : Promise<boolean> {
  const { userId } = req;
  const user = await User.findById(userId);
  return user?.role === Role.Admin;
}

/**
 * @brief This function checks if the user is an admin and if the search query is valid
 * @param req The request object
 * @returns object
 */
function buildSearchQuery(req: Express.Request): object {
  const { username, email } = req.query;
  const query: any = {};
  // Validations
  if (!username && !email) {
    throw Error('You must provide a username or email to search for users');
  }
  // Build the query
  if (username) {
    query.username = { $regex: `^${username}`, $options: 'i' };
  }
  if (email) {
    query.email = { $regex: `^${email}`, $options: 'i' };
  }
  return query;
}
