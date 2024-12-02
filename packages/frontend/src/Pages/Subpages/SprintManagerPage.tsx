import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import Modal from "../../Components/Information/Modal";
import { addSprint, deleteSprint, updateSprint, setCurrentProject, addTask, updateTask, deleteTask } from "../../slices/sessionSlice";

// Tipos de datos (ya definidos)
enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

enum Status {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  DONE = "done",
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

const ProjectSprintsPage: React.FC = () => {
  const dispatch = useDispatch();
  const sprints: Sprint[] = useSelector((state: RootState) => state.session.currentProject?.sprints);
  const currentProject = useSelector((state: RootState) => state.session.currentProject);


  const [currentSprint, setCurrentSprint] = useState<Sprint | null>(null);
  const [currentTask, setCurrentTask] = useState<TaskInterface | null>(null);

  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);

  const [showCreateTaskPopup, setShowCreateTaskPopup] = useState(false);
  const [showUpdateTaskPopup, setShowUpdateTaskPopup] = useState(false);
  const [showTaskPopup, setShowTaskPopup] = useState(false);

  const [showRemoveTaskPopup, setShowRemoveTaskPopup] = useState(false);
  
  const sprintNameRef = useRef<HTMLInputElement>(null);
  const sprintDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const sprintStartDateRef = useRef<HTMLInputElement>(null);
  const sprintEndDateRef = useRef<HTMLInputElement>(null);

  const taskNameRef = useRef<HTMLInputElement>(null);
  const taskDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const taskStartDateRef = useRef<HTMLInputElement>(null);
  const taskEndDateRef = useRef<HTMLInputElement>(null);
  const taskPriorityRef = useRef<HTMLSelectElement>(null);
  const taskStatusRef = useRef<HTMLSelectElement>(null);
  const startUser = useRef<HTMLSelectElement>(null);
  const taskDependency = useRef<HTMLSelectElement>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleUserSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
    setSelectedUsers(selectedOptions);
  };
  

    /**
   * Fetch members of the current project
   */
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
  
          if (!response.ok) throw new Error("Error fetching project members");
  
          const data = await response.json();
          dispatch(setCurrentProject(data.result));
        } catch (error) {
          console.error("Error fetching project members:", error);
        }
      };
  
      fetchProjectMembers();
    }, [currentProject?._id, dispatch]);
  

  return (
    <div className="bg-gray-50 w-full h-auto">
      <h1 className="text-2xl font-bold text-center mt-10">Project Sprints</h1>
      <button
        onClick={() => setShowCreatePopup(true)}

        className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 mx-auto block mt-6"
      >
        Add Sprint
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
        {Array.isArray(sprints) && sprints?.map((sprint) => (
          <div key={sprint._id} className="bg-white shadow-md p-4 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold">{sprint.name}</h2>
        <p className="text-gray-600">{sprint.description}</p>
        <p><strong>Start:</strong> {new Date(sprint.startDate).toLocaleDateString()}</p>
        <p><strong>End:</strong> {new Date(sprint.endDate).toLocaleDateString()}</p>
        <div className="flex space-x-2 mt-4">
          <button onClick={() => { setCurrentSprint(sprint); setShowUpdatePopup(true); }} className="text-blue-500">Editar</button>
          <button onClick={() => { setCurrentSprint(sprint); setShowDeletePopup(true); }} className="text-red-500">Eliminar</button>
        </div>
        {/* Render tasks of the sprint */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Tasks</h3>
          <button onClick={() => { setCurrentSprint(sprint); setShowCreateTaskPopup(true); }} className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600">Add Task</button>
          {Array.isArray(sprint.tasks) && sprint.tasks.map((task) => (
            <div key={task._id} className="bg-gray-100 p-4 rounded-lg border border-gray-200 mt-2 hover:cursor-pointer hover:bg-blue-200 transition-all" >
          <h4 className="text-lg font-semibold">{task.name}</h4>
          <p className="text-gray-600">{task.description}</p>
          <p><strong>Start:</strong> {new Date(task.startDate).toLocaleDateString()}</p>
          <p><strong>End:</strong> {new Date(task.endDate).toLocaleDateString()}</p>
          <div className="flex space-x-2 mt-4">
            <button onClick={() => { setCurrentTask(task); setShowUpdateTaskPopup(true); }} className="text-blue-500">Editar</button>
            <button onClick={() => { setCurrentTask(task); setShowRemoveTaskPopup(true); }} className="text-red-500">Eliminar</button>
            <button onClick={() => { setCurrentTask(task); setShowTaskPopup(true); }} className="text-green-500">Ver</button>
          </div>
            </div>
          ))}
        </div>
      </div>))}
      </div>
      
      {showCreatePopup && (
        <Modal title="Create Sprints" onClose={() => setShowCreatePopup(!showCreatePopup)}
        onSubmit={() => {
          const name = sprintNameRef.current?.value || "";
          const description = sprintDescriptionRef.current?.value || "";
          const startDate = sprintStartDateRef.current?.value || "";
          const endDate = sprintEndDateRef.current?.value || "";

          if (!name || !description || !startDate || !endDate) {
            console.error("All fields are required");
            return;
          }

          fetch(`${import.meta.env.VITE_BACKEND_URL}/project/sprint`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: localStorage.getItem("token") || "",
            },
            body: JSON.stringify({
              sprint : {
              name,
              description,
              startDate: Date.now(),
              endDate,
              tasks: []
              },
              project: currentProject?._id,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              dispatch(addSprint(data.result.sprints.pop()));
              setShowCreatePopup(false);
            })
            .catch((err) => console.error(err));
        }}
      >
        <input name="name" ref={sprintNameRef} placeholder="Name of the sprint" className="border p-2 mb-2 w-full" />
        <textarea name="description" ref={sprintDescriptionRef} placeholder="Descripción" className="border p-2 mb-2 w-full"></textarea>
        <input name="startDate" ref={sprintStartDateRef} type="date" className="border p-2 mb-2 w-full" />
        <input name="endDate" ref={sprintEndDateRef} type="date" className="border p-2 mb-2 w-full" />
      </Modal>
    )}

    {showDeletePopup && (
      <Modal title="Delete Sprint" onClose={() => setShowDeletePopup(!showDeletePopup)} onSubmit={() => {
        if (!currentSprint?._id) {
          console.error("No sprint selected");
          return;
        }

        fetch(`${import.meta.env.VITE_BACKEND_URL}/project/sprint/`, {
          method: "DELETE",
          headers: {
            authorization: localStorage.getItem("token") || "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            project: currentProject?._id,
            sprintID: currentSprint._id,
          }),
        })
          .then((res) => res.json())
          .then((_) => {
            dispatch(deleteSprint(currentSprint._id));
            setShowDeletePopup(false);
          })
          .catch((err) => console.error(err));
      }}>
        <p>Are you sure you want to delete the sprint?</p>
      </Modal>
    )}

    {showUpdatePopup && (
      <Modal title="Update Sprint" onClose={() => setShowUpdatePopup(!showUpdatePopup)} onSubmit={() => {
        if (!currentSprint?._id) {
          console.error("No sprint selected");
          return;
        }

        fetch(`${import.meta.env.VITE_BACKEND_URL}/project/sprint`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token") || "",
          },
          body: JSON.stringify({
            sprintID: currentSprint._id,
            sprint: {
              name: sprintNameRef.current?.value || currentSprint.name,
              description: sprintDescriptionRef.current?.value || currentSprint.description,
              startDate: sprintStartDateRef.current?.value || currentSprint.startDate,
              endDate: sprintEndDateRef.current?.value || currentSprint.endDate,
              tasks : []
            },
            project: currentProject?._id,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            dispatch(updateSprint({...data.result.sprints[data.result.sprintIndex], sprintIndex: data.result.sprintIndex}));
            setShowUpdatePopup(false);
          })
          .catch((err) => console.error(err));
      }}>
        <input name="name" ref={sprintNameRef} placeholder="Name of the sprint" className="border p-2 mb-2 w-full" />
        <textarea name="description" ref={sprintDescriptionRef} placeholder="Descripción" className="border p-2 mb-2 w-full"></textarea>
        <input name="startDate" ref={sprintStartDateRef} type="date" className="border p-2 mb-2 w-full" />
        <input name="endDate" ref={sprintEndDateRef} type="date" className="border p-2 mb-2 w-full" />
      </Modal>
    )}


    {showCreateTaskPopup && (
      <Modal title={"Create Task"} onClose={() => setShowCreateTaskPopup(!showCreateTaskPopup)} onSubmit={() => {
        const name = taskNameRef.current?.value || "";
        const description = taskDescriptionRef.current?.value || "";
        const startDate = taskStartDateRef.current?.value || "";
        const endDate = taskEndDateRef.current?.value || "";
        const priority = taskPriorityRef.current?.value || Priority.LOW;
        const status = taskStatusRef.current?.value || Status.TODO;

        if (!name || !description || !startDate || !endDate) {
          console.error("All fields are required");
          return;
        }
        const taskData = {
          name,
          description,
          startDate,
          endDate,
          priority,
          status,
          dependenciesTasks: [],
          comments: [],
          users: []
        };

        fetch(`${import.meta.env.VITE_BACKEND_URL}/task/project/sprints/${currentProject._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token") || "",
          },
          body: JSON.stringify({
            startDate: taskData.startDate,
            endDate: taskData.endDate,
            name: taskData.name,
            progress: 0,
            description: taskData.description,
            priority: taskData.priority,
            dependenciesTasks: taskDependency.current?.value ? [taskDependency.current?.value] : [],
            status: taskData.status,
            comments: [],
            users: selectedUsers,
            sprintID: currentSprint?._id
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (!data.error) {
              dispatch(addTask({task: data.result, sprintIndex: currentProject.sprints.findIndex((sprint : any) => sprint._id === currentSprint?._id)}));
              setShowUpdatePopup(false);
            }
          })
          .catch((err) => console.error(err));

      setShowCreateTaskPopup(false);
      }}>
        <input name="name" ref={taskNameRef} placeholder="Name of the task" className="border p-2 mb-2 w-full" />
        <textarea name="description" ref={taskDescriptionRef} placeholder="Description" className="border p-2 mb-2 w-full"></textarea>
        <input name="startDate" ref={taskStartDateRef} type="date" className="border p-2 mb-2 w-full" />
        <input name="endDate" ref={taskEndDateRef} type="date" className="border p-2 mb-2 w-full" />
        <select name="priority" ref={taskPriorityRef} className="border p-2 mb-2 w-full">
          <option value={Priority.LOW}>Low</option>
          <option value={Priority.MEDIUM}>Medium</option>
          <option value={Priority.HIGH}>High</option>
        </select>
        <select name="status" ref={taskStatusRef} className="border p-2 mb-2 w-full">
          <option value={Status.TODO}>To Do</option>
          <option value={Status.IN_PROGRESS}>In Progress</option>
          <option value={Status.DONE}>Done</option>
        </select>
        {/* We need to assign any person in the project */}
        
        <select name="user" ref={startUser} className="border p-2 mb-2 w-full">
          {currentProject?.users.map((user : any) => (
            <option key={user._id} value={user._id} onClick={() => setSelectedUsers(selectedUsers + user._id)}>
              {`${user.user.username} (${user.role})`}
            </option>
          ))}
        </select>


        { currentSprint?.tasks && currentSprint.tasks.length > 0 && (
          <>
          <label htmlFor="dependencies">Dependencies</label>
          <select name="dependencies" ref={taskDependency} className="border p-2 mb-2 w-full">
            {currentSprint?.tasks?.map((task) => (
              <option key={Date.now() + Math.random()} value={task._id}>{task.name}</option>
            ))}
          </select>
          </>
        )}
      </Modal>
    )}

      {showUpdateTaskPopup && (
        <Modal title={"Update Task"} onClose={() => setShowUpdateTaskPopup(!showUpdateTaskPopup)} onSubmit={() => {
          if (!currentTask?._id) {
            console.error("No task selected");
            return;
          }

          const name = taskNameRef.current?.value || currentTask.name;
          const description = taskDescriptionRef.current?.value || currentTask.description;
          const startDate = taskStartDateRef.current?.value || currentTask.startDate;
          const endDate = taskEndDateRef.current?.value || currentTask.endDate;
          const priority = taskPriorityRef.current?.value || currentTask.priority;
          const status = taskStatusRef.current?.value || currentTask.status;

          if (!name || !description || !startDate || !endDate) {
            console.error("All fields are required");
            return;
          }

          fetch(`${import.meta.env.VITE_BACKEND_URL}/task/${currentTask._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              authorization: localStorage.getItem("token") || "",
            },
            body: JSON.stringify({
              name,
              description,
              deadline: endDate,
              priority,
              state: status,
              project: currentProject?._id,
              Organization: currentProject?._id,
              assignedTo: selectedUsers,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              dispatch(updateTask({task: data.result, taskIndex: currentProject.sprints.tasks.findIndex((task : any) => task._id === currentTask?._id) , sprintIndex: currentProject.sprints.findIndex((sprint : any) => sprint._id === currentSprint?._id)}));
              setShowUpdateTaskPopup(false);
            })
            .catch((err) => console.error(err));
            {console.log(currentProject.sprints.tasks.findIndex((task : any) => task._id === currentTask?._id))}

        }}>
        <textarea name="description" ref={taskDescriptionRef} placeholder="Description" className="border p-2 mb-2 w-full" defaultValue={currentTask?.description}></textarea>
        <input name="endDate" ref={taskEndDateRef} type="date" className="border p-2 mb-2 w-full" defaultValue={currentTask?.endDate} />
        <select name="priority" ref={taskPriorityRef} className="border p-2 mb-2 w-full" defaultValue={currentTask?.priority}>
          <option value={Priority.LOW}>Low</option>
          <option value={Priority.MEDIUM}>Medium</option>
          <option value={Priority.HIGH}>High</option>
        </select>
        <select name="status" ref={taskStatusRef} className="border p-2 mb-2 w-full" defaultValue={currentTask?.status}>
          <option value={Status.TODO}>To Do</option>
          <option value={Status.IN_PROGRESS}>In Progress</option>
          <option value={Status.DONE}>Done</option>
        </select>
        <select
        multiple
        value={selectedUsers}
        onChange={(e) => handleUserSelection(e)}
        className="border rounded p-2 w-full"
      >
        {currentProject.users.map((user : any) => (
          <option key={user._id} value={user._id}>
            {user.name}
          </option>
        ))}
      </select>
      </Modal>
    )}

    {showTaskPopup && (
      <Modal title="Task" onClose={() => setShowTaskPopup(!showTaskPopup)} onSubmit={() => {}}>
        <h2>{currentTask?.name}</h2>
        <p>{currentTask?.description}</p>
        <p>Start: {currentTask?.startDate}</p>
        <p>End: {currentTask?.endDate}</p>
        <p>Priority: {currentTask?.priority}</p>
        <p>Status: {currentTask?.status}</p>
        <p>Dependencies: {currentTask?.dependenciesTasks.join(", ")}</p>
        <p>Comments: {currentTask?.comments.join(", ")}</p>
        <p>Users: {currentTask?.users.join(", ")}</p>
      </Modal>
    )}

    {showRemoveTaskPopup && (
      <Modal title="Remove Task" onClose={() => setShowRemoveTaskPopup(!showRemoveTaskPopup)} onSubmit={() => {
        if (!currentTask?._id) {
          console.error("No task selected");
          return;
        }

        fetch(`${import.meta.env.VITE_BACKEND_URL}/task/${currentTask._id}`, {
          method: "DELETE",
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        })
          .then((res) => res.json())
          .then((_) => {
            dispatch(deleteTask({taskIndex: currentProject.sprints.tasks.findIndex((task : any) => task._id === currentTask?._id) , sprintIndex: currentProject.sprints.findIndex((sprint : any) => sprint._id === currentSprint?._id)}));
            setShowRemoveTaskPopup(false);
          })
          .catch((err) => console.error(err));
      }

      }>
        <p>Are you sure you want to remove the task?</p>
      </Modal>
    )}
  </div>
)};

export default ProjectSprintsPage;




/**
 * Priority enum
 * @brief Enum that contains the possible priorities of a task
 */
export enum priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

/**
 * Status enum
 * @brief Enum that contains the possible statuses of a task
 */
export enum status {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

