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

interface UserState {
  name: string;
  age: number;
}

const initialState: UserState = {
  name: '',
  age: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setAge: (state, action: PayloadAction<number>) => {
      state.age = action.payload;
    },
  },
});

export const { setName, setAge } = userSlice.actions;

export default userSlice.reducer;
