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
 * @brief Componente de formulario de creación de cuenta
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setSession } from '../../slices/sessionSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';

const BACKEND_REGISTER_URL = 'http://localhost:3000/user/register';

export const LOCAL_STORAGE_NAME = 'token';
const BACKEND_LOGIN_URL = 'http://localhost:3000/user/login';

const handleRegister = async (
  email: string,
  username: string,
  password: string,
  //@ts-ignore
  passwordConfirmation: string,
  profilePic: File | null, 
  dispatch: AppDispatch,
  navigate: any
) => {

  // Crear un FormData para enviar los datos y el archivo
  const formData = new FormData();
  formData.append('email', email);
  formData.append('username', username);
  formData.append('password', password);

  if (profilePic) {
    formData.append('profilePic', profilePic); // Añadir el archivo si está presente
  }

  // Enviar el formulario al backend
  const response_register = await fetch(BACKEND_REGISTER_URL, {
    method: 'POST',
    body: formData, // Cambiar a formData
  });
  if (response_register.ok) {
    const response_login = await fetch(BACKEND_LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (response_login.ok) {
      const data = await response_login.json();
      localStorage.setItem(LOCAL_STORAGE_NAME, data.result.token);
      dispatch(setSession({ token: data.token, userInfo: data.userInfo }));
      navigate('/dashboard', { replace: true });
    } else {
      console.error('Failed to login');
    }
  }
}


/**
 * RegisterForm Component
 * @returns JSX.Element
 */
const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateInputs = () => {
    if (!email.trim()) return 'Email is required.';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Invalid email format.';
    if (!username.trim()) return 'Username is required.';
    if (!password.trim()) return 'Password is required.';
    if (password.length < 8) return 'Password must be at least 8 characters long.';
    if (!passwordConfirmation.trim()) return 'Password confirmation is required.';
    return null;
  }

  const handleSubmit = ( e: React.FormEvent<HTMLFormElement>) =>  {
    e.preventDefault();
    setErrorMessage(null);

    const validationError = validateInputs();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    handleRegister(email, username, password, passwordConfirmation, profilePic, dispatch, navigate);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-700">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-4">
          <img src="blank_logo.png" 
          className="inline-block size-20 mr-2 cursor-pointer hover:-translate-y-0.5 transition duration-200 hover:box-shadow hover:rounded-full hover:bg-gray-500"
          alt="go-home" 
          onClick={() => {window.location.href = '/'} }/>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Register</h2>

        {errorMessage && <p className="bg-red-300 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{errorMessage}</p>}
        {/* Need to introduce username */}
        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full px-3 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your username"
        />
    
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
          className="w-full px-3 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your password"
        />
        
        <label htmlFor="passwordConfirmation" className="block text-gray-700 text-sm font-bold mb-2">Confirm Password:</label>
        <input
          type="password"
          id="passwordConfirmation"
          name="passwordConfirmation"
          value={passwordConfirmation}
          onChange={e => setPasswordConfirmation(e.target.value)}
          className="w-full px-3 py-2 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Confirm your password"
        />

        <label htmlFor="profilePic" className="block text-gray-700 text-sm font-bold mb-2">Profile Picture:</label>
        <input
          type="file"
          id="profilePic"
          name="profilePic"
          accept="image/*"
          onChange={e => setProfilePic(e.target.files ? e.target.files[0] : null)}
          className="w-full px-3 py-2 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="mb-4 text-center">
          Do you have an account already? {' '}
          <Link to="/login" className="text-blue-500 hover:text-blue-700">Log In</Link>
        </p>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;