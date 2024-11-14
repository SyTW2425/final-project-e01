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
 * @date 28/10/2024
 * @brief Componente principal del cuadro de mandos
 */

import React from 'react';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';

const MainContent: React.FC = () => {
  const token = useSelector((state: RootState) => state.session.token);
  return (
    <div className="flex-grow p-8">
      <h2 className="text-2xl font-semibold mb-4">Tus espacios de trabajo</h2>
      <p className="mb-4 text-gray-600">Tu token es: {token}</p>
      <div className="bg-gray-200 p-6 rounded-lg">
        <h3 className="text-lg font-semibold">SYTW-2024/25</h3>
        <div className="mt-4">
          <h4 className="font-medium">MIEMBROS</h4>
          <ul className="list-disc ml-6">
            <li>Javier Almenara</li>
            <li>Pablo Rodríguez</li>
            <li>Omar Suárez</li>
          </ul>
        </div>
        <div className="mt-6">
          <h4 className="font-medium">TABLEROS</h4>
          <button className="mt-2 bg-white border border-gray-300 p-4 rounded-lg text-gray-600">
            Crea un nuevo tablero
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainContent;

