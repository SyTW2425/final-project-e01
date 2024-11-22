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
 * @brief Componente de formulario de inicio de sesión
 */

import React, { useState, useCallback, ChangeEvent } from 'react';
import debounce from 'lodash/debounce';
import SVGComponent from '../Icons/SVGComponent';

const searchIcon = "M21.71,20.29,18,16.61A9,9,0,1,0,16.61,18l3.68,3.68a1,1,0,0,0,1.42,0A1,1,0,0,0,21.71,20.29ZM11,18a7,7,0,1,1,7-7A7,7,0,0,1,11,18Z";

/**
 * Interface of the tyoe if the props of the component
 */
interface SearchComponentProps {
  url: string;
}

interface SearchResult {
  username: string;
  email: string;
  img_path: string;
}


// Componente para representar cada resultado
const SearchResultItem: React.FC<{ result: SearchResult }> = ({ result }) => {
  return (
    <div className="p-2 border-b border-gray-200">
      <div className="flex items-center">
        <img src={result.img_path} alt={result.username} className="w-8 h-8 rounded-full mr-2" />
        <div>
          <div>{result.username}</div>
          <div className="text-sm text-gray-500">{result.email}</div>
        </div>
      </div>
    </div>
  );
};

const SearchComponent : React.FC<SearchComponentProps> = ({url} : {url : string}) => {
  const [search, setSearch] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  
  const fetchResults = async (searchQuery: string) => {
    if (!searchQuery) {
      setResults([]); // Limpiar resultados si la búsqueda está vacía
      return;
    }

    try {
      const response = await fetch(
        `${url}?username=${searchQuery}`,
        {
          method: 'GET',
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        }
      );
      const data: SearchResult[] = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setResults([]); // Limpiar resultados en caso de error
    }
  };

  // Función de búsqueda con debounce
  const debouncedFetchResults = useCallback(debounce((value: string) => fetchResults(value), 1000), []);

  // Maneja los cambios en el campo de búsqueda
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    debouncedFetchResults(value);
  };

  return (
    <div className="hidden md:flex flex-1 justify-center items-center">
      {SVGComponent({ className: 'w-6 h-6 mr-3', d: searchIcon })}
      <input
        type="text"
        id="search"
        name="search"
        placeholder="Buscar"
        value={search}
        onChange={handleInputChange}
        className="w-1/5 focus:w-1/3 px-4 py-2 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-black-500 focus:ring-opacity-50 transition-all"
      />
      
      {/* Contenedor para los resultados */}
      {results.length > 0 && (
        <div className="mt-2 bg-white border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto">
          {results.map((result) => (
            <SearchResultItem key={result.username} result={result} />
          ))}
        </div>
      )}

      {/* Mensaje si no hay resultados */}
      {results.length === 0 && search && (
        <div className="mt-2 text-gray-500">No se encontraron resultados.</div>
      )}
    </div>
  );
};


export default SearchComponent;
