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

/**
 * Interface of the tyoe if the props of the component
 */
interface SearchComponentProps {
  url: string;
}

interface SearchResult {
  username: string;
  email: string;
}


// Componente para representar cada resultado
const SearchResultItem: React.FC<{ result: SearchResult }> = ({ result }) => (
  <div className="p-2 border-b border-gray-200">
    {result.username} - {result.email}
  </div>
);

const SearchComponent : React.FC<SearchComponentProps> = ({url} : {url : string}) => {
  const [search, setSearch] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  
  const fetchResults = async (searchQuery: string) => {
    try {
      const response = await fetch(
        `${url}?email=${searchQuery}&username=${searchQuery}`,
        {
          method: 'GET',
          headers: {
            Authorization: `${localStorage.getItem('token')}`
          }
        }
      );
      const data: SearchResult[] = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  // Función de búsqueda con debounce
  const debouncedFetchResults = useCallback( debounce((value: string) => fetchResults(value), 1000), []);

  // Maneja los cambios en el campo de búsqueda
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    debouncedFetchResults(value);
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <input
          type="text"
          id="search"
          name="search"
          value={search}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {/* Contenedor para los resultados */}
        {results.length > 0 && (
          <div className="mt-2 bg-white border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto">
            {results.map((result) => (
              <SearchResultItem key={result.username} result={result} />
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchComponent;
