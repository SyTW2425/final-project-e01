/**
 * Proyecto Final: Aplicación gestora de proyectos
 * Asignatura: Sistemas y Tecnologías Web
 * Grado en Ingeniería Informática
 * Universidad de La Laguna
 *
 * @author Pablo Rodríguez de la Rosa
 * @author Javier Almenara Herrera
 * @author Omar Suárez Doro
 * @version 1.0
 * @date 18/11/2024
 * @brief Componente de diagrama de Gantt
 */

import React, { useState, useEffect } from "react";
import { Gantt, Task } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store"

const BACKEND_GET_TASKS_PROJECT_URL = import.meta.env.VITE_BACKEND_URL + "/task/project/tasks";

const GanttDiagram: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const currentProject: any = useSelector((state: RootState) => state.session.currentProject);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(BACKEND_GET_TASKS_PROJECT_URL + `/${currentProject?._id}`,  {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        const mappedTasks: Task[] = data?.result.map((task: any) => ({
          ...task,
          start: new Date(task.startDate),
          end: new Date(task.endDate),
          progress: task.progress || 0,
        }));
        console.log(mappedTasks);
        setTasks(mappedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, currentProject);
  return (
    <div className="h-screen">
      {tasks.length > 0 ? <Gantt tasks={tasks} /> : <p>Cargando tareas...</p>}
    </div>
  );
};

export default GanttDiagram;