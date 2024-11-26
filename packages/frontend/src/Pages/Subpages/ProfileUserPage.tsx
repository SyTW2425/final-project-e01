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

const UserProfile: React.FC = () => {
  // Obtener información del usuario desde el estado global
  interface User {
    email: string;
    username: string;
    img_path: string;
    organizations?: string[];
    projects?: string[];
  }

  const user = useSelector((state: RootState) => state.session.userObject) as User;
  const [imageSRC, setImageSRC] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false); 
  const [updatedUser, setUpdatedUser] = useState<User>({
    email: user.email,
    username: user.username,
    img_path: user.img_path,
  });
  const [profilePicUpdate, setProfilePicUpdate] = useState<File | null>(null);
  const navigate = useNavigate();

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
    setShowModal(true); // Mostrar modal
  };

  const handleModalClose = () => {
    setShowModal(false); // Ocultar modal
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUpdatedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  

  const handleUpdateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('username', updatedUser.username);
    if (profilePicUpdate) formData.append('profilePicUpdate', profilePicUpdate);

    try {
      const response = await fetch(BACKEND_UPDATE_USER_URL, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: formData, // Usar FormData aquí para enviar la imagen
      });
  
      if (response.ok) {
        const data = await response.json();
        setUpdatedUser({
          ...updatedUser,
          img_path: data.img_path || updatedUser.img_path, // Actualiza la imagen si se cambió
        });
        setImageSRC(data.img_path); // Actualizar la imagen visualmente
        setShowModal(false); // Cerrar el modal
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user', error);
    }
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
        <div className="w-1/3 bg-white p-8 shadow-lg">
          <div className="text-center mb-8">
            <img
              src={imageSRC}
              alt="Profile"
              className="w-48 h-48 rounded-full mx-auto border-8 border-blue-600 shadow-lg"
            />
            <h2 className="text-2xl font-bold text-gray-700">{updatedUser.username}</h2>
            <p className="text-sm text-gray-500">{updatedUser.email}</p>
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

        <div className="w-2/3 flex flex-col space-y-8 p-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Organizaciones</h3>
            <ul className="space-y-3">
              {user.organizations?.map((organization: any, index: number) => (
                <li
                  key={index}
                  className="bg-gray-100 p-4 rounded-lg shadow-sm hover:bg-gray-200 transition"
                >
                  {typeof organization === 'string' ? organization : organization.name}
                </li>
              ))}
              {user.organizations?.length === 0 && (
                <p className="text-gray-500">No perteneces a ninguna organización.</p>
              )}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Proyectos</h3>
            <ul className="space-y-3">
              {user.projects?.map((project: any, index: number) => (
                <li
                  key={index}
                  className="bg-gray-100 p-4 rounded-lg shadow-sm hover:bg-gray-200 transition"
                >
                  {typeof project === 'string' ? project : project.name}
                </li>
              ))}
              {user.projects?.length === 0 && (
                <p className="text-gray-500">No tienes proyectos asignados.</p>
              )}
            </ul>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Actualizar Perfil</h2>
            <form onSubmit={handleUpdateUser}>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Nombre de Usuario</label>
                <input
                  type="text"
                  name="username"
                  value={updatedUser.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="profilePicUpdate" className="block text-gray-700 text-sm font-bold mb-2">Imagen de Perfil</label>
                <input
                  type="file"
                  id="profilePicUpdate"
                  name="profilePicUpdate"
                  accept='image/*'
                  onChange={e => setProfilePicUpdate(e.target.files ? e.target.files[0] : null)}
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
