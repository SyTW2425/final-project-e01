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
 * @brief Componente principal de la aplicación.
 */

import './App.css';
import { useEffect } from 'react';

// Setting up Redux
import { RootState } from './store/store';
import { useDispatch, useSelector } from 'react-redux';
import { setSession, setCurrentProject, setProjects, setUserObject } from './slices/sessionSlice';
import { setPersistedProject } from './slices/projectSlice';

// Routing
import { Route, Routes, useNavigate } from 'react-router-dom';

// Import Pages
import HomePage from './Pages/Home';
import LoginPage from './Pages/Login';
import DashboardPage from './Pages/Dashboard';
import ProfileUserPage from './Pages/Subpages/ProfileUserPage';

import 'react-toastify/dist/ReactToastify.css';

// We need a custom hook in order to validate the session
// in the case that user refreshes the page
const useSessionValidation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionState = useSelector((state: RootState) => state.session);
  const persistedProject = useSelector((state: RootState) => state.project.idPersistedProject);

  let userObject : any = sessionState.userObject;

  useEffect(() => {
    if (localStorage.getItem('token') && !userObject) {
      fetch(import.meta.env.VITE_BACKEND_URL + '/user/validate', {
        method: 'GET',
        headers: {
          authorization: localStorage.getItem('token') || '',
        },
      })
        .then((res) => res.json()).then((data) => {
          if (!data.error) {
            dispatch(setSession({ token: localStorage.getItem('token') || '', userObject: data.result, projects: null, currentProject: null }));
            dispatch(setUserObject(data.result));
          } 

          fetch(import.meta.env.VITE_BACKEND_URL + '/project/user', {
            method: 'GET',
            headers: { authorization: localStorage.getItem('token') || '' },
          })
          .then((res) => res.json())
          .then((data) => {
            if (!data.error) {
              dispatch(setProjects(data.result));
              let queryId = persistedProject ?? data.result[0]._id;

              fetch(`${import.meta.env.VITE_BACKEND_URL}/project/id/${queryId}`, {
                method: 'GET',
                headers: { authorization: localStorage.getItem('token') || '' },
              })
              .then((res) => res.json())
              .then((data) => {
                dispatch(setCurrentProject(data.result));
                dispatch(setPersistedProject(data.result._id));
              })
              .catch((error) => {
                console.error('Error fetching current project:', error);
              });
            } 
          })
          .catch((error) => {
            console.error('Error fetching projects:', error);
          })
        })
        .catch((_) => {
          const page = window.location.href.split('/').pop();
          if (page?.length !== 0 && page !== 'register' && page !== 'login') navigate('/login', { replace: true });
        });
    } else if (!localStorage.getItem('token') && !userObject) {
      const page = window.location.href.split('/').pop();
      if (page?.length !== 0 && page !== 'register' && page !== 'login') navigate('/login', { replace: true });
    }
  }, [dispatch, sessionState]);
};

const App: React.FC = () => {
  useSessionValidation();
  return (
    <>
    <Routes>
      <Route path="/" Component={HomePage} />
      <Route path="/login" Component={LoginPage} />
      <Route path="/dashboard/*" Component={DashboardPage} />
      <Route path="/dashboard/profile/:username" element={<ProfileUserPage />} />
      <Route path="*" Component={HomePage} />
    </Routes>
    </>
  );
};

export default App;