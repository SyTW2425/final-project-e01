import React from "react";
import { setCurrentProject } from '../../slices/sessionSlice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';

const MyProjectsPage: React.FC = () => {
  const sessionState = useSelector((state: RootState) => state.session);
  const dispatch = useDispatch();

  return (
    <div className="flex-1 bg-gray-50 w-full h-auto">
      {/* We need to render the proyects of the user, it they are clicked, the currentproject in redux state must change to the selected project */}
      {sessionState.projects?.map((project: any) => {
        return (
          <div key={project._id} className="bg-white rounded-lg shadow-md p-4 m-4 cursor-pointer" onClick={() => dispatch(setCurrentProject(project))}>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p>{project.description}</p>
          </div>
        );
      })}
    </div>
  );
}

export default MyProjectsPage;