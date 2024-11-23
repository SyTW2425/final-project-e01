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
 * Component that renders the footer of the home page.
 */
const FooterHome: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16">
      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      {/* About Section */}
        <div>
          <h3 className="text-xl font-bold mb-4">About Velia</h3>
          <p className="text-base">
            Velia is a project management platform that helps you organize, collaborate, and achieve your goals.
          </p>
        </div>
        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:underline">About Us</a></li>
            <li><a href="/" className="hover:underline">FAQ</a></li>
            <li><a href="/" className="hover:underline">Terms of Service</a></li>
            <li><a href="/" className="hover:underline">Privacy Policy</a></li>
          </ul>
        </div>
        {/* Contact Section */}
        <div>
          <h3 className="text-xl font-bold mb-4">Contact</h3>
          <ul className="space-y-2">
            <li>
              <a href="mailto:contacto@velia.com" className="hover:underline">
                contacto@velia.com
              </a>
            </li>
            <li>
              <a href="tel:+1234567890" className="hover:underline">
                +34 922 10 10 10
              </a>
            </li>
          </ul>
        </div>
        {/* Follow Us */}
        <div>
          <h3 className="text-xl font-bold mb-4">Follow Us</h3>
          <ul className="space-y-2">
            <li>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                LinkedIn
              </a>
            </li>
            <li>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Twitter
              </a>
            </li>
            <li>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>
      {/* Copyright */}
      <div className="text-center mt-8 pt-4">
        <p>&copy; {new Date().getFullYear()} Velia. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default FooterHome;