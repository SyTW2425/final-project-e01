import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface Sprint {
  _id?: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

const ProjectSprintsPage: React.FC = () => {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentSprint, setCurrentSprint] = useState<Sprint | null>(null);
  const currentProject: any = useSelector((state: RootState) => state.session.currentProject);

  // Fetch Sprints
  useEffect(() => {
    const fetchSprints = async () => {
      if (!currentProject?._id) return;

      const url = `/api/projects/${currentProject._id}/sprints`; // Sustituir URL
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        });

        if (!response.ok) {
          throw new Error("Error fetching sprints");
        }

        const data = await response.json();
        setSprints(data.sprints || []);
      } catch (error) {
        console.error("Error fetching sprints:", error);
      }
    };

    fetchSprints();
  }, [currentProject]);

  // Handle popup open
  const openPopup = (sprint: Sprint | null = null) => {
    setCurrentSprint(sprint);
    setShowPopup(true);
  };

  // Handle popup close
  const closePopup = () => {
    setCurrentSprint(null);
    setShowPopup(false);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSprint) return;

    const url = currentSprint._id
      ? `/api/projects/${currentProject._id}/sprints/${currentSprint._id}` // Update URL
      : `/api/projects/${currentProject._id}/sprints`; // Create URL

    try {
      const response = await fetch(url, {
        method: currentSprint._id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token") || "",
        },
        body: JSON.stringify(currentSprint),
      });

      if (!response.ok) {
        throw new Error("Error saving sprint");
      }

      const data = await response.json();
      if (currentSprint._id) {
        // Update existing sprint
        setSprints((prev) =>
          prev.map((sprint) =>
            sprint._id === currentSprint._id ? { ...currentSprint, ...data.sprint } : sprint
          )
        );
      } else {
        // Add new sprint
        setSprints((prev) => [...prev, data.sprint]);
      }

      closePopup();
    } catch (error) {
      console.error("Error saving sprint:", error);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 w-full h-auto">
      <div className="text-center text-gray-700 mt-10">
        <h1 className="text-2xl font-bold mb-5">Project Sprints</h1>
        {sprints.length === 0 ? (
          <p className="text-gray-600">No hay sprints por el momento.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
            {sprints.map((sprint) => (
              <div
                key={sprint._id}
                className="bg-white shadow-md p-4 rounded-lg border border-gray-200"
              >
                <h2 className="text-xl font-semibold">{sprint.name}</h2>
                <p className="text-gray-600">{sprint.description}</p>
                <div className="mt-4">
                  <p>
                    <span className="font-bold">Start Date:</span>{" "}
                    {new Date(sprint.startDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-bold">End Date:</span>{" "}
                    {new Date(sprint.endDate).toLocaleDateString()}
                  </p>
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => openPopup(sprint)}
                      className="text-blue-500"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => console.log(`Eliminar sprint con ID: ${sprint._id}`)}
                      className="text-red-500"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={() => openPopup()}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600"
        >
          Añadir Sprint
        </button>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-1/3">
            <h2 className="text-xl font-bold mb-4">
              {currentSprint?._id ? "Actualizar Sprint" : "Crear Sprint"}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nombre"
                value={currentSprint?.name || ""}
                onChange={(e) =>
                  setCurrentSprint((prev) => ({
                    ...prev!,
                    name: e.target.value,
                  }))
                }
                className="w-full mb-4 p-2 border rounded"
                required
              />
              <textarea
                placeholder="Descripción"
                value={currentSprint?.description || ""}
                onChange={(e) =>
                  setCurrentSprint((prev) => ({
                    ...prev!,
                    description: e.target.value,
                  }))
                }
                className="w-full mb-4 p-2 border rounded"
                required
              />
              <input
                type="date"
                value={currentSprint?.startDate || ""}
                onChange={(e) =>
                  setCurrentSprint((prev) => ({
                    ...prev!,
                    startDate: e.target.value,
                  }))
                }
                className="w-full mb-4 p-2 border rounded"
                required
              />
              <input
                type="date"
                value={currentSprint?.endDate || ""}
                onChange={(e) =>
                  setCurrentSprint((prev) => ({
                    ...prev!,
                    endDate: e.target.value,
                  }))
                }
                className="w-full mb-4 p-2 border rounded"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closePopup}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSprintsPage;
