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
import { Link as LinkP } from 'react-scroll';

const NavbarHome: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-700 text-white shadow-md z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold flex items-center">
          <img
            src="blank_logo.png"
            className="inline-block w-8 h-8 mr-2"
            alt="logo"
          />
          Velia
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-6">
          <li>
            <LinkP
              to="hero"
              smooth={true}
              duration={500}
              className="text-white hover:text-blue-300 cursor-pointer transition duration-300"
            >
              Home
            </LinkP>
          </li>
          <li>
            <LinkP
              to="features"
              smooth={true}
              duration={500}
              className="text-white hover:text-blue-300 cursor-pointer transition duration-300"
            >
              Features
            </LinkP>
          </li>
          <li>
            <LinkP
              to="testimonials"
              smooth={true}
              duration={500}
              className="text-white hover:text-blue-300 cursor-pointer transition duration-300"
            >
              Testimonials
            </LinkP>
          </li>
          <li>
            <LinkP
              to="getstarted"
              smooth={true}
              duration={500}
              className="text-white hover:text-blue-300 cursor-pointer transition duration-300"
            >
              Get Started
            </LinkP>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavbarHome;
