/**
 * Proyecto Final: Aplicación gestora de proyectos
 * Asignatura: Sistemas y Tecnologías Web
 * Grado en Ingeniería Informática
 * Universidad de La Laguna
 *
 * @author Pablo Rodríguez de la Rosa
 * @author Javier Almenara Herrera
 * @author Omar Suárez Doro
 * @version 1.1
 * @date 28/10/2024
 * @brief Página de información del perfil de usuario con layout lateral.
 */

import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../../Components/NavBars/NavBarGeneral';

const UserProfile: React.FC = () => {
  // Obtener información del usuario desde el estado global
  const user = useSelector((state: any) => state.session.userObject);
  const [imageSRC, setImageSRC] = useState<string>('');

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.'
    );
    if (confirmDelete) {
      console.log('Usuario eliminado');
      //navigate('/');
    }
  };

  const handleUpdate = () => {
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
    <>
    <Navbar onToggleSidebar={() => {}} />
    <div className="flex min-h-screen bg-gray-100">
      {/* Lado izquierdo: Información del perfil */}
      <div className="w-1/3 bg-white p-8 shadow-lg">
        <div className="text-center mb-8">
          <img
            src={imageSRC}
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

      {/* Lado derecho: Organizaciones y proyectos */}
      <div className="w-2/3 flex flex-col space-y-8 p-8">
        {/* Organizaciones */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-gray-700 mb-4">Organizaciones</h3>
          <ul className="space-y-3">
            {/* Renderiza las organizaciones dinámicamente */}
            {user.organizations?.map((org: string, index: number) => (
              <li
                key={index}
                className="bg-gray-100 p-4 rounded-lg shadow-sm hover:bg-gray-200 transition"
              >
                {org}
              </li>
            ))}
          </ul>
        </div>

        {/* Proyectos */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-gray-700 mb-4">Proyectos</h3>
          <ul className="space-y-3">
            {/* Renderiza los proyectos dinámicamente */}
            {user.projects?.map((project: string, index: number) => (
              <li
                key={index}
                className="bg-gray-100 p-4 rounded-lg shadow-sm hover:bg-gray-200 transition"
              >
                {project}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    </>
  );
};

export default UserProfile;
