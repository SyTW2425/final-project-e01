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
 * @brief Configuración del store de Redux.
 */

import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
  // We need to add slices here so that they can be used in our components

  },
});

// We need to export the root state and dispatch types, so that we can use them in our components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
