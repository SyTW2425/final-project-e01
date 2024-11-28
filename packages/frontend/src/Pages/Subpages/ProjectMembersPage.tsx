import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setCurrentProject } from "../../slices/sessionSlice";

const ProjectMembersPage: React.FC = () => {
  const dispatch = useDispatch();
  const sessionState = useSelector((state: RootState) => state.session);
  let currentProject = sessionState.currentProject;

  // We need to make a request to the backend to get the project members
  useEffect(() => {
    const fetchProjectMembers = async () => {
      if (!currentProject?._id) return;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/project/id/${currentProject._id}`,
          {
            method: "GET",
            headers: {
              authorization: localStorage.getItem("token") || "",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching project members");
        }

        const data = await response.json();
        dispatch(setCurrentProject(data.result));
        currentProject = data.result;
        console.log(currentProject);

      } catch (error) {
        console.error("Error fetching project members:", error);
      }
    };
    fetchProjectMembers();
  });

  return (
    <div className="flex flex-col items-center bg-gray-50 w-full h-auto p-6">
      {currentProject ? (
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Project Members
          </h1>
          {currentProject.users && currentProject.users.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProject.users.map((user: any, index: number) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:-translate-y-1 transition-all hover:shadow-lg"
                >
                  <img
                    src={import.meta.env.VITE_BACKEND_URL + '/userImg/' + user.user.img_path}
                    alt={`${user.user.username}'s avatar`}
                    className="w-24 h-24 rounded-full mb-4"
                  />
                  <h2 className="text-xl font-semibold text-gray-800">
                    {user.user.username}
                  </h2>
                  <p className="text-gray-600">{user.user.email}</p>
                  <span className="mt-2 px-4 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-700 mt-10">
              <p>No members in this project yet 😅</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-700 mt-10">
          <p>No project selected 😅</p>
        </div>
      )}
    </div>
  );
};

export default ProjectMembersPage;
