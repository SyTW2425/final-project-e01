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

  },
});

export const { 
  setSession,
  setToken,
  setUserObject,
  setCurrentProject,
  setProjects,
 } = sessionSlice.actions;
export default sessionSlice.reducer;