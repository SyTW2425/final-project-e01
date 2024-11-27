import React from 'react';

interface ModalProps {
  title: string;
  children: React.ReactNode; // Formulario o contenido del modal
  onClose: () => void; // Lógica para cerrar el modal
  onSubmit?: () => void; // Lógica para manejar el submit (opcional)
}

const Modal: React.FC<ModalProps> = ({ title, children, onClose, onSubmit }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-md p-6 w-full max-w-md md:max-w-lg lg:max-w-xl mx-4 md:mx-auto max-h-screen overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Previene cerrar al hacer clic dentro del modal
      >
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (onSubmit) onSubmit(); // Llama a la lógica de envío, si se proporciona
          }}
        >
          {children}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={onClose}
            >
              Cancelar
            </button>
            {onSubmit && (
              <button
                type="submit"
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Guardar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
