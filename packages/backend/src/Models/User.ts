/**
 * Project Mangement API
 * Author: NoexDev
 * Date: 17/08/2024
 * Description: This file contains the User model and schema for the Database
 */

import { Document, Schema, model } from 'mongoose';

/**
 * Interface of User
 */
export interface UserDocumentInterface extends Document {
  username: string;
  password: string;
  email: string;
  projects: string[];
}

/**
 * Schema of User
 */
const UserSchema = new Schema<UserDocumentInterface>({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20,
    validate: {
      validator: (v: string) => /^[a-zA-Z0-9_]+$/.test(v),
      message: (props) => {
        return `${props.value} is not a valid username. You can only use letters, numbers and underscores. Also, 
        the username must be between 3 and 20 characters long.`;
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v),
      message: (props) => {
        return `${props.value} is not a valid email address. Please enter a valid email address.`;
      }
    }
  },
  projects: {
    type: [String],
    default: [],
  },
});

export const User = model<UserDocumentInterface>('Users', UserSchema);
