import React from "react";
import { Draggable } from "@hello-pangea/dnd";

export interface taskInfo {
  id: string;
  name: string;
  state: string;
  assignedTo: { name: string; avatar: string };
  description: string;
}

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
          {/* Imagen y contenido */}
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <img
              src={taskData.assignedTo.avatar}
              alt={taskData.assignedTo.name}
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-base md:text-lg">{taskData.name}</h4>
              <p className="text-sm text-gray-600">{taskData.description}</p>
            </div>
          </div>
          {/* Estado */}
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
