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
import { setSession } from './slices/sessionSlice';

// Routing
import { Route, Routes, useNavigate } from 'react-router-dom';

// Import Pages
import HomePage from './Pages/Home';
import LoginPage from './Pages/Login';
import RegisterPage from './Pages/Register';
import DashboardPage from './Pages/Dashboard';
import ProfileUserPage from './Pages/Subpages/ProfileUserPage';


// We need a custom hook in order to validate the session
// in the case that user refreshes the page
const useSessionValidation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let userObject : any = useSelector((state: RootState) => state.session.userObject);
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
            dispatch(setSession({ token: localStorage.getItem('token') || '', userObject: data.result, projects: null, organizations: null, currentProject: null }));
            userObject = data.result;
            fetch(import.meta.env.VITE_BACKEND_URL + '/project/user', {
              method: 'GET',
              headers: {
                authorization: localStorage.getItem('token') || '',
              },
            })
              .then((res) => res.json()).then((data) => {
                if (!data.error) {
                  dispatch(setSession({ token: localStorage.getItem('token') || '', userObject: userObject, projects: data.result, organizations:null, currentProject: data.result[0] }));
                }
              })
              .catch((_) => {
                const page = window.location.href.split('/').pop();
                if (page?.length !== 0 && page !== 'register') navigate('/login', { replace: true });
              });
          } 

        })
        .catch((_) => {
          const page = window.location.href.split('/').pop();
          if (page?.length !== 0 && page !== 'register' && page !== 'login') navigate('/login', { replace: true });
        });
    } else if (!localStorage.getItem('token') && !userObject) {
      const page = window.location.href.split('/').pop();
      if (page?.length !== 0 && page !== 'register' && page !== 'login') navigate('/login', { replace: true });
    }
  }, [dispatch, userObject]);
};

const App: React.FC = () => {
  useSessionValidation();
  return (
    <Routes>
      <Route path="/" Component={HomePage} />
      <Route path="/login" Component={LoginPage} />
      <Route path="/register" Component={RegisterPage} />
      <Route path="/dashboard/*" Component={DashboardPage} />
      <Route path="/dashboard/profile" Component={ProfileUserPage} />
      <Route path="*" Component={HomePage} />
    </Routes>
  );
};

export default App;