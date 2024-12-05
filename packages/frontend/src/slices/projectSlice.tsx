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
 * @brief projectSlice de Redux.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProjectInterface {
  idPersistedProject: any | null;
}

const initialState : ProjectInterface = {
  idPersistedProject: null,
};

const persistedProjectSlice = createSlice({
  name: 'persistedProject',
  initialState,
  reducers: {
    setPersistedProject: (state, action: PayloadAction<any>) => {
      state.idPersistedProject = action.payload;
    },
  }
});
export const  { setPersistedProject } = persistedProjectSlice.actions;
export default persistedProjectSlice.reducer;