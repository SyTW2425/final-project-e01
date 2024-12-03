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
 * @brief Página de proyectos del usuario
 */

import React from "react";
import { setCurrentProject } from '../../slices/sessionSlice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';

interface Project {
  name: string;
  description: string;
  createdAt: string;
  members: string[];
  [key: string]: any;
}

const MyProjectsPage: React.FC = () => {
  const dispatch = useDispatch();
  const sessionState = useSelector((state: RootState) => state.session);

  const handleProjectClick = (project: Project) => {
    dispatch(setCurrentProject(project));
  };
  return (
    <div className="flex-1 bg-gray-50 w-full h-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Projects</h1>

      {sessionState.projects && sessionState.projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessionState.projects.map((project: any) => (
            <div
              key={Date.now() + Math.random()}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 cursor-pointer"
              onClick={() => handleProjectClick(project)}
            >
              <h2 className="text-xl font-bold text-blue-700 mb-2">{project.name}</h2>
              <p className="text-gray-600 line-clamp-3">{project.description}</p>
              <div className="mt-4 text-right">
                <p className="text-sm text-gray-500">Click for pick!</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-700">
          <p className="text-lg">You don't belong to a project yet 😅</p>
          <p className="text-gray-500 mt-2">Start by joining or creating a new project!</p>
        </div>
      )}
    </div>
  );
};

export default MyProjectsPage;
