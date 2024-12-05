import { format } from 'date-fns';
import { RootState } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import Modal from "../../Components/Information/Modal";
import React, { useRef, useState, useEffect } from "react";
import { addSprint, deleteSprint, updateSprint, setCurrentProject, addTask, updateTask, deleteTask } from "../../slices/sessionSlice";
import { da } from 'date-fns/locale';
import { errorNotification, successNotification } from '../../Components/Information/Notification';

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
      <div className="bg-gray-50 w-full h-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Project Sprints</h1>
        <button
          onClick={() => setShowCreatePopup(true)}
          className="bg-blue-500 text-white px-6 py-3 rounded shadow hover:bg-blue-600 block mx-auto"
        >
          Add Sprint
        </button>
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {Array.isArray(sprints) &&
            sprints.map((sprint) => (
              <div
                key={Date.now() + Math.random()}
                className="bg-white shadow rounded-lg p-6 hover:shadow-md transition"
              >
                <h2 className="text-xl font-semibold text-gray-700 mb-2">{sprint.name}</h2>
                <p className="text-gray-600 mb-4">{sprint.description}</p>
                <p>
                  <strong>Start:</strong> {new Date(sprint.startDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>End:</strong> {new Date(sprint.endDate).toLocaleDateString()}
                </p>
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => {
                      setCurrentSprint(sprint);
                      setShowUpdatePopup(true);
                    }}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setCurrentSprint(sprint);
                      setShowDeletePopup(true);
                    }}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-800">Tasks</h3>
                  <button
                    onClick={() => {
                      setCurrentSprint(sprint);
                      setShowCreateTaskPopup(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded shadow mt-2"
                  >
                    Add Task
                  </button>
                  {sprint.tasks?.map((task) => (
                    <div
                      key={Date.now() + Math.random()}
                      className="bg-gray-100 p-4 rounded-lg shadow mt-4 hover:shadow-lg transition"
                      onClick={() => {setCurrentTask(task)}}
                    >
                      <h4 className="text-lg font-semibold text-gray-700">{task.name}</h4>
                      <p className="text-gray-600">{task.description}</p>
                      <p>
                        <strong>Start:</strong> {new Date(task.startDate).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>End:</strong> {new Date(task.endDate).toLocaleDateString()}
                      </p>
                      <div className="flex gap-4 mt-4">
                        <button
                          onClick={() => {
                            setCurrentTask(task);
                            setShowUpdateTaskPopup(true);
                          }}
                          className="text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setCurrentTask(task);
                            setShowRemoveTaskPopup(true);
                          }}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => {
                            setCurrentTask(task);
                            setShowTaskPopup(true);
                          }}
                          className="text-green-500 hover:underline"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
      <Modal
        title={"Create Task"}
        onClose={() => setShowCreateTaskPopup(false)}
        onSubmit={() => {
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

          fetch(`${import.meta.env.VITE_BACKEND_URL}/task/project/sprints/${currentProject._id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: localStorage.getItem("token") || "",
            },
            body: JSON.stringify({
              startDate,
              endDate,
              name,
              progress: 0,
              description,
              priority,
              dependenciesTasks: taskDependency.current?.value
                ? [taskDependency.current?.value]
                : [],
              status,
              comments: [],
              users: selectedUsers,
              sprintID: currentSprint?._id,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (!data.error) {
                dispatch(
                  addTask({
                    task: data.result,
                    sprintIndex: currentProject.sprints.findIndex(
                      (sprint: any) => sprint._id === currentSprint?._id
                    ),
                  })
                );
                setSelectedUsers([]);
                setShowCreateTaskPopup(false);
              }
            })
            .catch((err) => console.error(err));
        }}
      >
        <input
          name="name"
          ref={taskNameRef}
          placeholder="Name of the task"
          className="border p-2 mb-2 w-full"
        />
        <textarea
          name="description"
          ref={taskDescriptionRef}
          placeholder="Description"
          className="border p-2 mb-2 w-full"
        ></textarea>
        <input
          name="startDate"
          ref={taskStartDateRef}
          type="date"
          className="border p-2 mb-2 w-full"
        />
        <input
          name="endDate"
          ref={taskEndDateRef}
          type="date"
          className="border p-2 mb-2 w-full"
        />
        <select
          name="priority"
          ref={taskPriorityRef}
          className="border p-2 mb-2 w-full"
        >
          <option value={Priority.LOW}>Low</option>
          <option value={Priority.MEDIUM}>Medium</option>
          <option value={Priority.HIGH}>High</option>
        </select>
        <select
          name="status"
          ref={taskStatusRef}
          className="border p-2 mb-2 w-full"
        >
          <option value={Status.TODO}>To Do</option>
          <option value={Status.IN_PROGRESS}>In Progress</option>
          <option value={Status.DONE}>Done</option>
        </select>
        <label htmlFor="users" className="block font-semibold">
          Assign Users:
        </label>
        <select
          name="users"
          multiple
          className="border p-2 mb-2 w-full"
        >
          {currentProject?.users.map((user: any) => (
            <option
              key={Date.now() + Math.random()}
              onClick={() => {
                setSelectedUsers((prev) => prev.includes(user.user._id) ? prev.filter((id) => id !== user.user._id) : [...prev, user.user._id]);
              }}
            >
              {`${user.user.username} (${user.role})`}
            </option>
          ))}
        </select>
      </Modal>
    )}


    {showUpdateTaskPopup && (
      <Modal
        title={"Update Task"}
        onClose={() => setShowUpdateTaskPopup(false)}
        onSubmit={() => {
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

          fetch(`${import.meta.env.VITE_BACKEND_URL}/task/update/${currentTask._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              authorization: localStorage.getItem("token") || "",
            },
            body: JSON.stringify({
              startDate,
              endDate,
              progress: currentTask.progress || 0,
              description,
              priority,
              dependenciesTasks: taskDependency.current?.value
                ? [taskDependency.current?.value]
                : currentTask.dependenciesTasks,
              status,
              comments: currentTask.comments || [],
              users: selectedUsers.length > 0 ? selectedUsers : currentTask.users,
              sprintID: currentSprint?._id,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (!data.error) {
                window.location.reload();
                setSelectedUsers([]);
                setShowUpdateTaskPopup(false);
              }
            })
            .catch((err) => errorNotification("Error updating task: " + err));
        }}
      >

        <textarea
          name="description"
          ref={taskDescriptionRef}
          placeholder="Description"
          className="border p-2 mb-2 w-full"
          defaultValue={currentTask?.description}
        ></textarea>
        <input
          name="startDate"
          ref={taskStartDateRef}
          type="date"
          className="border p-2 mb-2 w-full"
          defaultValue={currentTask?.startDate}
        />
        <input
          name="endDate"
          ref={taskEndDateRef}
          type="date"
          className="border p-2 mb-2 w-full"
          defaultValue={currentTask?.endDate}
        />
        <select
          name="priority"
          ref={taskPriorityRef}
          className="border p-2 mb-2 w-full"
          defaultValue={currentTask?.priority}
        >
          <option value={Priority.LOW}>Low</option>
          <option value={Priority.MEDIUM}>Medium</option>
          <option value={Priority.HIGH}>High</option>
        </select>
        <select
          name="status"
          ref={taskStatusRef}
          className="border p-2 mb-2 w-full"
          defaultValue={currentTask?.status}
        >
          <option value={Status.TODO}>To Do</option>
          <option value={Status.IN_PROGRESS}>In Progress</option>
          <option value={Status.DONE}>Done</option>
        </select>
        <label htmlFor="users" className="block font-semibold">
          Assign Users:
        </label>
        <select
          name="users"
          multiple
          value={selectedUsers.length > 0 ? selectedUsers : currentTask?.users || []}
          onChange={(e) => handleUserSelection(e)}
          className="border p-2 mb-2 w-full"
        >
          {currentProject?.users.map((user: any) => (
            <option key={Date.now() + Math.random()} value={user.user._id}>
              {`${user.user.username} (${user.role})`}
            </option>
          ))}
        </select>
      </Modal>
    )}



      {showTaskPopup && (
        <Modal
          title="Task Details"
          onClose={() => setShowTaskPopup(!showTaskPopup)}
        >
          <div className="p-6 space-y-6 bg-blue-50 rounded-lg shadow">
            {/* Title and description */}
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-blue-600">{currentTask?.name}</h2>
              <p className="text-base text-gray-600 mt-2">{currentTask?.description}</p>
            </div>

            {/* Key Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-md border border-blue-200">
                <p className="text-gray-700 text-sm">
                  <span className="font-medium text-blue-600">Start Date:</span>{" "}
                  {currentTask?.startDate ? format(new Date(currentTask.startDate), "MMMM dd, yyyy") : "N/A"}
                </p>
                <p className="text-gray-700 text-sm mt-2">
                  <span className="font-medium text-blue-600">End Date:</span>{" "}
                  {currentTask?.endDate ? format(new Date(currentTask.endDate), "MMMM dd, yyyy") : "N/A"}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md border border-blue-200">
                <p className="text-gray-700 text-sm">
                  <span className="font-medium text-blue-600">Priority:</span>{" "}
                  <span
                    className={`inline-block px-2 py-1 rounded text-white ${
                      currentTask?.priority === "high"
                        ? "bg-red-500"
                        : currentTask?.priority === "medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  >
                    {currentTask?.priority}
                  </span>
                </p>
                <p className="text-gray-700 text-sm mt-2">
                  <span className="font-medium text-blue-600">Status:</span> {currentTask?.status}
                </p>
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white p-4 rounded-lg shadow-md border border-blue-200">
              <h3 className="text-lg font-medium text-blue-600 mb-2">Comments</h3>
              <p className="text-gray-700 text-sm">
                {currentTask && currentTask.comments && currentTask?.comments.length > 0 ? currentTask.comments.join(", ") : "No comments"}
              </p>
            </div>
          </div>
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
            successNotification("Task removed successfully");
            //synchroneous call to force the page to reload after 2 seconds
            setTimeout(() => {
              window.location.reload();
            }, 1000);
            setShowRemoveTaskPopup(false);
          })
          .catch((err) => errorNotification("Error removing task: " + err));
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

