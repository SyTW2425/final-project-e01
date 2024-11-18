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
 * @brief Componente de sidebar para el cuadro de mandos
 */

import React from 'react';
import { Link } from 'react-router-dom';
import SVGComponent from '../Icons/SVGComponent';



const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-full min-h-full bg-gray-100 p-0 pt-2">
      <div className="flex items-center justify-center">
        <h2 className="text-xl font-bold mt-5">Mi espacio de trabajo</h2>
      </div>
      <hr className='m-4'/>
      <div className=''>
        <Link to="/mytasks" className="block align-middle transition-all bg-blue-200 min-h-9  hover:text-white m-2 hover:translate-x-1 rounded hover:bg-blue-600">
          <SVGComponent className="w-8 h-8 align-middle inline-block ml-2 mr-2 mt-2 min-w-4" d="M4,4 L9,4 C9.55228,4 10,3.55228 10,3 C10,2.44772 9.55228,2 9,2 L4,2 C2.89543,2 2,2.89543 2,4 L2,12 C2,13.1046 2.89543,14 4,14 L12,14 C13.1046,14 14,13.1046 14,12 L14,10 C14,9.44771 13.5523,9 13,9 C12.4477,9 12,9.44771 12,10 L12,12 L4,12 L4,4 Z M15.2071,2.29289 C14.8166,1.90237 14.1834,1.90237 13.7929,2.29289 L8.5,7.58579 L7.70711,6.79289 C7.31658,6.40237 6.68342,6.40237 6.29289,6.79289 C5.90237,7.18342 5.90237,7.81658 6.29289,8.20711 L7.79289,9.70711 C7.98043,9.89464 8.23478,10 8.5,10 C8.76522,10 9.01957,9.89464 9.20711,9.70711 L15.2071,3.70711 C15.5976,3.31658 15.5976,2.68342 15.2071,2.29289 Z" fill="#000000" />
          My Tasks
        </Link>
        <Link to="/mytasks" className="block transition-all bg-blue-200 min-h-9  hover:text-white m-2 hover:translate-x-1 rounded hover:bg-blue-600">
          <SVGComponent className="w-8 h-8 align-middle inline-block ml-2 mr-2 mt-2 min-w-4" d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.075 12.975 13.8623 12.975 13.6C12.975 11.72 12.4778 10.2794 11.4959 9.31166C10.7244 8.55135 9.70025 8.12903 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z" fill="#000000" />
          Members
        </Link>
        <Link to="/dashboard/" className="block transition-all bg-blue-200 min-h-9 hover:text-white m-2 hover:translate-x-1 rounded hover:bg-blue-600">
          <SVGComponent className="w-6 h-6 align-middle inline-block ml-1 mr-2 min-w-4" d="M6 0h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6zm0 2a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V6a4 4 0 0 0-4-4H6zm6 7h3a1 1 0 0 1 0 2h-3a1 1 0 0 1 0-2zm-2 4h5a1 1 0 0 1 0 2h-5a1 1 0 0 1 0-2zm0-8h5a1 1 0 0 1 0 2h-5a1 1 0 1 1 0-2zm-4.172 5.243L7.95 8.12a1 1 0 1 1 1.414 1.415l-2.828 2.828a1 1 0 0 1-1.415 0L3.707 10.95a1 1 0 0 1 1.414-1.414l.707.707z" fill="#000000" />
          Sprint Manager
        </Link>
        <Link to="/dashboard/kanban" className="block transition-all bg-blue-200 min-h-9  hover:text-white m-2 hover:translate-x-1 rounded hover:bg-blue-600">
          <SVGComponent className="w-6 h-6 align-middle inline-block ml-2 mr-2 mt-0 min-w-4" d="M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5zm6 0H4v14h4V5zm2 0v14h4V5h-4zm6 0v14h4V5h-4z" fill="#000000" />
          Kanban Board
        </Link>
        <Link to="/dashboard/gantt" className="block transition-all bg-blue-200 min-h-9  hover:text-white m-2 hover:translate-x-1 rounded hover:bg-blue-600">
          <SVGComponent className="w-6 h-6 align-middle inline-block ml-2 mr-2 mt-0 min-w-4" d="M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5zm6 0H4v14h4V5zm2 0v14h4V5h-4zm6 0v14h4V5h-4z" fill="#000000" />
          GanttDiagram
        </Link>
      </div>
      <nav className="space-y-4">

      </nav>
    </div>
  );
};

export default Sidebar;