import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

import { RootState } from '../store/store';
import Sidebar from '../Components/NavBars/Sidebar';
import Navbar from '../Components/NavBars/NavBarGeneral';
import FooterDashboard from '../Components/Footer/FooterDashboard';
import MyTasksPage from './Subpages/MyTasksPage';
import MyProjectsPage from './Subpages/MyProjectsPage';
import KanbanBoardPage from './Subpages/KanbanBoardPage';
import GanttDiagramPage from './Subpages/GanttDiagramPage';
import ProjectMembersPage from './Subpages/ProjectMembersPage';

const DashboardPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const sessionState = useSelector((state: RootState) => state.session);
  const currentUser : any = sessionState.userObject;
  return (
    <>
      <Navbar onToggleSidebar={toggleSidebar} />
      <div className="relative h-screen flex bg-gray-50">
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full bg-gray-200 shadow-lg z-40 transform transition-transform duration-300
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[110%]'} 
            md:relative md:translate-x-0`}
          style={{ width: '250px' }}
        >
          <Sidebar />
        </div>

        {isSidebarOpen && (
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 bg-gray-50 bg-opacity-50 z-30 md:hidden"
          />
        )}

        {/* Principal content */}

        <div className="flex-1 max-w-full">
          <Routes>
            <Route path="kanban" Component={KanbanBoardPage} />
            <Route path="gantt" Component={GanttDiagramPage}/>
            <Route path="tasks" Component={MyTasksPage} />
            <Route path="/" Component={MyProjectsPage} />
            <Route path="members" Component={ProjectMembersPage} />
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
      <FooterDashboard currentUser={currentUser} />
    </>
  );
};

export default DashboardPage;