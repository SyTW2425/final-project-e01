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
 * @brief Componente de sección de información.
 */

import React from 'react';

interface InfoSectionProps {
  id: string
  title: string;
  paragraphs: string[];
  image: string;
  position: 'left' | 'right';
}

const InfoSection: React.FC<InfoSectionProps> = ({ id, title, paragraphs, image, position }) => {
  const isLeft = position === 'left';
  
  return (
    <div id={id} className="pt-4 flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-700 to-blue-500 text-white px-6">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl bg-white text-black rounded-lg shadow-xl overflow-hidden p-8">
        {isLeft && (
          <div className="md:w-1/2 p-6 flex justify-center">
            <img
              src={image}
              className="w-full max-w-sm border-4 border-blue-700 rounded-lg shadow-md"
              alt={title}
            />
          </div>
        )}
        <div className="md:w-1/2 p-6">
          <h2 className="text-5xl font-extrabold mb-4 text-blue-700 drop-shadow-lg">
            {title}
          </h2>
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-lg leading-relaxed mt-4">
              {paragraph}
            </p>
          ))}
        </div>
        {!isLeft && (
          <div className="md:w-1/2 p-6 flex justify-center">
            <img
              src={image}
              className="w-full max-w-sm border-4 border-blue-700 rounded-lg shadow-md"
              alt={title}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoSection;
