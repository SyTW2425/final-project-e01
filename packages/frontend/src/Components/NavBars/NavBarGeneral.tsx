import React, { useEffect, useState } from 'react';
import SVGComponent from '../Icons/SVGComponent';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const bellIcon = "M10.1353075,2.27592318 C10.2402118,2.0052531 10.405725,1.75363521 10.6305147,1.54243008 C11.4002733,0.819189975 12.5997267,0.819189975 13.3694853,1.54243008 C13.5947695,1.75409979 13.7605161,2.00636024 13.8653839,2.27770959 C16.7616088,3.1234978 19,5.9408248 19,10 C19,12.6246407 19.5316915,14.1023939 20.5153799,15.1769385 C20.7591805,15.4432571 21.6159553,16.2145106 21.7120353,16.3119441 L22,16.6039656 L22,20.0140878 L15.8743256,20.0140878 C15.6241439,20.9988638 15.0074832,21.861375 14.0878016,22.4226016 C12.8058555,23.2048965 11.1941445,23.2048965 9.91219841,22.4226016 C8.87009269,21.7866669 8.29383594,21.076125 8.08797645,20.0140878 L2,20.0140878 L2,16.6039656 L2.2879647,16.3119441 C2.39205094,16.2070827 3.24384208,15.442761 3.48595854,15.1793313 C4.46898326,14.1097716 5,12.6338939 5,10 C5,5.92919283 7.23535296,3.11802713 10.1353075,2.27592318 Z M10.1786171,20.0140878 C10.3199018,20.276911 10.5607105,20.4753661 10.9540156,20.7153766 C11.596268,21.1073049 12.403732,21.1073049 13.0459844,20.7153766 C13.3433933,20.5338858 13.5757865,20.2937382 13.7367218,20.0140878 L10.1786171,20.0140878 Z M20,17.4519264 C19.701613,17.1774463 19.2506046,16.7572744 19.0401756,16.5274096 C17.7059972,15.0700027 17,13.1077943 17,10 C17,6.23128941 14.6597092,4.01238167 12,4.01238167 C9.33276935,4.01238167 7,6.21989471 7,10 C7,13.1178011 6.29422173,15.0794011 4.95848591,16.5327208 C4.74843403,16.7612633 4.29607181,17.181102 4,17.45237 L4,18.0140878 L20,18.0140878 L20,17.4519264 Z";
const searchIcon = "M21.71,20.29,18,16.61A9,9,0,1,0,16.61,18l3.68,3.68a1,1,0,0,0,1.42,0A1,1,0,0,0,21.71,20.29ZM11,18a7,7,0,1,1,7-7A7,7,0,0,1,11,18Z";

const Navbar: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [imageSRC, setImageSRC] = useState<string>('');

  const toggleMenu = () => setShowMenu(!showMenu);
  const toggleSearch = () => setShowSearch(!showSearch);
  const currentUser : any = useSelector((state: RootState) => state.session.userObject);
  
  
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
        {/* Button to toggle sidebar */}
        <div className="flex items-center">
        <button
          className="text-white mr-4 md:hidden"
          onClick={onToggleSidebar}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>

        {/* Logo */}
        <Link to="/dashboard" className="text-white text-xl font-bold">
          <img src="/blank_logo.png" alt="Logo" className="w-10 h-10 mr-2" />Velia
        </Link>
        </div>
        {/* Search Input */}
        <div className="hidden md:flex flex-1 justify-center items-center">
          {SVGComponent({ className: 'w-6 h-6 mr-3', d: searchIcon })}
          <input
            type="text"
            placeholder="Buscar"
            className="w-1/5 focus:w-1/3 focus:scale-125 px-4 py-2 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-black-500 focus:ring-opacity-50 transition-all"
          />
        </div>

        {/* Notification and Profile */}
        <div className="flex items-center space-x-4">
          {/* Search Icon (Mobile) */}
          <button className="text-white md:hidden" onClick={toggleSearch}>
          {SVGComponent({ className: 'w-6 h-6', d: searchIcon })}
          </button>

          {/* Notification Icon */}
          <button className="text-white relative">
          {SVGComponent({ className: 'w-6 h-6', d: bellIcon })}
            <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
          </button>

          {/* Profile Picture */}
          <div className="relative">
            <img
              src={imageSRC}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={toggleMenu}
            />
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg p-4 z-10">
                <ul>
                  <li><a href="#" className="text-gray-700 block">Perfil</a></li>
                  <li><a href="#" className="text-gray-700 block">Cerrar sesión</a></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="mt-2 md:hidden">
          <input
            type="text"
            placeholder="Buscar"
            className="w-full px-4 py-2 rounded-md transition-all text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-black-500 focus:ring-opacity-50"
          />
        </div>
      )}
    </nav>
  );
};


export default Navbar;

