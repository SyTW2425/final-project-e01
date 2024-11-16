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
          className="bg-gray-100 rounded-md p-4 shadow-sm"
        >
          <h4 className="font-bold">{taskData.name}</h4>
          <p className="text-sm text-gray-600">{taskData.description}</p>
          <div className="flex items-center mt-2">
            <img
              src={taskData.assignedTo.avatar}
              alt={taskData.assignedTo.name}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-sm">{taskData.assignedTo.name}</span>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
