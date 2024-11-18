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
 * @brief Componente de columna para el tablero Kanban
 */

import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import Task, { taskInfo } from "../Information/TaskCard";

export interface column {
  id: string;
  title: string;
  taskIds: string[];
}

interface ColumnProps {
  column: column;
  tasks: taskInfo[];
}

const Column: React.FC<ColumnProps> = ({ column, tasks }) => {
  return (
    <div className="bg-white rounded-md shadow-md p-4 flex flex-col w-full">
      <h3 className="text-lg font-bold mb-4 text-center md:text-left">{column.title}</h3>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4 min-h-[100px]"
          >
            {tasks.map((task, index) => (
              <Task key={task.id} taskData={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
  