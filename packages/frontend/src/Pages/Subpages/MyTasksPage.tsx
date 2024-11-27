import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface Task {
  _id: string;
  name: string;
  description: string;
  priority: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
}

const MyTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const currentProject: any = useSelector((state: RootState) => state.session.currentProject);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!currentProject?._id) return; // Evita hacer la petición si currentProject es null o no tiene _id

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/task/project/${currentProject._id}`,
          {
            method: "GET",
            headers: {
              authorization: localStorage.getItem("token") || "",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching tasks");
        }
        
        const data = await response.json();
        setTasks(data.result);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [currentProject]);

  return (
    <div className="flex-1 bg-gray-50 w-full h-auto">
      <div className="text-center text-gray-700 mt-10">
        <h1 className="text-2xl font-bold mb-5">My Tasks</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {Array.isArray(tasks) && tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white shadow-md p-4 rounded-lg border border-gray-200"
              >
                <h2 className="text-xl font-semibold">{task.name}</h2>
                <p className="text-gray-600">{task.description}</p>
                <div className="mt-4">
                  <p>
                    <span className="font-bold">Priority:</span> {task.priority}
                  </p>
                  <p>
                    <span className="font-bold">Status:</span> {task.status}
                  </p>
                  <p>
                    <span className="font-bold">Progress:</span> {task.progress}%
                  </p>
                  <p>
                    <span className="font-bold">Start Date:</span>{" "}
                    {new Date(task.startDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-bold">End Date:</span>{" "}
                    {new Date(task.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No tasks found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTasksPage;
