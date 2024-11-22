import React, { useState } from 'react';
import Sidebar from '../Components/NavBars/Sidebar';
import Navbar from '../Components/NavBars/NavBarGeneral';
import { Routes, Route } from 'react-router-dom';
import KanbanBoardPage from './Subpages/KanbanBoardPage';
import GanttDiagramPage from './Subpages/GanttDiagramPage';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const DashboardPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const currentUser : any = useSelector((state: RootState) => state.session.userObject);
  return (
    <>
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

        {/* Principal content */}

        <div className="flex-1 overflow-y-auto overflow-x-scroll">
          <Routes>
            <Route path="kanban" Component={KanbanBoardPage} />
            <Route path="gantt" Component={GanttDiagramPage}/>
            <Route path="*" Component={() => {
              return (
              <>
              <div className="p-4 text-center text-gray-200 text-5xl text-bold">
                🛠️ PAGE UNDER DEVELOPMENT 🛠️
              </div>
              </>
              );
            }} />
          </Routes>
        </div>
    
      </div>
    </>
  );
};

export default DashboardPage;