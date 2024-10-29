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
 * @brief Model of Project
 */

import { Document, Schema, model } from 'mongoose';

export enum Role {
  OWNER = 'owner',
  DEVELOPER = 'developer',
  SCRUM_MASTER = 'scrum_master',
  PRODUCT_OWNER = 'product_owner',
  STAKEHOLDER = 'stakeholder',
}

/**
 * Type of sprint
 */
export type Sprint = {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  tasks: Schema.Types.ObjectId[];
};

/**
 * Type of users
 */
export type Users = {
  user: Schema.Types.ObjectId;
  role: Role;
  tasks: Schema.Types.ObjectId[];
  productivity: number;
};

/**
 * Interface of Project
 */
export interface ProjectInterface extends Document {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  users: Users[];
  sprints: Sprint[];
}

/**
 * Schema of User
 */
const ProjectSchema = new Schema<ProjectInterface>({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20,
  },
  description: {
    type: String,
    required: true,
    minlength: 3,
  },
  startDate: {
    type: Date,
    required: true,
    validate: {
      validator: (v: Date) => v.getTime() > Date.now(),
      message: (props) => {
        return `${props.value} is not a valid date. The start date must be greater than the current date.`;
      },
    },
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: (v: Date) => v.getTime() > Date.now(),
      message: (props) => {
        return `${props.value} is not a valid date. The end date must be greater than the current date.`;
      },
    },
  },
  users: {
    type: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'Users',
        },
        role: {
          type: String,
          enum: Object.values(Role),
        },
        tasks: [
          {
            type: Schema.Types.ObjectId,
            ref: 'Tasks',
          },
        ],
        productivity: {
          type: Number,
          min: 0,
          max: 100,
        },
      },
    ],
    required: true,
  },
  sprints: {
    type: [
      {
        name: {
          type: String,
          required: true,
          minlength: 3,
          maxlength: 20,
        },
        description: {
          type: String,
          required: true,
          minlength: 3,
        },
        startDate: {
          type: Date,
          required: true,
        },
        endDate: {
          type: Date,
          required: true,
        },
        tasks: [
          {
            type: Schema.Types.ObjectId,
            ref: 'Tasks',
          },
        ],
      },
    ],
    required: true,
  },
});

export const User = model<ProjectInterface>('Users', ProjectSchema);
