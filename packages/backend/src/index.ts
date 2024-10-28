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
 * @brief Entrypoint of the backend server
 */
import 'dotenv/config';
import express from 'express';
import chalk from 'chalk';
import { connect } from 'mongoose';
import { usersRouter } from './Routers/users.js';

const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/test';

/**
 * Function to start the database connection
 * @returns void
 */
function startDB(): void {
  connect(MONGODB_URL)
    .then(() => {
      console.log(chalk.green('[Server_startdb] Connected to the database'));
    })
    .catch(() => {
      console.log(
        chalk.red(
          '[Server_startdb] Something went wrong when conecting to the database',
        ),
      );
      process.exit(-1);
    });
}

// Initialize the express server
export const app = express();

app.use(express.json());
app.use('/user', usersRouter);
console.log(chalk.green(`[Server_start] Server started at port ${PORT}!`));
app.listen(PORT);
startDB();
