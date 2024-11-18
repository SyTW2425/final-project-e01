import React from "react";
import KanbanBoard from '../../Components/Graphs/KanbanBoard';



const initialData = {
  tasks: {
    "task-1": {
      id: "task-1",
      name: "Tarea 1",
      state: "todo",
      assignedTo: { name: "Juan", avatar: "https://via.placeholder.com/50" },
      description: "Descripción de la tarea 1",
    },
    "task-2": {
      id: "task-2",
      name: "Tarea 2",
      state: "todo",
      assignedTo: { name: "Ana", avatar: "https://via.placeholder.com/50" },
      description: "Descripción de la tarea 2",
    },
    "task-3": {
      id: "task-3",
      name: "Tarea 3",
      state: "in-progress",
      assignedTo: { name: "Luis", avatar: "https://via.placeholder.com/50" },
      description: "Descripción de la tarea 3",
    },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "Por Hacer",
      taskIds: ["task-1", "task-2"],
    },
    "column-2": {
      id: "column-2",
      title: "En Progreso",
      taskIds: ["task-3"],
    },
  },
  columnOrder: ["column-1", "column-2"],
};

const KanbanBoardPage: React.FC = () => {
  return (
    <div className="flex-1 bg-gray-50 z-10">
      <KanbanBoard initialData={initialData} />
    </div>
  );
}

export default KanbanBoardPage;