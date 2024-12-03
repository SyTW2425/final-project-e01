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
 * @brief Página de tareas del usuario
 */

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface Task {
  _id: string;
  name: string;
  description: string;
  priority: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
}

const MyTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const currentProject: any = useSelector((state: RootState) => state.session.currentProject);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!currentProject?._id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/task/project/${currentProject._id}`,
          {
            method: "GET",
            headers: {
              authorization: localStorage.getItem("token") || "",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching tasks");
        }

        const data = await response.json();
        setTasks(data.result);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchTasks();
  }, [currentProject]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center text-gray-600">
          <svg
            className="animate-spin h-10 w-10 text-blue-500 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 w-full h-auto">
      <div className="text-center text-gray-700 mt-10">
        <h1 className="text-3xl font-bold mb-5 text-black">My Tasks</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {Array.isArray(tasks) && tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={Date.now() + Math.random()}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-t-4"
                style={{
                  borderColor:
                    task.priority === "high"
                      ? "red"
                      : task.priority === "medium"
                      ? "orange"
                      : "green",
                }}
              >
                <h2 className="text-lg font-bold text-gray-800 mb-2">{task.name}</h2>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{task.description}</p>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    <span className="font-semibold text-gray-800">Priority:</span>{" "}
                    <span
                      className={`${
                        task.priority === "high"
                          ? "text-red-600"
                          : task.priority === "medium"
                          ? "text-orange-600"
                          : "text-green-600"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">Status:</span>{" "}
                    {task.status}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">Progress:</span>{" "}
                    <span className="text-blue-600">{task.progress}%</span>
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">Start Date:</span>{" "}
                    {new Date(task.startDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">End Date:</span>{" "}
                    {new Date(task.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              <p>No tasks found</p>
              <p className="mt-2">Start by creating tasks for your project!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTasksPage;
