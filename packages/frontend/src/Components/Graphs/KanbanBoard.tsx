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
 * @brief Componente de tablero Kanban
 */

import React, { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";

import { taskInfo } from "../Information/TaskCard";
import Column, { column } from "./Column";

interface KanbanBoardProps {
  initialData: {
    tasks: Record<string, taskInfo>;
    columns: Record<string, column>;
    columnOrder: string[];
  };
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ initialData }) => {
  const [data, setData] = useState(initialData);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const sourceColumn = data.columns[source.droppableId];
    const destinationColumn = data.columns[destination.droppableId];

    if (sourceColumn === destinationColumn) {
      const newTaskIds = Array.from(sourceColumn.taskIds);
      newTaskIds.splice(source.index, 1); // Eliminar de la posición inicial
      newTaskIds.splice(destination.index, 0, draggableId); // Insertar en la nueva posición

      const newColumn = { ...sourceColumn, taskIds: newTaskIds };

      setData({
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      });
    } else {
      const sourceTaskIds = Array.from(sourceColumn.taskIds);
      sourceTaskIds.splice(source.index, 1);

      const destinationTaskIds = Array.from(destinationColumn.taskIds);
      destinationTaskIds.splice(destination.index, 0, draggableId);

      setData({
        ...data,
        columns: {
          ...data.columns,
          [sourceColumn.id]: { ...sourceColumn, taskIds: sourceTaskIds },
          [destinationColumn.id]: { ...destinationColumn, taskIds: destinationTaskIds },
        },
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-2 p-6 bg-gray-50 min-h-screen">
        {data.columnOrder.map((columnId) => {
          const column = data.columns[columnId];
          const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);
          return <Column key={column.id} column={column} tasks={tasks} />;
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
