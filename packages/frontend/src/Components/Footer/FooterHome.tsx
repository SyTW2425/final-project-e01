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
 * @brief Componente de pie de página.
 */

import React from 'react';

/**
 * Footer component
 */
const FooterHome: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white text-center py-6">
      {/* Información de contacto */}
      <div>
        <p>Contacto: <a href="mailto:contacto@velia.com" className="text-blue-400 hover:underline">contacto@velia.com</a></p>
        <p>Teléfono: <a href="tel:+1234567890" className="text-blue-400 hover:underline">+34 922 000 000</a></p>
      </div>
      {/* Navegación adicional */}
      <div className="mt-4">
        {/* Añadir espacios */}
        <a href="/" className="text-blue-400 hover:underline">About Us </a> |
        <a href="/" className="text-blue-400 hover:underline"> FAQ</a> | 
        <a href="/" className="text-blue-400 hover:underline"> Terms of Service </a> | 
        <a href="/" className="text-blue-400 hover:underline"> Privacy Policy </a>
      </div>
      {/* Redes sociales */}
      <div className="mt-4">
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="mx-2 text-blue-400 hover:underline">LinkedIn</a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="mx-2 text-blue-400 hover:underline">Twitter</a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="mx-2 text-blue-400 hover:underline">GitHub</a>
      </div>
      {/* Derechos reservados */}
      <div className="mt-4">
        <p>&copy; {new Date().getFullYear()} Velia. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default FooterHome;