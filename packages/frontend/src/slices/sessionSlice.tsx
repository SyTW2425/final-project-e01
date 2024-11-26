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
  userObject: object | null;
  projects: object[] | null;
  organizations : object | null;
  currentProject: object | null;
}

const initialState: SessionState = {
  token: '',
  userObject: null,
  projects: null,
  currentProject: null,
  organizations: null
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<SessionState>) => {
      state.token = action.payload.token;
      state.projects = action.payload.projects;
      state.userObject = action.payload.userObject;
      state.organizations = action.payload.organizations;
      state.currentProject = action.payload.currentProject;
    },
  },
});

export const { setSession } = sessionSlice.actions;
export default sessionSlice.reducer;