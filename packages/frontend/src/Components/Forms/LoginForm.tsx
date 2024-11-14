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
 * @brief Componente de formulario de inicio de sesión
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setSession } from '../../slices/sessionSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';


export const LOCAL_STORAGE_NAME = 'token';
const BACKEND_LOGIN_URL = 'http://localhost:3000/user/login';




/**
 * LoginForm Component
 * @returns JSX.Element
 */
const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  /**
   * Function to handle login
   * @param email 
   * @param password 
   * @param dispatch
   */
  const handleLogin = async (email: string, password: string, dispatch: AppDispatch) => {
    const response = await fetch(BACKEND_LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (response.status < 200 || response.status >= 400) throw new Error('Failed to login');

    const data = await response.json();
    localStorage.setItem(LOCAL_STORAGE_NAME, data.result.token);

    // We need to "Update" the state of the redux
    // we use setSession reducer in this case, and the parameters
    // must be the same shape of the initial state
    dispatch(setSession({ token: data.result.token, userInfo: data.result.userInfo }));
    navigate('/dashboard', { replace: true });
  };

  const dispatch = useDispatch();
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await handleLogin(email, password, dispatch);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-4">
         <Link to="/" className="text-blue-500 hover:text-blue-700">
            <img 
              src="blank_logo.png"
              className="inline-block size-20 mr-2 cursor-pointer hover:-translate-y-0.5 transition duration-200 hover:box-shadow hover:rounded-full hover:bg-gray-500"
              alt="go-home" 
            />
        </Link>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Login</h2>
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-3 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email"
        />

        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-3 py-2 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your password"
        />
        <p className="mb-4 text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:text-blue-700">Register</Link>
        </p>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Login
        </button> 
      </form>
    </div>
  );
};

export default LoginForm;