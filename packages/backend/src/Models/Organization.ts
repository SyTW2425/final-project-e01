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
  MEMBER = 'member'
}

/**
 * Type of member in the organization
 */
export interface OrgMember {
  user: Schema.Types.ObjectId; // Referencia al esquema de usuario
  role: OrgRole;               // Rol del miembro en la organización
}

/** 
 * Interface of Organization
 */
export interface OrganizationInterface extends Document {
  name: string;                      // Nombre de la organización
  members: OrgMember[];              // Lista de miembros y sus roles
  projects: Schema.Types.ObjectId[]; // Lista de proyectos en la organización
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
    maxlength: 50
  },
  members: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',   // Referencia al esquema de usuarios
      required: true,
      _id: false
    },
    role: {
      type: String,
      enum: Object.values(OrgRole),
      required: true,
    },
    _id: false
  }],
  projects: [{
    type: Schema.Types.ObjectId,
    ref: 'Projects',  // Referencia al esquema de proyectos
    required: true,
    _id: false 
  }]
});

export const Organization = model<OrganizationInterface>('Organization', OrganizationSchema);
