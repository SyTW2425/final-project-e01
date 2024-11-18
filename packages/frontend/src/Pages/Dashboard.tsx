import React, { useState } from 'react';
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

const DashboardPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {localStorage.getItem('token') === null && window.location.replace('/login')}
      <Navbar onToggleSidebar={toggleSidebar} />
      <div className="relative h-screen flex">
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full bg-gray-200 shadow-lg z-40 transform transition-transform duration-300
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[110%]'} 
            md:relative md:translate-x-0`}
          style={{ width: '250px' }}
        >
          <Sidebar />
        </div>

        {/* Overlay para dispositivos móviles */}
        {isSidebarOpen && (
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          />
        )}

        {/* Contenido principal */}
        <div className="flex-1 bg-gray-50 z-10">
          <KanbanBoard initialData={initialData} />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
