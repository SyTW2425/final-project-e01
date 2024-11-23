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
 * Component that renders the footer of the dashboard page with symmetrical layout.
 */
const FooterDashboard: React.FC<{ currentUser: any }> = ({ currentUser }) => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 items-center text-center">
        {/* Información básica */}
        <div>
          <p className="text-lg font-semibold">&copy; {new Date().getFullYear()} Velia Dashboard</p>
          <p className="text-sm">All Rights Reserved | Version 1.0.0</p>
        </div>

        {/* Información del usuario actual */}
        {currentUser && (
          <div>
            <p className="text-lg font-semibold">Logged in as:</p>
            <p className="text-blue-400 font-semibold">{currentUser.username || 'Unknown User'}</p>
            <p className="text-sm">{currentUser.email || 'No Email'}</p>
          </div>
        )}
      </div>
    </footer>
  );
};

export default FooterDashboard;