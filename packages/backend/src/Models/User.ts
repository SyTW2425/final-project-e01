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
 * @brief Model of User
 */

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
  img_path?: string;
  organizations: Schema.Types.ObjectId[];
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
  role: {
    type: String,
    enum: [Role.Admin, Role.User],
    default: Role.User,
  },
  img_path: {
    type: String,
    default: 'default.png',
  },
  organizations: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      validate: {
        validator: (v: Schema.Types.ObjectId[]) => v.length > 0,
        message: 'You must belong to at least one organization',
      },
    },
  ],
});

const User = model<UserDocumentInterface>('Users', UserSchema);
export default User;
