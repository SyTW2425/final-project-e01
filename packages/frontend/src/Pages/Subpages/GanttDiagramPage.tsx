import React from "react";
import GanttDiagram from '../../Components/Graphs/GanttDiagram';

const GanttDiagramPage: React.FC = () => {
  return (
    <div className="max-h-screen max-w-[86vw] bg-gray-50 z-10 "> 
      <GanttDiagram />
    </div>
  );
}

export default GanttDiagramPage;