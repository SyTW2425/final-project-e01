import React from "react";
import { setCurrentProject } from '../../slices/sessionSlice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';

const MyProjectsPage: React.FC = () => {
  const dispatch = useDispatch();
  const sessionState = useSelector((state: RootState) => state.session);


  return (
    <div className="flex-1 bg-gray-50 w-full h-auto">
      {
      (sessionState.projects && sessionState.projects.length > 0 ? 
        (sessionState.projects.map((project: any) => (
          <div 
            key={project.organization} 
            className="bg-white rounded-lg shadow-md p-4 m-4 cursor-pointer"
            onClick={() => dispatch(setCurrentProject(project))}
          >
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p>{project.description}</p>
          </div>
        ))) : 
        (
        <div className="text-center text-gray-700 mt-10">
          <p>You don't belong to a project yet 😅</p>
        </div>
        )
      )}
    </div>
  );
};

export default MyProjectsPage;
