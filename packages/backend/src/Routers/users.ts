/**
 * Project Mangement API
 * Author: NoexDev
 * Date: 17/08/2024
 * Description: This file contains the express router manager for the Users
 */

import Express from 'express';
import { User } from '../Models/User.js';

export const usersRouter = Express.Router();

usersRouter.get('/', async (req, res) => {
  try {
    const query = searchUsersChecks(req);
    if (typeof query === 'string') {
      res.status(400).send(query);
      return;
    }    
    const author = req.body.author;
    const usersRaw = await User.find(query).select('-password');
    const authorUser = await User.find({ "username": author });
    
    if (!query || !authorUser) {
      res.status(404).send('Failed to search users!');
      return;
    }

    // Check if the author is in the same project as the users, to filter the email
    for (let user of usersRaw) {
      let inSameProject : Boolean = authorUser[0].projects.some((project_author) => {
        return user.projects.includes(project_author);
      });
      user.email = inSameProject ? user.email : '';
    }
    res.send(usersRaw);
  } catch (error) {
    res.status(500).send('Error searching users!');
  }
});

usersRouter.post('/register', async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.send(user);
  } catch (error) {
    res.send('Error: ' + error);
  }
});



/**
 * This function checks the search users request
 */
function searchUsersChecks(req: Express.Request) : object | string {
  const { username, email, author } = req.body;
  const query : any = {};
  // Validations
  if (!username && !email) {
    return 'You must provide a username or email to search for users';
  }
  if (!author) {
    return 'You must provide an author to search for users';
  }
  // Build the query
  if (username) {
    query.username = { $regex: username, $options: 'i' };
  }
  if (email) {
    query.email = { $regex: email, $options: 'i' };
  }
  return query;
}