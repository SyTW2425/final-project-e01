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

import storage from 'redux-persist/lib/storage';
import sessionSlice from '../slices/sessionSlice';
import projectSlice from '../slices/projectSlice';
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

const projectPersistConfig = { 
  key: 'project',
  storage,
  middleware: (getDefaultMiddleware : any) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
};     


const persistedProjectReducer = persistReducer(projectPersistConfig, projectSlice);

const store = configureStore({
  reducer: {
    session: sessionSlice, 
    project: persistedProjectReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const persistor = persistStore(store);
export default store;
