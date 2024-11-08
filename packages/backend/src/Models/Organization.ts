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
 * @brief Model of Organization
 */

import { Document, Schema, model } from 'mongoose';

/**
 * Enumerate of roles in the organization
 */
export enum OrgRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

/**
 * Type of member in the organization
 */
export interface OrgMember {
  user: Schema.Types.ObjectId; // Reference to the user object
  role: OrgRole; // The role of the user in the organization
}

/**
 * Interface of Organization
 */
export interface OrganizationInterface extends Document {
  name: string; // Name of the organization
  members: OrgMember[]; // List of members in the organization
  projects: Schema.Types.ObjectId[]; // List of projects in the organization
}

/**
 * Schema de Organization
 */
const OrganizationSchema = new Schema<OrganizationInterface>({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 50,
  },
  members: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
        _id: false,
      },
      role: {
        type: String,
        enum: Object.values(OrgRole),
        required: true,
      },
      _id: false,
    },
  ],
  projects: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Projects',
      required: true,
      _id: false,
    },
  ],
});

const Organization = model<OrganizationInterface>(
  'Organization',
  OrganizationSchema,
);

export default Organization;
