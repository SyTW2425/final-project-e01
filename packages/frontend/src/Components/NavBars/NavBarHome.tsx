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
 * @brief Componente de barra de navegación de la página de inicio.
 */

import React from 'react';
// import {Route, Routes } from 'react-router-dom';
import { Link as LinkP } from 'react-scroll';
// import HomePage from '../../Pages/Home';
// import LoginPage from '../../Pages/Login';
// import RegisterPage from '../../Pages/Register';


interface NavbarHomeProps {
  isHomePage: boolean;
}


const NavbarHome : React.FC<NavbarHomeProps> = ({isHomePage}) => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-600 text-white shadow-md z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold">
          <img src="../../public/blank_logo.png" className="inline-block w-8 h-8 mr-2" alt="logo" />
          Velia
        </div>
        {isHomePage ?
          <>
          <ul className="flex space-x-4">
          <li>
            <LinkP 
              to="home" 
              smooth={true} 
              duration={500} 
              className="text-white hover:text-gray-400 cursor-pointer"
            >
              Home
            </LinkP>
          </li>
          <li>
            <LinkP 
              to="whatis" 
              smooth={true} 
              duration={500} 
              className="text-white hover:text-gray-400 cursor-pointer"
            >
              What is Velia?
            </LinkP>
          </li>
          <li>
            <LinkP 
              to="whyvelia" 
              smooth={true} 
              duration={500} 
              className="text-white hover:text-gray-400 cursor-pointer"
            >
              Why Velia?
            </LinkP>
          </li>
        </ul>
        </>
        :
        <>
          <ul className="flex space-x-4">
            <li>
              <button className="text-white hover:text-gray-400 cursor-pointer"
                onClick={() => window.location.href = '/home'}
              >
              Home
              </button>
            </li>
            <li>
              <button className="text-white hover:text-gray-400 cursor-pointer"
                onClick={() => window.location.href = '/home'}
              >
              What is Velia?
              </button>
            </li>
            <li>
              <button className="text-white hover:text-gray-400 cursor-pointer"
                onClick={() => window.location.href = '/home'}
              >
              Why Velia?
              </button>
            </li>
          </ul>
        </>
      }
    

      </div>

    </nav>
  );
};

export default NavbarHome;