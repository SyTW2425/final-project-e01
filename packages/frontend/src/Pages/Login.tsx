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
 * @brief Página de inicio de sesión y registro.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserObject, setToken } from '../slices/sessionSlice';
import blankLogo from '../../public/blank_logo.png';
import { successNotification } from '../Components/Information/Notification';


const LoginAndRegister: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register State
  const [registerEmail, setRegisterEmail] = useState('');
  const [username, setUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to login');
      }

      const data = await response.json();
      localStorage.setItem(import.meta.env.VITE_LOCAL_STORAGE_NAME || 'token', data.result.token);
      dispatch(setToken(data.result.token));
      dispatch(setUserObject(data.result.userObject));
      window.location.href = 'dashboard';
    } catch (error: any) {
      setLoginError(error.message);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);

    if (registerPassword !== passwordConfirmation) {
      setRegisterError('Passwords do not match');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('email', registerEmail);
      formData.append('username', username);
      formData.append('password', registerPassword);
      if (profilePic) formData.append('profilePic', profilePic);

      const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/user/register', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register');
      }
      successNotification('User registered successfully');
      window.location.href = 'dashboard';
    } catch (error: any) {
      setRegisterError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-blue-700 flex items-center justify-center">
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 transform transition-all duration-500 ease-in-out h-auto">
        {/* Home Navigation */}
        <div className="flex justify-center mb-6 relative">
          <img
            src={blankLogo}
            alt="Return to Home"
            className="h-14 w-14 cursor-pointer hover:scale-110 transition-transform duration-200"
            onClick={() => navigate('/')}
            title="Click to return to Home"
          />
          <span className="absolute -bottom-6 text-sm text-gray-500">
            Click the logo to go Home
          </span>
        </div>

        {/* Toggle Login/Register */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 text-lg font-semibold ${
              isLogin ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-500'
            } transition`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 text-lg font-semibold ${
              !isLogin ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-500'
            } transition`}
          >
            Register
          </button>
        </div>

        {/* Form Animation */}
        <div className="overflow-hidden transform transition-all duration-500 ease-in-out">
          {isLogin ? (
            <form onSubmit={handleLoginSubmit}>
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Login</h2>
              {loginError && (
                <div className="bg-red-300 text-red-700 p-2 rounded mb-4">{loginError}</div>
              )}
              <label htmlFor="loginEmail" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="loginEmail"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="loginPassword" className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="loginPassword"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
              >
                Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit}>
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Register</h2>
              {registerError && (
                <div className="bg-red-300 text-red-700 p-2 rounded mb-4">{registerError}</div>
              )}
              <label htmlFor="username" className="block text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="registerEmail" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="registerEmail"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="registerPassword" className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="registerPassword"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="passwordConfirmation" className="block text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="passwordConfirmation"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="profilePic" className="block text-gray-700 mb-2">
                Profile Picture
              </label>
              <input
                type="file"
                id="profilePic"
                onChange={(e) => setProfilePic(e.target.files ? e.target.files[0] : null)}
                className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
              >
                Register
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginAndRegister;
