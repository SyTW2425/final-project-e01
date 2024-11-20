import React, { useState } from 'react';
import Sidebar from '../Components/NavBars/Sidebar';
import Navbar from '../Components/NavBars/NavBarGeneral';
import { Routes, Route } from 'react-router-dom';
import KanbanBoardPage from './Subpages/KanbanBoardPage';
import UserCard from '../Components/Information/UserCard';

const DashboardPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const users = [
    {
      name: 'lamine',
      email: 'lamine@gmail.com',
      image: '$2b$10$6r0AN0TL4N2mclHvQrSTA.aFggpLlAucTwOVt9dibqcIigoluucwS.jpg',
    },
    {
      name: 'pablo',
      email: 'pablo@gmail.com',
      image: '$2b$10$suR6yC6g7H9lUAUI0Ln9rufR.HKvhoFLBzVt3YdCUlidN7.ZuHwI..png',
    },
    // Puedes agregar más usuarios si lo deseas
  ];


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
        <div className="flex-1 p-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <UserCard key={user.name} userData={user} />
            ))}
          </div>
        </div>

        <div className="flex-1">
          <Routes>
            <Route path="kanban" Component={KanbanBoardPage} />
            <Route path="*" Component={() => <h1 className='text-white'>Putada pibe</h1>}/>
          </Routes>
        </div>
    
      </div>
    </>
  );
};

export default DashboardPage;
