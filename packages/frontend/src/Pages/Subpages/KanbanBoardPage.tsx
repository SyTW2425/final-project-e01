import React, { useEffect, useState } from "react";
import KanbanBoard from '../../Components/Graphs/KanbanBoard';
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const BACKEND_GET_PROJECTS_TASKS_URL = `${import.meta.env.VITE_BACKEND_URL}/task/project`;
const BACKEND_UPDATE_TASKS_URL = `${import.meta.env.VITE_BACKEND_URL}/task/update`;


interface KanbanData {
  tasks: Record<string, any>;
  columns: Record<string, any>;
  columnOrder: string[];
}

enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
}

const initializeColumns = (): Record<string, { id: string; title: TaskStatus; taskIds: string[] }> => ({
  "column-todo": {
    id: "column-todo",
    title: TaskStatus.TODO,
    taskIds: [],
  },
  "column-in-progress": {
    id: "column-in-progress",
    title: TaskStatus.IN_PROGRESS,
    taskIds: [],
  },
});

const KanbanBoardPage: React.FC = () => {
  const sessionState = useSelector((state: RootState) => state.session);
  const [kanbanData, setKanbanData] = useState<KanbanData | null>(null);
  const [loading, setLoading] = useState(true);

  const formatTasksToKanban = (tasks: any[]) => {
    const formattedTasks: Record<string, any> = {};
    const columns = initializeColumns();
    const columnOrder = ["column-todo", "column-in-progress"]
    tasks.forEach((task) => {
      const columnId = task.status === "todo" ? "column-todo" : "column-in-progress";
      

      const taskId = `${task._id}`;
      formattedTasks[taskId] = {
        id: taskId,
        name: task.name,
        state: task.status,
        assignedTo: {
          name: task.assignedToName,
          avatar: task.assignedToAvatar,
        },
        description: task.description,
      };
      columns[columnId].taskIds.push(taskId);
    });
    return {
      tasks: formattedTasks,
      columns,
      columnOrder,
    };
  };

  useEffect(() => {
    const fetchKanbanData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_GET_PROJECTS_TASKS_URL}/${sessionState.currentProject._id}/notdone`, {
          method: "GET",
          headers: {
            content: "application/json",
            authorization: localStorage.getItem("token") || "",
          },
        });
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        const tasksData = await response.json();
        setKanbanData(formatTasksToKanban(tasksData.result));
      } catch (error) {
        console.error("Error al cargar las tareas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKanbanData();
  }, [sessionState]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!kanbanData) {
    return <div>No hay datos disponibles.</div>;
  }

  const handleDataUpdate = async (updatedData: KanbanData) => {
  try {
    // Actualiza el estado local primero para una respuesta visual inmediata.
    setKanbanData(updatedData);
    console.log(updatedData.tasks)
    // Actualiza cada tarea individualmente en el backend.
    await Promise.all(
      Object.values(updatedData.tasks).map((task: any) => {
        fetch(`${BACKEND_UPDATE_TASKS_URL}/${task.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token") || "",
          },
          body: JSON.stringify({ status: task.state }),
        })
      })
    );

    console.log("Datos actualizados en el backend con éxito");
  } catch (error) {
    console.error("Error al actualizar los datos del Kanban:", error);
  }
};

  return (
    <div className="flex-1 bg-gray-50 z-10">
      <KanbanBoard initialData={kanbanData} onUpdate={handleDataUpdate} />
    </div>
  );
};

export default KanbanBoardPage;