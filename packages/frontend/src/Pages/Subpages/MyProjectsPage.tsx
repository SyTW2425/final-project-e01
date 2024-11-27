import React, { useEffect, useState } from "react";
import { setProjects, setCurrentProject } from '../../slices/sessionSlice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';

const MyProjectsPage: React.FC = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const sessionState = useSelector((state: RootState) => state.session);

  useEffect(() => {
    fetch(import.meta.env.VITE_BACKEND_URL + '/project/user', {
      method: 'GET',
      headers: { authorization: localStorage.getItem('token') || '' },
    })
    .then((res) => res.json())
    .then((data) => {
      if (!data.error) {
        dispatch(setProjects(data.result));
        dispatch(setCurrentProject(data.result[0]));
      } 
    })
    .catch((error) => {
      console.error('Error fetching projects:', error);
    })
    .finally(() => {
      setLoading(false);
    });
  }, [dispatch]);

  return (
    <div className="flex-1 bg-gray-50 w-full h-auto">
      {loading ? (
        <div className="text-center text-gray-700 mt-10">
          <p>Loading projects</p>
        </div>
      ) : 
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
