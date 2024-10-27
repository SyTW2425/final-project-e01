
import { Document, Schema, model } from 'mongoose';


/**
 * Enum of Role
 */
export enum Role {
  Admin = 'admin',
  User = 'user',
}

/**
 * Interface of User
 */
export interface UserDocumentInterface extends Document {
  username: string;
  password: string;
  email: string;
  role: Role;
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
      },
    },
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
      validator: (v: string) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v),
      message: (props) => {
        return `${props.value} is not a valid email address. Please enter a valid email address.`;
      },
    },
  },
  projects: {
    type: [String],
    default: [],
  },
  role: {
    type: String,
    enum: [Role.Admin, Role.User],
    default: Role.User
  },
});

export const User = model<UserDocumentInterface>('Users', UserSchema);
