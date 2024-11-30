import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import React, { useEffect, useState, useRef } from 'react';

import Modal from '../Information/Modal';
import { RootState } from '../../store/store';
import SVGComponent from '../Icons/SVGComponent';
import SearchComponent from '../Search/SearchInput';



const bellIcon = "M10.1353075,2.27592318 C10.2402118,2.0052531 10.405725,1.75363521 10.6305147,1.54243008 C11.4002733,0.819189975 12.5997267,0.819189975 13.3694853,1.54243008 C13.5947695,1.75409979 13.7605161,2.00636024 13.8653839,2.27770959 C16.7616088,3.1234978 19,5.9408248 19,10 C19,12.6246407 19.5316915,14.1023939 20.5153799,15.1769385 C20.7591805,15.4432571 21.6159553,16.2145106 21.7120353,16.3119441 L22,16.6039656 L22,20.0140878 L15.8743256,20.0140878 C15.6241439,20.9988638 15.0074832,21.861375 14.0878016,22.4226016 C12.8058555,23.2048965 11.1941445,23.2048965 9.91219841,22.4226016 C8.87009269,21.7866669 8.29383594,21.076125 8.08797645,20.0140878 L2,20.0140878 L2,16.6039656 L2.2879647,16.3119441 C2.39205094,16.2070827 3.24384208,15.442761 3.48595854,15.1793313 C4.46898326,14.1097716 5,12.6338939 5,10 C5,5.92919283 7.23535296,3.11802713 10.1353075,2.27592318 Z M10.1786171,20.0140878 C10.3199018,20.276911 10.5607105,20.4753661 10.9540156,20.7153766 C11.596268,21.1073049 12.403732,21.1073049 13.0459844,20.7153766 C13.3433933,20.5338858 13.5757865,20.2937382 13.7367218,20.0140878 L10.1786171,20.0140878 Z M20,17.4519264 C19.701613,17.1774463 19.2506046,16.7572744 19.0401756,16.5274096 C17.7059972,15.0700027 17,13.1077943 17,10 C17,6.23128941 14.6597092,4.01238167 12,4.01238167 C9.33276935,4.01238167 7,6.21989471 7,10 C7,13.1178011 6.29422173,15.0794011 4.95848591,16.5327208 C4.74843403,16.7612633 4.29607181,17.181102 4,17.45237 L4,18.0140878 L20,18.0140878 L20,17.4519264 Z";
const searchIcon = "M21.71,20.29,18,16.61A9,9,0,1,0,16.61,18l3.68,3.68a1,1,0,0,0,1.42,0A1,1,0,0,0,21.71,20.29ZM11,18a7,7,0,1,1,7-7A7,7,0,0,1,11,18Z";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Navbar: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [imageSRC, setImageSRC] = useState<string>('');

  const toggleMenu = () => setShowMenu(!showMenu);
  const toggleCreate = () => setShowCreate(!showCreate);
  const toggleSearch = () => setShowSearch(!showSearch);
  const currentUser : any = useSelector((state: RootState) => state.session.userObject);
  const [showCreateOrgPopup, setShowCreateOrgPopup] = useState(false); 
  const [showCreateProjectPopup, setShowCreateProjectPopup] = useState(false);
  
  // References for the project form
  const projectNameRef = useRef<HTMLInputElement>(null);
  const projectDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const projectEndDateRef = useRef<HTMLInputElement>(null);
  const projectOrganizationRef = useRef<HTMLSelectElement>(null);

  // We need to send the backend form info to create a new organization


  useEffect(() => {
    if (!imageSRC && currentUser) {
      fetch(import.meta.env.VITE_BACKEND_URL + '/userImg/' + currentUser.img_path)
        .then((res) => res.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          setImageSRC(url);
        })
        .catch((err) => console.error(err));
    } 
  }, [currentUser, imageSRC]);
    
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo y Botón para el Sidebar */}
        <div className="flex items-center space-x-4">
          <button
            className="text-white md:hidden"
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
  
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2 text-white">
            <img
              src="/blank_logo.png"
              alt="Logo"
              className="w-8 h-8"
            />
            <span className="text-xl font-bold">Velia</span>
          </Link>
        </div>
  
        {/* Search bar */}
        <div className="hidden md:block flex-1 mx-4 relative z-20">
          <SearchComponent url={`${import.meta.env.VITE_BACKEND_URL}/user/`} />
        </div>
  
        {/* Notifications, Notificaciones, Perfil y Botones */}
        <div className="flex items-center space-x-4">
          {/* Search bar (Mobile) */}
          <button
            className="text-white md:hidden"
            onClick={toggleSearch}
          >
            {SVGComponent({ className: "w-6 h-6", d: searchIcon })}
          </button>
  
          {/* Create buttons */}
          <div className="hidden md:flex space-x-2">
            <button
              onClick={() => setShowCreateOrgPopup(true)}
              className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600 transition"
            >
              Create Organization
            </button>
            <button
              onClick={() => setShowCreateProjectPopup(true)}
              className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 transition"
            >
              Create Project
            </button>
          </div>
  
          {/* Notificación */}
          <button className="relative text-white">
            {SVGComponent({ className: "w-6 h-6", d: bellIcon })}
            <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
          </button>
  
          {/* Imagen de perfil */}
          <div className="relative">
            <img
              src={imageSRC}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={toggleMenu}
            />

            {showMenu && currentUser && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl p-4 z-10">
              <ul className="space-y-2">
                <li>
                  <Link 
                    to={`/dashboard/profile/${currentUser.username}`} 
                    className="text-gray-700 block px-4 py-2 rounded-md transition-colors duration-200 hover:bg-gray-100 hover:text-blue-600"
                  >
                    Perfil
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/login" 
                    className="text-gray-700 block px-4 py-2 rounded-md transition-colors duration-200 hover:bg-gray-100 hover:text-red-600"
                    onClick={() => localStorage.removeItem("token")}
                  >
                    Cerrar sesión
                  </Link>
                </li>
              </ul>
            </div>
            )}
          </div>
        </div>
      </div>
  
      {/* Search bar (Mobile) */}
      {showSearch && (
        <div className="mt-2 md:hidden relative z-30">
          <SearchComponent url={`${import.meta.env.VITE_BACKEND_URL}/user/`} mobile={true} />
        </div>
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
  
      {/* Modal for Organization Creation */}
      {showCreateOrgPopup && (
        <Modal
          title="Crear Organización"
          onClose={() => setShowCreateOrgPopup(false)}
          onSubmit={() => {
            const name = (document.querySelector(
              "#organization-name"
            ) as HTMLInputElement).value;
            fetch(BACKEND_URL + "/organization", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: localStorage.getItem("token") || "",
              },
              body: JSON.stringify({ name, members: [] }),
            })
              .then((res) => res.json())
              .then((_) => {
                window.location.reload();
                setShowCreateOrgPopup(false);
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
      {/* Modal for Project Creation*/}
      {showCreateProjectPopup && (
        <Modal
          title="Crear Proyecto"
          onClose={() => setShowCreateProjectPopup(false)}
          onSubmit={() => {

            const name = projectNameRef.current?.value || "";
            const description = projectDescriptionRef.current?.value || "";
            const endDate = projectEndDateRef.current?.value || "";
            const organization = projectOrganizationRef.current?.value || "";

            if (!name || !organization) {
              alert("Please, fill the mandatory fields.");
              return;
            }

            fetch(`${BACKEND_URL}/project`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: localStorage.getItem("token") || "",
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
              .then((_) => {
                setShowCreateProjectPopup(false);
                window.location.reload();
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
          <label htmlFor="project-end-date" className="block text-sm font-medium text-gray-700" />
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
            <option value="">Select organizations</option>
            {currentUser.organizations.map((org: any) => (
              <option key={org._id} value={org.name}>
                {org.name}
              </option>
            ))}
          </select>
        </Modal>
      )}
    </nav>
  )};

export default Navbar;