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
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../../store/store';
import { useDispatch } from 'react-redux';
import Navbar from '../../Components/NavBars/NavBarGeneral';


const BACKEND_DELETE_USER_URL = import.meta.env.VITE_BACKEND_URL + '/user/delete';
const BACKEND_UPDATE_USER_URL = import.meta.env.VITE_BACKEND_URL + '/user/update';
const BACKEND_PROJECTS_USER_URL = import.meta.env.VITE_BACKEND_URL + '/project/searchprojects';
const BACKEND_MEMBER_URL = import.meta.env.VITE_BACKEND_URL + '/organization/member';
const BACKEND_ORGANIZATIONS_USER_URL = import.meta.env.VITE_BACKEND_URL + '/organization/searchorganizations/user';



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
  const user_searched = useParams<{ username : string }>();
  const user : any = useSelector((state: RootState) => state.session.userObject);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModalAddOrg, setShowModalAddOrg] = useState<boolean>(false);
  const [showModalRemoveUser, setShowModalRemoveUser] = useState<boolean>(false);
  const [searchedUser, setSearchedUser] = useState<any>(null);
  const [username, setUsername] = useState<string>('');
  const [imageSRC, setImageSRC] = useState<string>('');
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loggedOrganizations, setLoggedOrganizations] = useState<any[]>([]);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const dispatch = useDispatch();

  const navigate = useNavigate();
  
  const isLoggedUser = user_searched.username === user?.username;
  const fetchUser = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/user/search/' + user_searched.username, {
        method: 'GET',
        headers: {
          Authorization: `${localStorage.getItem('token') || ''}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSearchedUser(data.result);
      } else {
        console.error('Error al obtener el usuario:', response.statusText);
      }
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
    }
  }

  const fetchOrganizations = async () => {
    try {
      const URL = isLoggedUser ? BACKEND_ORGANIZATIONS_USER_URL + `/${user?.username}` : BACKEND_ORGANIZATIONS_USER_URL + `/${user_searched.username}`;
      const response = await fetch(URL, {
        method: 'GET',
        headers: {
          Authorization: `${localStorage.getItem('token') || ''}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOrganizations(data.result);
      } else {
        console.error('Error al obtener organizaciones');
      }
    } catch (error) {
      console.error('Error al obtener organizaciones:', error);
    }
  };
  
  const fetchProjects = async () => {
    try {
      const URL = isLoggedUser ? BACKEND_PROJECTS_USER_URL + `/${user?.username}` : BACKEND_PROJECTS_USER_URL + `/${user_searched.username}`;
      const response = await fetch(URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token') || '',
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data.result);
      } 
    } catch (error) {
      console.error('Error al obtener los proyectos del usuario:', error);
    }
  };
  
  const fetchOrganizationsForLoggedUser = async () => {
    try {
      const response = await fetch(BACKEND_ORGANIZATIONS_USER_URL + `/${user?.username}`, {
        method: 'GET',
        headers: {
          Authorization: `${localStorage.getItem('token') || ''}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setLoggedOrganizations(data.result);
      } else {
        console.error('Error al obtener organizaciones del usuario logueado');
      }
    } catch (error) {
      console.error('Error al obtener organizaciones del usuario logueado:', error);
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
      console.log(user.img_path)
      const updatedUser = await handleUpdateUser(username, user.email, profilePic);
      setImageSRC(`${import.meta.env.VITE_BACKEND_URL}/userImg/${updatedUser.result.result.img_path}`);
      setUsername(updatedUser.result.result.username);
      setShowModal(false);

    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
    }
    setShowModal(false);
  };

  const handleAddToOrganization = async (organizationId: string, memberId:string) => {
    try {
      const response = await fetch(BACKEND_MEMBER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          organization: organizationId,
          member: memberId,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al añadir miembro a la organización');
      }
  
      const data = await response.json();
      setShowModalAddOrg(false);
      return data;
    } catch (error) {
      console.error('Error al añadir miembro a la organización:', error);
      throw error;
    }
  };

  const handleAddtoOrg = () => {
    fetchOrganizationsForLoggedUser();
    setShowModalAddOrg(true);
  }

  const handleRemoveToOrg = () => {
    fetchOrganizationsForLoggedUser();
    setShowModalRemoveUser(true);
  }


  const handleRemoveFromOrganization = async (organizationId: string, memberId: string) => {
    try {
      const response = await fetch(BACKEND_MEMBER_URL, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          id: organizationId,
          member: memberId,
        }),
      })
      if (response.ok) {
        const data = await response.json();
        alert('Usuario eliminado de la organización con éxito.');
        setShowModalRemoveUser(false);
        return data;
      } else {
        throw new Error('Error al eliminar usuario de la organización');
      }
    } catch (error) {
    alert('Hubo un problema al eliminar al usuario de la organización.');
    }
  };

  const handleSubmitRemoveOrg = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedOrg) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/organization/searchorganizations/name/${selectedOrg}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${localStorage.getItem('token') || ''}`,
            },
          }
        );
  
        if (!response.ok) {
          throw new Error('Error al buscar la organización');
        }
  
        const org = await response.json();
        await handleRemoveFromOrganization(org.result._id, searchedUser?._id);
        alert('Usuario eliminado de la organización con éxito.');
      } catch (error) {
        console.error('Error al eliminar de la organización:', error);
        alert('Hubo un problema al eliminar de la organización.');
      }
    } else {
      alert('Por favor, selecciona una organización');
    }
  }
 

  const handleSubmitAddOrg = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    if (selectedOrg) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/organization/searchorganizations/name/${selectedOrg}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${localStorage.getItem('token') || ''}`,
            },
          }
        );
  
        if (!response.ok) {
          throw new Error('Error al buscar la organización');
        }
  
        const org = await response.json();
        await handleAddToOrganization(org.result._id, searchedUser?._id);
        alert('Usuario añadido a la organización con éxito.');
      } catch (error) {
        console.log(error)
        console.error('Error al añadir a la organización:', error);
        alert('Hubo un problema al añadir a la organización.');
      }
    } else {
      alert('Por favor, selecciona una organización');
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
    fetchProjects();
    fetchUser();
    fetchOrganizations();
  }, [user, imageSRC]);

  useEffect(() => {
    fetchOrganizations();
    fetchProjects();
    fetchUser();
 }, [user, imageSRC]);


  return (
    <>
      <Navbar onToggleSidebar={() => {}} />
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        {/* Sección del perfil del usuario */}
        <div className="w-full md:w-1/3 bg-white p-6 md:p-8 shadow-lg">
          <div className="text-center mb-8">
            <img
              src={isLoggedUser ? imageSRC : `${import.meta.env.VITE_BACKEND_URL}/userImg/${searchedUser?.img_path}`}
              alt="Profile"
              className="w-32 h-32 md:w-48 md:h-48 rounded-full mx-auto border-4 md:border-8 border-blue-600 shadow-lg"
            />
            <h2 className="text-xl md:text-2xl font-bold text-gray-700">{isLoggedUser ? user.username : searchedUser?.username}</h2>
            <p className="text-sm text-gray-500">{isLoggedUser ? user.email : searchedUser?.email}</p>
          </div>
          { !isLoggedUser && (
          <div className="mt-6 md:mt-8 space-y-4">
            <button
              onClick={handleAddtoOrg}
              className="w-full bg-blue-500 text-white font-bold py-2 md:py-3 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Añadir a Organización
            </button>
            <button
              onClick={handleRemoveToOrg}
              className="w-full bg-red-500 text-white font-bold py-2 md:py-3 rounded-lg hover:bg-red-700 transition duration-200"
            >
              Eliminar de Organización
            </button>
          </div>
          )}
          { isLoggedUser && (
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
          )}
        </div>
  
        {/* Sección de organizaciones y proyectos */}
        <div className="w-full md:w-2/3 flex flex-col space-y-6 p-4 md:p-8">
          {/* Organizaciones */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
            <h3 className="text-lg md:text-xl font-bold text-gray-700 mb-4">Organizaciones</h3>
            <ul className="space-y-3">
            {organizations.map((organization: any, index: number) => (
                <li
                  key={organization._id || index}
                  className="bg-gray-100 p-3 md:p-4 rounded-lg shadow-sm hover:bg-gray-200 transition"
                >
                  {organization.name || "Organización sin nombre"}
                </li>
              )
            )}
            {organizations.length === 0 && (
              <p className="text-gray-500">No pertenece a ninguna organización.</p>
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
                <p className="text-gray-500">No tiene proyectos asignados.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
              
      {/* Modal para añadir a organización */}
      {showModalAddOrg && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-700">Añadir a Organización</h2>
            <form onSubmit={handleSubmitAddOrg}>
              <div className="mb-4">
                <label htmlFor="organization" className="block text-gray-700 font-bold mb-2">Selecciona una Organización</label>
                <select
                  name="organization"
                  id="organization"
                  value={selectedOrg}
                  onChange={(e) => { setSelectedOrg(e.target.value);
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona una organización</option>
                  {loggedOrganizations && loggedOrganizations.length > 0 ? (
                    loggedOrganizations.map((organization: any) => (
                      <option key={organization._id} value={organization._id}>
                        {organization.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No tienes organizaciones disponibles</option>
                  )}
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModalAddOrg(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Añadir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showModalRemoveUser && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-700">Eliminar Usuario de la Organización</h2>
            <form onSubmit={handleSubmitRemoveOrg}>
            <p className="mb-6 text-red-600">
              ¿Estás seguro de que deseas eliminar al usuario de la organización? Esta acción no se puede deshacer.
            </p>
              <div className="mb-4">
                <label htmlFor="organization" className="block text-gray-700 font-bold mb-2">Selecciona una Organización</label>
                <select
                  name="organization"
                  id="organization"
                  value={selectedOrg}
                  onChange={(e) => { setSelectedOrg(e.target.value);
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona una organización</option>
                  {loggedOrganizations && loggedOrganizations.length > 0 ? (
                    loggedOrganizations.map((organization: any) => (
                      <option key={organization._id} value={organization._id}>
                        {organization.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No tienes organizaciones disponibles</option>
                  )}
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModalRemoveUser(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Eliminar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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


