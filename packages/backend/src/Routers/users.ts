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

import Express from 'express';
import UserLogic from '../Class/UsersLogic.js';
import MongoDB from '../Class/DBAdapter.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createResponseFormat } from '../Utils/CRUD-util-functions.js';
import jwtMiddleware from '../Middleware/authMiddleware.js';

export const usersRouter = Express.Router();

// Initialize the logic
const dbAdapter = new MongoDB();
export const userLogic = new UserLogic(dbAdapter);

// Path to store the user images
const uploadDir = path.join(process.cwd(), 'public/userImages');

// Create the directory if it doesn't exist
(async () => {
  try {
    await fs.promises.mkdir(uploadDir, { recursive: true });
  } catch (err) {
    console.error("Error creating directory:", err);
  }
})();

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_, file, cb) => {
    try {
      const hash = crypto.createHash('md5').update(Date.now() + file.originalname).digest('hex');
      const filename = `${hash}${path.extname(file.originalname)}`;
      console.log(`Generated filename: ${filename}`);
      cb(null, filename);
    } catch (err) {
      console.error(`Error al generar hash: ${err}`);
      cb(err as Error, '');
    }
  },
});

/**
 * Multer configuration to accept only images
 */
const upload = multer({
  storage: storage,
  // limits: { fileSize: 5 * 1024 * 1024 }, // limit to 5MB
    // @ts-ignore: 'file' is declared but its value is never read
  // fileFilter: (req, file, cb) => {
  //   const fileTypes = /jpeg|jpg|png/;
  //   const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  //   const mimetype = fileTypes.test(file.mimetype);
    
  //   if (mimetype && extname) {
  //     return cb(null, true);
  //   }
  //   cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png)'));
  // }
});



const deleteImage = async (imgPath: string) => {
  if (imgPath !== "default.png") {
    const imgPathToDelete = path.join(uploadDir, imgPath);
    fs.unlink(imgPathToDelete, (err) => {
      if (err) {
        console.error(`Error deleting image: ${err}`);
      }
    });
  }
}


usersRouter.get('/:username', jwtMiddleware, async (req, res) => {
  try {
    const response = await userLogic.searchUsersByUsername(req.params.username);
    res.status(200).send(response);
  } catch (error) {
    const errorParsed = error as Error;
    res.status(500).send(createResponseFormat(true, errorParsed.message));
  }
})

/**
 * @brief This endpoint is used to search for users
 * @param req The request object
 * @param res The response object
 * @returns void
 */
usersRouter.get('/', jwtMiddleware, async (req, res) => { 
  try {
    const { username, email, page = 1 } = req.query;
    if (!username && !email) {
      res.status(400).send(createResponseFormat(true, 'You must provide a username or email to search for users'));
      return;
    }
    let pageSelected: number = parseInt(page as string);
    if (isNaN(pageSelected) || pageSelected < 1) {
      pageSelected = 1;
    }
    let response = await userLogic.searchUsers(username as string, email as string, pageSelected);
    if (response.error) {
      res.status(400).send(response);
      return;
    }
    res.set('totalPages', response.result.totalPages);
    response.result = response.result.users;
    res.status(200).send(response);
  } catch (error : unknown) {
    const errorParsed = error as Error;
    res.status(500).send(createResponseFormat(true, errorParsed.message));
  }
}); 

usersRouter.get('/validate', jwtMiddleware, async (req, res) => {
  try {
    const userObject = await userLogic.searchUserById(req.userId);
    res.status(200).send(createResponseFormat(false, userObject)); 
  } catch (error) {
    const errorParsed = error as Error;
    res.status(500).send(createResponseFormat(true, errorParsed.message));
  }
});

/**
 * @brief This endpoint is used to register a new user
 * @param req The request object
 * @param res The response object
 * @returns void
 */
usersRouter.post('/register', upload.single('profilePic'), async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).send(createResponseFormat(true, 'You must provide a username, email, and password to register a user'));
      return;
    }
    // Image path if the user uploaded a profile picture
    const profilePicPath = req.file ? req.file.filename : undefined;
    const response = await userLogic.registerUser(username, email, password, profilePicPath);
    res.status(201).send(response);
  } catch (error) {
    const errorParsed = error as Error;
    res.status(500).send(createResponseFormat(true, errorParsed.message));
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
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send(createResponseFormat(true, 'You must provide an email and password to login'));
      return;
    }
    const response = await userLogic.loginUser(email, password);
    res.status(200).send(response);
  } catch (error) {
    const errorParsed = error as Error;
    res.status(500).send(createResponseFormat(true, errorParsed.message));
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
    const user = await userLogic.searchUsers(null, req.body.email);
    deleteImage(user.result.users[0].img_path);
    const response = await userLogic.deleteUser(req.body.email, req.userId);
    res.status(200).send(createResponseFormat(false, response));
  } catch (error) {
    const errorParsed = error as Error;
    res.status(500).send(createResponseFormat(true, errorParsed.message));
  }
});

/**
 * @brief This endpoint is used to update a user
 * @param req The request object
 * @param res The response object
 * @returns void
 */
usersRouter.patch('/update', upload.single('profilePic'), jwtMiddleware, async (req, res) => {
  try {
    const { username, email,  password, role } = req.body;
    if (!email) {
      res.status(400).send(createResponseFormat(true, 'You must provide an email to update a user'));
      return;
    }
    if (req.file) {
      const user = await userLogic.searchUsers(null, email);
      deleteImage(user.result.users[0].img_path);
    }
    const profilePicPath = req.file ? req.file.filename : undefined;
    const response = await userLogic.updateUser(email, username ?? null, password ?? null, role ?? null, req.userId, profilePicPath);
    res.status(200).send(createResponseFormat(false, response));
  } catch (error) {
    const errorParsed = error as Error;
    res.status(500).send(createResponseFormat(true, errorParsed.message));
  }
});