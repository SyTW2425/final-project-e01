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
 * @date 18/11/2024
 * @brief Componente de tarjeta de tarea para tablero kanban
 */

import React from "react";
import { Draggable } from "@hello-pangea/dnd";

export interface taskInfo {
  id: string;
  name: string;
  state: string;
  priority: string;
  description: string;
}

const getPrioritySVG = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "high":
      return (
        <svg
          className="w-6 h-6 text-red-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 110 20 10 10 0 010-20z" />
          <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "medium":
      return (
        <svg
          className="w-6 h-6 text-orange-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 110 20 10 10 0 010-20z" />
          <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "low":
      return (
        <svg
          className="w-6 h-6 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 110 20 10 10 0 010-20z" />
        </svg>
      );
    default:
      return null;
  }
};

interface TaskProps {
  taskData: taskInfo;
  index: number;
}

const Task: React.FC<TaskProps> = ({ taskData, index }) => {
  return (
    <Draggable draggableId={taskData.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="bg-white rounded-lg p-4 shadow-md flex items-center md:justify-between md:flex-row flex-col space-y-4 md:space-y-0"
        >
          <div className="flex items-center space-x-4 w-full md:w-auto">
            {getPrioritySVG(taskData.priority)}
            <div className="flex-1">
              <h4 className="font-semibold text-base md:text-lg">{taskData.name}</h4>
              <p className="text-sm text-gray-600">{taskData.description}</p>
            </div>
          </div>
          <span
            className={`text-sm font-medium px-3 py-1 rounded ${
              taskData.state === "completed"
                ? "bg-green-100 text-green-600"
                : taskData.state === "in-progress"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {taskData.state}
          </span>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
