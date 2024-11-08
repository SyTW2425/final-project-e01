/**
 * Proyecto Final: Aplicación gestora de proyectos
 * Asignatura: Sistemas y Tecnologías Web
 * Grado en Ingeniería Informática
 * Universidad de La Laguna
 *
 * @autor Pablo Rodríguez de la Rosa
 * @autor Javier Almenara Herrera
 * @autor Omar Suárez Doro
 * @version 1.0
 * @date 28/10/2024
 * @brief Model of Project
 */

import { Document, Schema, model } from 'mongoose';

export enum Role {
  DEVELOPER,
  PRODUCT_OWNER,
  SCRUM_MASTER,
  ADMIN,
  OWNER,
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
  _id: any;
  user: Schema.Types.ObjectId;
  role: Role;
  productivity: number;
};

export type projectSettings = {
  minimalRoleToUpdateUsers: Role;
  minimalRoleToDeleteUsers: Role;
  minimalRoleToCreateSprints: Role;
  minimalRoleToDeleteSprints: Role;
  minimalRoleToCreateTasks: Role;
  minimalRoleToDeleteTasks: Role;
  minimalRoleToEditTasks: Role;
  minimalRoleToEditProject: Role;
  minimalRoleToDeleteProject: Role;
  minimalRoleToCreateUsers: Role;
  isPublic: boolean;
};

/**
 * Interface of Project
 */
export interface ProjectInterface extends Document {
  organization: Schema.Types.ObjectId;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  users: Users[];
  sprints: Sprint[];
  settings: projectSettings;
}

/**
 * Schema of User
 */
const ProjectSchema = new Schema<ProjectInterface>({
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'Organizations',
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 50,
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
          type: Number,
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
    _id: false, // Do not create an _id for this subdocument
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
  settings: {
    type: {
      minimalRoleToUpdateUsers: {
        type: Number,
        enum: Object.values(Role),
      },
      minimalRoleToDeleteUsers: {
        type: Number,
        enum: Object.values(Role),
      },
      minimalRoleToCreateSprints: {
        type: Number,
        enum: Object.values(Role),
      },
      minimalRoleToDeleteSprints: {
        type: Number,
        enum: Object.values(Role),
      },
      minimalRoleToCreateTasks: {
        type: Number,
        enum: Object.values(Role),
      },
      minimalRoleToDeleteTasks: {
        type: Number,
        enum: Object.values(Role),
      },
      minimalRoleToEditTasks: {
        type: Number,
        enum: Object.values(Role),
      },
      minimalRoleToEditProject: {
        type: Number,
        enum: Object.values(Role),
      },
      minimalRoleToDeleteProject: {
        type: Number,
        enum: Object.values(Role),
      },
      minimalRoleToCreateUsers: {
        type: Number,
        enum: Object.values(Role),
      },
      isPublic: {
        type: Boolean,
        required: true,
      },
    },
  },
});

export const Project = model<ProjectInterface>('Projects', ProjectSchema);
