import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { addSprint } from "../../slices/sessionSlice";

// Tipos de datos
enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

enum Status {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

interface TaskInterface {
  _id: string;
  startDate: string;
  endDate: string;
  name: string;
  progress: number;
  description: string;
  priority: Priority;
  dependenciesTasks: string[];
  status: Status;
  comments: string[];
  users: string[];
}

interface Sprint {
  _id?: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  tasks?: TaskInterface[];
}

// Componente para cada tarea
interface TaskProps {
  task: TaskInterface;
  onDetails: () => void;
}

const TaskItem: React.FC<TaskProps> = ({ task, onDetails }) => (
  <div className="border rounded-lg p-2 my-2 shadow-sm">
    <h3 className="font-semibold">{task.name}</h3>
    <p className="text-sm">Estado: {task.status}</p>
    <div className="flex space-x-2 mt-2">
      <button onClick={onDetails} className="text-blue-500">Detalles</button>
      <button onClick={() => console.log("Editar tarea")} className="text-green-500">Editar</button>
      <button onClick={() => console.log("Eliminar tarea")} className="text-red-500">Eliminar</button>
    </div>
  </div>
);

const ProjectSprintsPage: React.FC = () => {
  const dispatch = useDispatch();
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [currentSprint, setCurrentSprint] = useState<Sprint | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskInterface | null>(null);
  const [showTaskPopup, setShowTaskPopup] = useState(false);
  
  const sprints: Sprint[] = useSelector((state: RootState) => state.session.currentProject?.sprints);
  const currentProject = useSelector((state: RootState) => state.session.currentProject);

  // Crear Sprint
  const handleCreateSprint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSprint || !currentProject?._id) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project/sprint`, {
        method: "POST",
        headers: {
          authorization: localStorage.getItem("token") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ project: currentProject._id, sprint: currentSprint })
      });

      if (!response.ok) throw new Error("Error creating sprint");

      const data = await response.json();
      dispatch(addSprint(data.sprint));
      setShowCreatePopup(false);
      setCurrentSprint(null);
    } catch (error) {
      console.error("Error creating sprint:", error);
    }
  };

  const openCreatePopup = () => {
    setCurrentSprint({ name: "", description: "", startDate: "", endDate: "" });
    setShowCreatePopup(true);
  };

  const openUpdatePopup = (sprint: Sprint) => {
    setCurrentSprint(sprint);
    setShowUpdatePopup(true);
  };

  return (
    <div className="bg-gray-50 w-full h-auto">
      <h1 className="text-2xl font-bold text-center mt-10">Project Sprints</h1>
      <button onClick={openCreatePopup} className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 mx-auto block mt-6">
        Add Sprint
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
        {sprints?.map((sprint) => (
          <div key={sprint._id} className="bg-white shadow-md p-4 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold">{sprint.name}</h2>
            <p className="text-gray-600">{sprint.description}</p>
            <p><strong>Start:</strong> {new Date(sprint.startDate).toLocaleDateString()}</p>
            <p><strong>End:</strong> {new Date(sprint.endDate).toLocaleDateString()}</p>
            <div className="flex space-x-2 mt-4">
              <button onClick={() => openUpdatePopup(sprint)} className="text-blue-500">Editar</button>
              <button onClick={() => console.log("Eliminar sprint")} className="text-red-500">Eliminar</button>
            </div>

            {sprint.tasks?.length ? sprint.tasks.map((task) => (
              <TaskItem key={task._id} task={task} onDetails={() => { setSelectedTask(task); setShowTaskPopup(true); }} />
            )) : <p className="text-gray-500">No hay tareas en este sprint.</p>}
          </div>
        ))}
      </div>
      
      {/* Create Popup */}
      {showCreatePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          {/* Formulario de Sprint */}
        </div>
      )}
    </div>
  );
};

export default ProjectSprintsPage;
