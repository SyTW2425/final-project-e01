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

const getPrioritySVG = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "high":
      return (
        <svg
          className="w-6 h-6 text-red-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2a10 10 0 110 20 10 10 0 010-20z"
          />
          <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "medium":
      return (
        <svg
          className="w-6 h-6 text-orange-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2a10 10 0 110 20 10 10 0 010-20z"
          />
          <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "low":
      return (
        <svg
          className="w-6 h-6 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2a10 10 0 110 20 10 10 0 010-20z"
          />
        </svg>
      );
    default:
      return null;
  }
};

const KanbanBoardPage: React.FC = () => {
  const sessionState = useSelector((state: RootState) => state.session);
  const [kanbanData, setKanbanData] = useState<KanbanData | null>(null);
  const [loading, setLoading] = useState(true);

  const formatTasksToKanban = (tasks: any[]) => {
    const formattedTasks: Record<string, any> = {};
    const columns = initializeColumns();
    const columnOrder = ["column-todo", "column-in-progress"];
    tasks.forEach((task) => {
      const columnId = task.status === "todo" ? "column-todo" : "column-in-progress";

      const taskId = `${task._id}`;
      formattedTasks[taskId] = {
        id: taskId,
        name: task.name,
        state: task.status,
        priority: task.priority,
        assignedTo: {
          name: task.assignedToName,
          avatar: getPrioritySVG(task.priority),
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
        const response = await fetch(
          `${BACKEND_GET_PROJECTS_TASKS_URL}/${sessionState.currentProject._id}/notdone`,
          {
            method: "GET",
            headers: {
              content: "application/json",
              authorization: localStorage.getItem("token") || "",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Error in request: ${response.statusText}`);
        }
        const tasksData = await response.json();
        setKanbanData(formatTasksToKanban(tasksData.result));
      } catch (error) {
        console.error("Error loading tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKanbanData();
  }, [sessionState]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!kanbanData) {
    return <div>No data available.</div>;
  }

  const handleDataUpdate = async (updatedData: KanbanData) => {
    try {
      setKanbanData(updatedData);
      await Promise.all(
        Object.values(updatedData.tasks).map((task: any) =>
          fetch(`${BACKEND_UPDATE_TASKS_URL}/${task.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token") || "",
            },
            body: JSON.stringify({ status: task.state }),
          })
        )
      );
      console.log("Data successfully updated in the backend.");
    } catch (error) {
      console.error("Error updating Kanban data:", error);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 z-10">
      <KanbanBoard initialData={kanbanData} onUpdate={handleDataUpdate} />
    </div>
  );
};

export default KanbanBoardPage;
