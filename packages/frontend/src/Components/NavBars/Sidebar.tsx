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
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const Sidebar: React.FC = () => {
  const currentProject: any = useSelector((state: RootState) => state.session.currentProject);

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-300">
        <h2 className="text-lg font-semibold text-gray-800">My Workspace</h2>
        {currentProject ? (
          <div className="mt-4 p-4 bg-blue-100 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-blue-700">Currently Working On</h3>
            <p className="text-lg font-semibold text-blue-800 mt-1">{currentProject.name}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-4">No projects available</p>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="px-4 py-6 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-600 uppercase mb-2">Navigation</h3>
          <div className="space-y-2">
            <Link
              to="/dashboard"
              className="flex items-center p-3 rounded-md bg-white shadow-sm hover:bg-blue-100 transition"
            >
              <span className="w-8 h-8 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center mr-3">
                📁
              </span>
              <span className="text-sm font-medium text-gray-800">My Projects</span>
            </Link>
            <Link
              to="/dashboard/tasks"
              className="flex items-center p-3 rounded-md bg-white shadow-sm hover:bg-blue-100 transition"
            >
              <span className="w-8 h-8 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center mr-3">
                ✅
              </span>
              <span className="text-sm font-medium text-gray-800">My Tasks</span>
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-600 uppercase mb-2">Management</h3>
          <div className="space-y-2">
            <Link
              to="/dashboard/members"
              className="flex items-center p-3 rounded-md bg-white shadow-sm hover:bg-blue-100 transition"
            >
              <span className="w-8 h-8 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center mr-3">
                👥
              </span>
              <span className="text-sm font-medium text-gray-800">Members</span>
            </Link>
            <Link
              to="/dashboard/taskmanager"
              className="flex items-center p-3 rounded-md bg-white shadow-sm hover:bg-blue-100 transition"
            >
              <span className="w-8 h-8 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center mr-3">
                🛠
              </span>
              <span className="text-sm font-medium text-gray-800">Sprint Manager</span>
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-600 uppercase mb-2">Tools</h3>
          <div className="space-y-2">
            <Link
              to="/dashboard/kanban"
              className="flex items-center p-3 rounded-md bg-white shadow-sm hover:bg-blue-100 transition"
            >
              <span className="w-8 h-8 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center mr-3">
                📊
              </span>
              <span className="text-sm font-medium text-gray-800">Kanban Board</span>
            </Link>
            <Link
              to="/dashboard/gantt"
              className="flex items-center p-3 rounded-md bg-white shadow-sm hover:bg-blue-100 transition"
            >
              <span className="w-8 h-8 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center mr-3">
                📅
              </span>
              <span className="text-sm font-medium text-gray-800">Gantt Diagram</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
