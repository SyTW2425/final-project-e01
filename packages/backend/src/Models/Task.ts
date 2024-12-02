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
 * @brief Model of Task
 */

import { Document, Schema, model } from 'mongoose';

/**
 * Priority enum
 * @brief Enum that contains the possible priorities of a task
 */
export enum priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

/**
 * Status enum
 * @brief Enum that contains the possible statuses of a task
 */
export enum status {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

/**
 * Task interface
 * @brief Interface that defines the properties of a task
 */
export interface TaskInterface extends Document {
  startDate: Date;
  endDate: Date;
  name: string;
  progress: number; // 
  description: string;
  priority: priority;
  dependenciesTasks: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  status: status;
  comments: string[];
  users: Schema.Types.ObjectId[];
  project: Schema.Types.ObjectId;
}

/**
 * Task schema
 * @brief Schema that defines the properties of a task
 */
export const TaskSchema = new Schema<TaskInterface>({
  startDate: {
    type: Date,
    required: true,
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
  name: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => v.length > 0,
      message: (props) => {
        return `${props.value} is not a valid name. The name must be greater than 0 characters.`;
      },
    },
  },
  progress: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  description: {
    type: String,
  },
  priority: {
    type: String,
    enum: Object.values(priority),
    required: true,
  },
  dependenciesTasks: {
    type: [Schema.Types.ObjectId],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: Object.values(status),
    required: true,
  },
  comments: {
    type: [String],
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      _id: false,
    },
  ],
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Projects',
    required: true,
    _id: false,
  }
});

const Task = model<TaskInterface>('Tasks', TaskSchema);
export default Task;