import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, useState, useRef } from 'react';

import Modal from '../Information/Modal';
import SVGComponent from '../Icons/SVGComponent';
import SearchComponent from '../Search/SearchInput';
import { addOrganization, addProject } from '../../slices/sessionSlice';
import { RootState } from '../../store/store';

const searchIcon = "M21.71,20.29,18,16.61A9,9,0,1,0,16.61,18l3.68,3.68a1,1,0,0,0,1.42,0A1,1,0,0,0,21.71,20.29ZM11,18a7,7,0,1,1,7-7A7,7,0,0,1,11,18Z";

const Navbar: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [imageSRC, setImageSRC] = useState<string>('');
  const [showCreateOrgPopup, setShowCreateOrgPopup] = useState(false);
  const [showCreateProjectPopup, setShowCreateProjectPopup] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const currentUser: any = useSelector((state: RootState) => state.session.userObject);
  const dispatch = useDispatch();

  const projectNameRef = useRef<HTMLInputElement>(null);
  const projectDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const projectEndDateRef = useRef<HTMLInputElement>(null);
  const projectOrganizationRef = useRef<HTMLSelectElement>(null);

  const toggleCreate = () => setShowCreate(!showCreate);

  useEffect(() => {
    if (!imageSRC && currentUser) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/userImg/${currentUser.img_path}`)
        .then((res) => res.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          setImageSRC(url);
        })
        .catch((err) => console.error(err));
    }
  }, [currentUser, imageSRC]);

  return (
    <nav className="bg-blue-600 shadow-lg p-4  top-0 w-full z-2">
      <div className="container mx-auto flex justify-between items-center">
        {/* Sidebar Toggle y Logo */}
        <div className="flex items-center gap-4">
          { !window.location.href.includes('profile') &&
          <button
            className="text-white hover:text-gray-300 md:hidden focus:outline-none"
            onClick={onToggleSidebar}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
          }
          <Link to="/dashboard" className="flex items-center gap-2 text-white">
            <img src="/blank_logo.png" alt="Logo" className="w-10 h-10" />
            <span className="text-xl font-bold hover:text-blue-300">Velia</span>
          </Link>
        </div>

        {/* Barra de Búsqueda */}
        <div className="hidden md:block flex-1 mx-6 relative">
          <SearchComponent url={`${import.meta.env.VITE_BACKEND_URL}/user/`} />
        </div>

        {/* Botones y Notificaciones */}
        <div className="flex items-center gap-4">

          {/* Barra de Búsqueda Móvil */}
          <button
            className="text-white hover:text-gray-300 md:hidden focus:outline-none"
            onClick={() => setShowSearch(!showSearch)}
          >
            <SVGComponent className="w-6 h-6" d={searchIcon} />
          </button>

          {/* Crear Organización y Proyecto */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => setShowCreateOrgPopup(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
            >
              Create Organization
            </button>
            <button
              onClick={() => setShowCreateProjectPopup(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
            >
              Create Project
            </button>
          </div>


          {/* Imagen de Perfil */}
          <div className="relative">
            <img
              src={imageSRC}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setShowMenu(!showMenu)}
            />
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-2 z-50">
                <Link
                  to={`/dashboard/profile/${currentUser?.username}`}
                  className="block px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-blue-600"
                >
                  Profile
                </Link>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-red-600"
                  onClick={() => localStorage.removeItem('token')}
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barra de Búsqueda Móvil */}
      {showSearch && (
        <div className="mt-2 md:hidden">
          <SearchComponent url={`${import.meta.env.VITE_BACKEND_URL}/user/`} mobile={true} />
        </div>
      )}

      {/* Modal para Crear Organización */}
      {showCreateOrgPopup && (
        <Modal
          title="Crear Organización"
          onClose={() => setShowCreateOrgPopup(false)}
          onSubmit={() => {
            const name = (document.querySelector(
              '#organization-name'
            ) as HTMLInputElement).value;
            fetch(`${import.meta.env.VITE_BACKEND_URL}/organization`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                authorization: localStorage.getItem('token') || '',
              },
              body: JSON.stringify({ name, members: [] }),
            })
              .then((res) => res.json())
              .then((data) => {
                setShowCreateOrgPopup(false);
                dispatch(addOrganization(data.result));
              })
              .catch((err) => console.error(err));
          }}
        >
          <input
            id="organization-name"
            type="text"
            placeholder="Nombre de la organización"
            className="w-full border rounded px-3 py-2 mb-4"
          />
        </Modal>
      )}


      {/* Modal para Crear Proyecto */}
      {showCreateProjectPopup && (
        <Modal
          title="Crear Proyecto"
          onClose={() => setShowCreateProjectPopup(false)}
          onSubmit={() => {
            const name = projectNameRef.current?.value || '';
            const description = projectDescriptionRef.current?.value || '';
            const endDate = projectEndDateRef.current?.value || '';
            const organization = projectOrganizationRef.current?.value || '';

            if (!name || !organization) {
              alert('Please fill in all mandatory fields.');
              return;
            }

            fetch(`${import.meta.env.VITE_BACKEND_URL}/project`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                authorization: localStorage.getItem('token') || '',
              },
              body: JSON.stringify({
                name,
                description,
                startDate: Date.now(),
                endDate,
                organization,
                users: [],
                sprints: [],
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                setShowCreateProjectPopup(false);
                dispatch(addProject(data.result));
              })
              .catch((err) => console.error(err));
          }}
        >
          <input
            id="project-name"
            ref={projectNameRef}
            type="text"
            placeholder="Name of the project"
            className="w-full border rounded px-3 py-2 mb-4"
          />
          <textarea
            id="project-description"
            ref={projectDescriptionRef}
            placeholder="Description of the project"
            className="w-full border rounded px-3 py-2 mb-4"
          ></textarea>
          <input
            id="project-end-date"
            ref={projectEndDateRef}
            type="date"
            className="w-full border rounded px-3 py-2 mb-4"
          />
          <select
            id="project-organization"
            ref={projectOrganizationRef}
            className="w-full border rounded px-3 py-2 mb-4"
          >
            <option value="">Select an organization</option>
            {currentUser.organizations.map((org: any) => (
              <option key={org._id} value={org.name}>
                {org.name}
              </option>
            ))}
          </select>
        </Modal>
      )}

      {/* Botón flotante con menú desplegable */}
      <div className="fixed bottom-4 right-4 md:hidden z-40">
        <button
          onClick={toggleCreate}
          className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition"
        >
          +
        </button>
        {showCreate && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-25 z-40"
              onClick={() => setShowCreate(false)}
            ></div>

            <div
              className="absolute bottom-16 right-4 bg-white rounded-lg shadow-lg py-2 z-50"
              style={{ minWidth: "12rem" }}
            >
              <button
                onClick={() => {
                  setShowCreate(false);
                  setShowCreateOrgPopup(true);
                }}
                className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
              >
                Crear Organización
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  setShowCreateProjectPopup(true);
                }}
                className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
              >
                Crear Proyecto
              </button>
            </div>
          </>
        )}
      </div>
      
    </nav>
  );
};

export default Navbar;
