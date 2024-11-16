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
 * @brief Página de dashboard
 */

import React from 'react';
import Sidebar from '../Components/NavBars/Sidebar';
import Navbar from '../Components/NavBars/NavBarGeneral';
import KanbanBoard from '../Components/Graphs/KanbanBoard';

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

const DashboardPage : React.FC = () => {
  return (
    <>
    {localStorage.getItem('token') === null && window.location.replace('/login')}
    <Navbar />
    <div className="flex h-screen">
      <div className="flex flex-col bg-gray-200">
        <Sidebar />
      </div>
      <div className="flex-1 bg-gray-50">
        <KanbanBoard initialData={initialData} />
      </div>
  </div>
    </>
  );
}

export default DashboardPage;