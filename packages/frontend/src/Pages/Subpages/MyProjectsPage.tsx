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

import React, { useState } from "react";
import { setCurrentProject } from "../../slices/sessionSlice";
import { setPersistedProject } from "../../slices/projectSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";

interface Project {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  members: string[];
  [key: string]: any;
}

const MyProjectsPage: React.FC = () => {
  const dispatch = useDispatch();
  const sessionState = useSelector((state: RootState) => state.session);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleSelectProject = () => {
    if (selectedProject) {
      dispatch(setCurrentProject(selectedProject));
      dispatch(setPersistedProject(selectedProject._id));
      setSelectedProject(null);
    }
  };

  const handleLeaveProject = async () => {
    if (selectedProject) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/project/leave/${selectedProject._id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token") || "",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to leave project");
        }

        dispatch(setCurrentProject(null));
        dispatch(setPersistedProject(null));
        setSelectedProject(null);
        alert("You have left the project.");
      } catch (error) {
        console.error("Error leaving project:", error);
      }
    }
  };

  return (
    <div className="flex-1 bg-gray-50 w-full h-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Projects</h1>

      {sessionState.projects && sessionState.projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessionState.projects.map((project: Project) => (
            <div
              key={project._id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 cursor-pointer"
              onClick={() => handleProjectClick(project)}
            >
              <h2 className="text-xl font-bold text-blue-700 mb-2">{project.name}</h2>
              <p className="text-gray-600 line-clamp-3">{project.description}</p>
              <div className="mt-4 text-right">
                <p className="text-sm text-gray-500">Click for details!</p>
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

      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-8 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setSelectedProject(null)}
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold text-blue-600">{selectedProject.name}</h2>
            <p className="text-gray-600 mt-4">{selectedProject.description}</p>
            <p className="text-gray-500 mt-4">
              <strong>Created on:</strong>{" "}
              {new Date(selectedProject.startDate).toLocaleDateString()}
            </p>
            <p className="text-gray-500 mt-2">
              <strong>Members:</strong> {selectedProject.users.length}
            </p>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transition"
                onClick={handleSelectProject}
              >
                Select Project
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 transition"
                onClick={handleLeaveProject}
              >
                Leave Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProjectsPage;
