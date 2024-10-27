import 'dotenv/config';
import Express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import jwtMiddleware from '../Middleware/authMiddleware.js';

import { User } from '../Models/User.js';

const JWT_SECRET  = process.env.JWT_SECRET || 'CHILINDRINA';

export const usersRouter = Express.Router();

usersRouter.get('/', jwtMiddleware, async (req, res) => {
  try {
    const query = searchUsersChecks(req);
    if (typeof query === 'string') {
      res.status(400).send(query);
      return;
    }
    const author = req.body.author;

    const usersRaw = await User.find(query)
    .select('-password')
    .select('-projects')
    .select('-__v')
    .select('-_id');
    const authorUser = await User.find({ username: author });

    if (!query || !authorUser) {
      res.status(404).send('Failed to search users!');
      return;
    }

    // Check if the author is in the same project as the users, to filter the email
    for (let user of usersRaw) {
      let inSameProject: Boolean = authorUser[0].projects.some(
        (project_author) => {
          return user.projects.includes(project_author);
        },
      );
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
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ 
      username, 
      email, 
      password: hashedPassword
    });
    await user.save();

    user.populate('-__v');
    user.populate('-_id');

    res.status(201).send(user);
  } catch (error) {
    res.status(500).send('Error: ' + error);
  }
});

usersRouter.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const query = { $or: [{ username }, { email }] };

    const user = await User.findOne(query);
    if (!user) {
      res.status(404).json({error: 'Authentication failed'});
      return;
    }
   const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      res.status(404).json({error: 'Authentication failed'});
      return;
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ token });
  } catch (error) {
    res.json('Error: ' + error);
  }
});


/**
 * This function checks the search users request
 */
function searchUsersChecks(req: Express.Request): object | string {
  const { username, email, author } = req.body;
  const query: any = {};
  // Validations
  if (!username && !email) {
    return 'You must provide a username or email to search for users';
  }
  if (!author) {
    return 'You must provide an author to search for users';
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
