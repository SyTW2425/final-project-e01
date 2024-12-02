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
 * @brief sectionSlice de Redux.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { update } from 'lodash';

interface SessionState {
  token: string;
  userObject: any | null;
  projects: any[] | null;
  currentProject: any | null;
}

const initialState: SessionState = {
  token: '',
  userObject: null,
  projects: null,
  currentProject: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<SessionState>) => {
      state.token = action.payload.token;
      state.projects = action.payload.projects;
      state.userObject = action.payload.userObject;
      state.currentProject = action.payload.currentProject;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUserObject: (state, action: PayloadAction<object>) => {
      state.userObject = action.payload;
    },
    setProjects: (state, action: PayloadAction<any>) => {
      state.projects = action.payload;
    },
    setCurrentProject: (state, action: PayloadAction<any>) => {
      state.currentProject = action.payload;
    },
    addOrganization: (state, action: PayloadAction<any>) => {
      state.userObject.organizations.push(action.payload);
    },
    addProject: (state, action: PayloadAction<any>) => {
      if (state.projects) state.projects.push(action.payload);
    },
    addSprint: (state, action: PayloadAction<any>) => {
      if (state.currentProject) state.currentProject.sprints.push(action.payload);
      // We need to update the projects array as well
      if (state.projects) {
        const projectIndex = state.projects.findIndex((project) => project._id === state.currentProject._id);
        state.projects[projectIndex].sprints.push(action.payload);
      }
    },
    deleteSprint: (state, action: PayloadAction<any>) => {
      if (state.currentProject) {
        state.currentProject.sprints = state.currentProject.sprints.filter((sprint : any) => sprint._id !== action.payload);
      }
      // We need to update the projects array as well
      if (state.projects) {
        const projectIndex = state.projects.findIndex((project) => project._id === state.currentProject._id);
        state.projects[projectIndex].sprints = state.projects[projectIndex].sprints.filter((sprint : any) => sprint._id !== action.payload);
      }
    },
    updateSprint: (state, action: PayloadAction<any>) => {
      const { sprintIndex } = action.payload;
      delete action.payload.sprintIndex;
      if (state.currentProject) {
        state.currentProject.sprints[sprintIndex] = action.payload;
      }
      // We need to update the projects array as well
      if (state.projects) {
        const projectIndex = state.projects.findIndex((project) => project._id === state.currentProject._id);
        state.projects[projectIndex].sprints[sprintIndex] = action.payload;
      }
    },
    addTask: (state, action: PayloadAction<any>) => {
      if (state.currentProject) {
        state.currentProject.sprints[action.payload.sprintIndex].tasks.push(action.payload.task);
      }
      // We need to update the projects array as well
      if (state.projects) {
        const projectIndex = state.projects.findIndex((project) => project._id === state.currentProject._id);
        state.projects[projectIndex].sprints[action.payload.sprintIndex].tasks.push(action.payload.task);
      }
    },
    updateTask: (state, action: PayloadAction<any>) => {
      const { taskIndex, sprintIndex } = action.payload;
      delete action.payload.taskIndex;
      delete action.payload.sprintIndex;
      if (state.currentProject) {
        state.currentProject.sprints[sprintIndex].tasks[taskIndex] = action.payload.task;
      }
      // We need to update the projects array as well
      if (state.projects) {
        const projectIndex = state.projects.findIndex((project) => project._id === state.currentProject._id);
        state.projects[projectIndex].sprints[sprintIndex].tasks[taskIndex] = action.payload.task;
      }
    },
    deleteTask: (state, action: PayloadAction<any>) => {
      const { taskIndex, sprintIndex } = action.payload;
      if (state.currentProject) {
        state.currentProject.sprints[sprintIndex].tasks = state.currentProject.sprints[sprintIndex].tasks.filter((task : any, index : number) => index !== taskIndex);
      }
      // We need to update the projects array as well
      if (state.projects) {
        const projectIndex = state.projects.findIndex((project) => project._id === state.currentProject._id);
        state.projects[projectIndex].sprints[sprintIndex].tasks = state.projects[projectIndex].sprints[sprintIndex].tasks.filter((task : any, index : number) => index !== taskIndex);
      }
    }


  },
});

export const { 
  setSession,
  setToken,
  setUserObject,
  setCurrentProject,
  setProjects,
  addOrganization,
  addProject,
  addSprint,
  deleteSprint,
  updateSprint,
  addTask,
  updateTask,
  deleteTask

 } = sessionSlice.actions;
export default sessionSlice.reducer;