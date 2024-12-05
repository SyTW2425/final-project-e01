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
import { setSession } from '../../slices/sessionSlice';
import { errorNotification, infoNotification, successNotification } from '../../Components/Information/Notification';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


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
  const [showModalAddProject, setShowModalAddProject] = useState<boolean>(false);
  const [searchedUser, setSearchedUser] = useState<any>(null);
  const [username, setUsername] = useState<string>('');
  const [imageSRC, setImageSRC] = useState<string>('');
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loggedOrganizations, setLoggedOrganizations] = useState<any[]>([]);
  const [loggedProjects, setLoggedProjects] = useState<any[]>([]);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');
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
        errorNotification('Failed to get organizations');
      }
    } catch (error) {
      errorNotification('Failed to get organizations: ' + error);
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
      errorNotification('Failed to get projects: ' + error);
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

  const fetchProjectsForLoggedUser = async () => {
    try {
      const URL = BACKEND_PROJECTS_USER_URL + `/${user?.username}`;
      const response = await fetch(URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token') || '',
        }
      });
      if (response.ok) {
        const data = await response.json();
        setLoggedProjects(data.result);
      } 
    } catch (error) {
      console.error('Error al obtener los proyectos del usuario:', error);
    }
  };


  const handleDelete = () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
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
            errorNotification('Failed to delete user');
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
      dispatch(setSession({ token: localStorage.getItem('token') || '', userObject: updatedUser.result.result, projects: null, currentProject: null }));
      setImageSRC(`${import.meta.env.VITE_BACKEND_URL}/userImg/${updatedUser.result.result.img_path}`);
      navigate('/dashboard/profile/' + updatedUser.result.result.username);
      window.location.reload();
      setUsername(updatedUser.result.result.username);
      setShowModal(false);

    } catch (error) {
      errorNotification('Failed to update profile: ' + error);
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
        throw new Error(errorData.message || 'Failed to add member to organization');
      }
  
      const data = await response.json();
      setShowModalAddOrg(false);
      return data;
    } catch (error) {
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

  const handleAddtoProject = () => {
    fetchProjectsForLoggedUser();
    setShowModalAddProject(true);
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
        successNotification('User removed from organization successfully');
        setShowModalRemoveUser(false);
        return data;
      } else {
        throw new Error('Error in removing user from organization');
      }
    } catch (error) {
      errorNotification('Failed to remove user from organization: ' + error);
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
        successNotification('User removed from organization successfully');
      } catch (error) {
        errorNotification('Hubo un problema al eliminar de la organización.');
      }
    } else {
      infoNotification('Please select an organization');
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
        window.location.reload();
        successNotification('User added to organization successfully');
      } catch (error) {
        console.log(error)
        errorNotification('Failed to add user to organization: ' + error);
      }
    } else {
      infoNotification('Please select an organization');
    }
  };

  const handleSubmitAddProjects = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    if (selectedProject) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/project/user`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${localStorage.getItem('token') || ''}`,
            },
            body: JSON.stringify({ project: selectedProject, user: searchedUser?._id, role: 'developer' }),
          }
        );
  
        if (!response.ok) {
          throw new Error('Error searching projects');
        }
        setShowModalAddProject(false);
        successNotification('User added to project successfully');
      } catch (error) {
        errorNotification('Failed to add user to project: ' + error);
      }
    } else {
      infoNotification('Please select a project');
    }
  }
  

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
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-200">
        {/* profile user */}
        <div className="w-full md:w-1/3 bg-white p-6 md:p-8 shadow-lg">
          <div className="text-center mb-8">
            <img
              src={isLoggedUser ? imageSRC : `${import.meta.env.VITE_BACKEND_URL}/userImg/${searchedUser?.img_path}`}
              alt="Profile"
              className="w-64 h-64 md:w-60 md:h-60 rounded-full mx-auto border-4 md:border-4 border-blue-900 shadow-lg"
            />
            <h2 className="text-xl md:text-2xl font-bold text-gray-700">{isLoggedUser ? user.username : searchedUser?.username}</h2>
            <p className="text-sm text-gray-500">{isLoggedUser ? user.email : searchedUser?.email}</p>
          </div>
          { !isLoggedUser && (
          <div className="mt-6 md:mt-8 space-y-4">
            <button
              onClick={handleAddtoOrg}
              className="w-full bg-blue-900 text-white font-bold py-2 md:py-3 rounded-lg hover:bg-blue-950 md:border-4 border-white transition duration-200"
  >
              Add to a Organization
            </button>
            <button
              onClick={handleRemoveToOrg}
              className="w-full bg-white-900 text-blue-900 font-bold py-2 md:py-3 rounded-lg hover:bg-gray-300 md:border-4 border-blue-900 transition duration-200"

            >
              Delete from Organization
            </button>
            <button
              onClick={handleAddtoProject}
              className="w-full bg-blue-900 text-white font-bold py-2 md:py-3 rounded-lg hover:bg-blue-950 md:border-4 border-white transition duration-200"
            >
              Add to a Project
            </button>
          </div>
          )}
          { isLoggedUser && (
          <div className="mt-6 md:mt-8 space-y-4">
            <button
              onClick={handleUpdate}
              className="w-full bg-blue-900 text-white font-bold py-2 md:py-3 rounded-lg hover:bg-blue-950 md:border-4 border-blue-400 transition duration-200"
            >
              Update Profile
            </button>
            <button
              onClick={handleDelete}
              className="w-full bg-white-900 text-blue-900 font-bold py-2 md:py-3 rounded-lg hover:bg-gray-300 md:border-4 border-blue-900 transition duration-200"
            >
              Delete Account
            </button>
          </div>
          )}
        </div>
        <div className="w-full md:w-2/3 flex flex-col space-y-6 p-4 md:p-8">
          <div className="bg-blue-900 p-4 md:p-6 rounded-lg md:border-2 border-blue-400 shadow-lg">
            <h3 className="text-lg md:text-xl font-bold text-white mb-4">Organizations</h3>
            <ul className="space-y-3">
            {organizations.map((organization: any, index: number) => (
                <li
                  key={organization._id || index}
                  className="bg-gray-100 p-3 md:p-4 rounded-lg md:border-2 border-blue-900 shadow-sm hover:bg-gray-200 transition"
                >
                  {organization.name || "Organización sin nombre"}
                </li>
              )
            )}
            {organizations.length === 0 && (
              <p className="text-white">Doesn't belong to a organization.</p>
            )}
          </ul>
        </div>
          <div className="bg-blue-900 p-4 md:p-6 rounded-lg md:border-2 border-blue-400 shadow-lg">
            <h3 className="text-lg md:text-xl font-bold text-white mb-4">Projects</h3>
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
                <p className="text-white">Doesn't have projects assigned</p>
              )}
            </ul>
          </div>
        </div>
      </div>
      {showModalAddOrg && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">Add to a Organization</h2>
            <form onSubmit={handleSubmitAddOrg}>
              <div className="mb-4">
                <label htmlFor="organization" className="block text-gray-800 font-bold mb-2">Select a Organization</label>
                <select
                  name="organization"
                  id="organization"
                  value={selectedOrg}
                  onChange={(e) => { setSelectedOrg(e.target.value);
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a organization</option>
                  {loggedOrganizations && loggedOrganizations.length > 0 ? (
                    loggedOrganizations.map((organization: any) => (
                      <option key={organization._id} value={organization._id}>
                        {organization.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Does not have organizations availables</option>
                  )}
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModalAddOrg(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showModalAddProject && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-700">Añadir a Proyecto</h2>
            <form onSubmit={handleSubmitAddProjects}>
              <div className="mb-4">
                <label htmlFor="organization" className="block text-gray-700 font-bold mb-2">Select a Project</label>
                <select
                  name="organization"
                  id="organization"
                  value={selectedProject}
                  onChange={(e) => { setSelectedProject(e.target.value);
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a project</option>
                  {loggedProjects && loggedProjects.length > 0 ? (
                    loggedProjects.map((projects: any) => (
                      <option key={projects._id} value={projects._id}>
                        {projects.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Does not have projects availables</option>
                  )}
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModalAddProject(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Add
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
              Are you sure you want to remove the user from the organization? This action cannot be undone.
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
                  <option value="">Select a organization</option>
                  {loggedOrganizations && loggedOrganizations.length > 0 ? (
                    loggedOrganizations.map((organization: any) => (
                      <option key={organization._id} value={organization._id}>
                        {organization.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Does not have a organizations availables</option>
                  )}
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModalRemoveUser(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Remove
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-700">Update Profile</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Username</label>
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
                <label htmlFor="profilePic" className="block text-gray-700 font-bold mb-2">Profile Image</label>
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
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"/>
    </>
  );
};  

export default UserProfile;


