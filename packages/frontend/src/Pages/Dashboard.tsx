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
 * @brief Página de dashboard
 */

import React from 'react';
import Sidebar from '../Components/NavBars/Sidebar';
import Navbar from '../Components/NavBars/NavBarGeneral';
import MainContent from '../Components/NavBars/MainContent';

const DashboardPage : React.FC = () => {
  return (
    <>
    {localStorage.getItem('token') === null && window.location.replace('/login')}
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
        <MainContent />
      </div>
    </div>
    </>
  );
}

export default DashboardPage;