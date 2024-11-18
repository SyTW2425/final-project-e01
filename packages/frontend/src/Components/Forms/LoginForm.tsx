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

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const validateInputs = () => {
    if (!email.trim()) return 'Email is required.';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Invalid email format.';
    if (!password.trim()) return 'Password is required.';
    return null;
  };

  const handleLogin = async (email: string, password: string, dispatch: AppDispatch) => {
    try {
      const response = await fetch(BACKEND_LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to login');
      }

      const data = await response.json();
      localStorage.setItem(LOCAL_STORAGE_NAME, data.result.token);
      dispatch(setSession({ token: data.result.token, userInfo: data.result.userInfo }));
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      setErrorMessage(error.message);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const validationError = validateInputs();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      await handleLogin(email, password, dispatch);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-700">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg"
      >
        <div className="text-center mb-6">
          <Link to="/">
            <img
              src="blank_logo.png"
              className="h-16 mx-auto cursor-pointer hover:scale-105 transition-transform duration-200"
              alt="logo"
            />
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Login</h2>

        {errorMessage && (
          <div className="bg-red-300 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {errorMessage}
          </div>
        )}

        <label
          htmlFor="email"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your email"
        />

        <label
          htmlFor="password"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Password:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your password"
        />

        <p className="mb-4 text-center text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-blue-500 hover:text-blue-700 font-medium"
          >
            Register
          </Link>
        </p>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
