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

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';
import Navbar from '../../Components/NavBars/NavBarGeneral';

const BACKEND_DELETE_USER_URL = import.meta.env.VITE_BACKEND_URL + '/user/delete';
const BACKEND_UPDATE_USER_URL = import.meta.env.VITE_BACKEND_URL + '/user/update';
const BACKEND_PROJECTS_USER_URL = import.meta.env.VITE_BACKEND_URL + '/project/user';



const handleUpdateUser = async (username: string, email: string, profilePic: File | null)  => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('email',  email);
  if (profilePic) {
    formData.append('profilePic', profilePic);
  }

  const response = await fetch(BACKEND_UPDATE_USER_URL, {
    method: 'PATCH',
    headers: {
      Authorization: `${localStorage.getItem('token') || ''}`,
    },
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Error al actualizar el usuario');
  }
  const data = await response.json();
  return data;
}

const UserProfile: React.FC = () => {

  const user : any = useSelector((state: RootState) => state.session.userObject);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [imageSRC, setImageSRC] = useState<string>('');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [projects, setProjects] = useState<any[]>([]);

  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const response = await fetch(BACKEND_PROJECTS_USER_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token') || '',
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setProjects(data.result);
      } 
    } catch (error) {
      console.error('Error al obtener los proyectos del usuario:', error);
    }
  };
  



  const handleDelete = () => {
    const confirmDelete = window.confirm(
      '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.'
    );
    if (confirmDelete) {
      fetch(BACKEND_DELETE_USER_URL, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token') || '',
        },
        body: JSON.stringify({ email: user?.email }),
      })
        .then((res) => {
          if (res.ok) {
            localStorage.removeItem('token');
            navigate('/login');
          } else {
            console.error('Failed to delete user');
          }
        })
        .catch((err) => console.error(err));
    }
  };

  const handleUpdate = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {

      const updatedUser = await handleUpdateUser(username, user.email, profilePic);
      setImageSRC(`${import.meta.env.VITE_BACKEND_URL}/userImg/${updatedUser.img_path}`);
      setUsername(updatedUser.username);

      setShowModal(false);

    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
    }
    setShowModal(false);
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
    fetchProjects();
  }, [user, imageSRC]);
  
  return (
    <>
      <Navbar onToggleSidebar={() => {}} />
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        {/* Sección del perfil del usuario */}
        <div className="w-full md:w-1/3 bg-white p-6 md:p-8 shadow-lg">
          <div className="text-center mb-8">
            <img
              src={imageSRC}
              alt="Profile"
              className="w-32 h-32 md:w-48 md:h-48 rounded-full mx-auto border-4 md:border-8 border-blue-600 shadow-lg"
            />
            <h2 className="text-xl md:text-2xl font-bold text-gray-700">{user && user.username}</h2>
            <p className="text-sm text-gray-500">{user && user.email}</p>
          </div>
          <div className="mt-6 md:mt-8 space-y-4">
            <button
              onClick={handleUpdate}
              className="w-full bg-blue-500 text-white font-bold py-2 md:py-3 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Actualizar Perfil
            </button>
            <button
              onClick={handleDelete}
              className="w-full bg-red-500 text-white font-bold py-2 md:py-3 rounded-lg hover:bg-red-600 transition duration-200"
            >
              Eliminar Cuenta
            </button>
          </div>
        </div>
  
        {/* Sección de organizaciones y proyectos */}
        <div className="w-full md:w-2/3 flex flex-col space-y-6 p-4 md:p-8">
          {/* Organizaciones */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
            <h3 className="text-lg md:text-xl font-bold text-gray-700 mb-4">Organizaciones</h3>
            <ul className="space-y-3">
              {user && user.organizations?.map((organization: any, index: number) => (
                <li
                  key={index}
                  className="bg-gray-100 p-3 md:p-4 rounded-lg shadow-sm hover:bg-gray-200 transition"
                >
                  {typeof organization === 'string' ? organization : organization.name}
                </li>
              ))}
              {user && user.organizations?.length === 0 && (
                <p className="text-gray-500">No perteneces a ninguna organización.</p>
              )}
            </ul>
          </div>
  
          {/* Proyectos */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
            <h3 className="text-lg md:text-xl font-bold text-gray-700 mb-4">Proyectos</h3>
            <ul className="space-y-3">
              {projects.map((project: any, index: number) => (
                <li
                  key={project._id || index}
                  className="bg-gray-100 p-3 md:p-4 rounded-lg shadow-sm hover:bg-gray-200 transition"
                >
                  {project.name || "Proyecto sin nombre"}
                </li>
              ))}
              {projects.length === 0 && (
                <p className="text-gray-500">No tienes proyectos asignados.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
  
      {/* Modal para actualizar perfil */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-700">Actualizar Perfil</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Nombre de Usuario</label>
                <input
                  type="text"
                  name="username"
                  value={username || ''}
                  placeholder={username || ''}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="profilePic" className="block text-gray-700 font-bold mb-2">Imagen de Perfil</label>
                <input
                  type="file"
                  id="profilePic"
                  name="profilePic"
                  accept="image/*"
                  onChange={e => setProfilePic(e.target.files ? e.target.files[0] : null)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};  

export default UserProfile;


