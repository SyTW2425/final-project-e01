import React from "react";
import GanttDiagram from '../../Components/Graphs/GanttDiagram';

const GanttDiagramPage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50 z-10 "> 
      <GanttDiagram />
    </div>
  );
}

export default GanttDiagramPage;