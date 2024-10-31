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

/**
 * RegisterForm Component
 * @returns JSX.Element
 */
const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Register</h2>
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