import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setCurrentProject } from "../../slices/sessionSlice";
import { FaEdit, FaTrash } from "react-icons/fa";

/**
 * Enum of roles
 */
export enum Role {
  DEVELOPER = 'developer',
  PRODUCT_OWNER = 'product_owner',
  SCRUM_MASTER = 'scrum_master',
  ADMIN = 'admin',
  OWNER = 'owner',
}


const ProjectMembersPage: React.FC = () => {
  const dispatch = useDispatch();
  const sessionState = useSelector((state: RootState) => state.session);
  const currentProject = sessionState.currentProject;

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [newRole, setNewRole] = useState<Role | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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
      } catch (error) {
        console.error("Error fetching project members:", error);
      }
    };
    fetchProjectMembers();
  }, [currentProject?._id, dispatch]);

  const handleEditRole = async () => {
    if (!selectedUser || !newRole) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/project/${currentProject._id}/update-role`,
        {
          method: "PATCH",
          headers: {
            authorization: localStorage.getItem("token") || "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: selectedUser.user._id, newRole }),
        }
      );

      if (!response.ok) {
        throw new Error("Error updating role");
      }

      const updatedProject = await response.json();
      dispatch(setCurrentProject(updatedProject.result));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/project/${currentProject._id}/remove-member`,
        {
          method: "DELETE",
          headers: {
            authorization: localStorage.getItem("token") || ""
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!response.ok) {
        throw new Error("Error removing user");
      }

      const updatedProject = await response.json();
      dispatch(setCurrentProject(updatedProject.result));
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  const canEdit = (currentUserRole: Role): boolean => currentUserRole === Role.ADMIN || currentUserRole === Role.OWNER;


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
                  className="bg-white rounded-lg shadow-md p-4 relative hover:shadow-lg transition-all"
                >
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/userImg/${user.user.img_path}`}
                    alt={`${user.user.username}'s avatar`}
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  <h2 className="text-xl font-semibold text-gray-800 text-center">
                    {user.user.username}
                  </h2>
                  <p className="text-gray-600 text-center">
                    {user.user.email}
                  </p>
                  <span className="mt-2 px-4 py-1 text-sm rounded-full bg-blue-100 text-blue-800 block text-center">
                    {user.role}
                  </span>
                  <br/>
                  {/* Edit & Remove Icons */}
                  {canEdit(currentProject.users.find((u: any) => u.user._id === sessionState.userObject._id)?.role || "") && user.user.email !== sessionState.userObject.email && (
                    <div className="absolute bottom-2 right-2 flex space-x-2">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => {
                          setSelectedUser(user);
                          setNewRole(user.role);
                          setIsEditing(true);
                        }}
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveUser(user.user._id)}
                      >
                        <FaTrash size={20} />
                      </button>
                    </div>
                  )}
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

      {/* Edit Role Popup */}
      {isEditing && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Role</h2>
            <select
              value={newRole || ""}
              onChange={(e) => setNewRole(e.target.value as Role)}
              className="w-full p-2 border rounded-lg"
            >
              {Object.values(Role).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleEditRole}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectMembersPage;
