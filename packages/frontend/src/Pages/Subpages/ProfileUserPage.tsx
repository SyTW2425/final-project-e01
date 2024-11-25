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
 * @brief Página de información del perfil de usuario.
 */

import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { navigate } from 'react-router-dom';


const UserProfile: React.FC = () => {
  // Obtener información del usuario desde el estado global
  const user = useSelector((state: any) => state.session.userObject);
  const [imageSRC, setImageSRC] = useState<string>('');

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.'
    );
    if (confirmDelete) {
      // Aquí llamas a tu lógica de eliminación
      console.log('Usuario eliminado');
      // Redirigir después de eliminar
      //navigate('/');
    }
  };

  const handleUpdate = () => {
    // Redirigir a la página de actualización de perfil
    //navigate('/profile/update');
  };

  useEffect(() => {
    if (!imageSRC && user) {
      fetch(import.meta.env.VITE_BACKEND_URL + '/userImg/' + user.img_path)
        .then((res) => res.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          setImageSRC(url);
        })
        .catch((err) => console.error(err));
    } 
  }, [user, imageSRC]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <img
            src={imageSRC} // Imagen del usuario o predeterminada
            alt="Profile"
            className="w-48 h-48 rounded-full mx-auto border-8 border-gray-500 shadow-lg"
          />
          <h2 className="text-2xl font-bold text-gray-700">{user.username}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <div className="mt-8 space-y-4">
          <button
            onClick={handleUpdate}
            className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Actualizar Perfil
          </button>
          <button
            onClick={handleDelete}
            className="w-full bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 transition duration-200"
          >
            Eliminar Cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
