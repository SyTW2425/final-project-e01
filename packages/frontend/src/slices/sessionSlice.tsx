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
  userInfo: object | null;
}

const initialState: SessionState = {
  token: '',
  userInfo: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<SessionState>) => {
      state.token = action.payload.token;
      state.userInfo = action.payload.userInfo;
    },
  },
});

export const { setSession } = sessionSlice.actions;
export default sessionSlice.reducer;