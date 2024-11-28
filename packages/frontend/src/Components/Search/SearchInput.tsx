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

import React, { useState, useCallback, ChangeEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import debounce from 'lodash/debounce';
import SVGComponent from '../Icons/SVGComponent';

const searchIcon = "M21.71,20.29,18,16.61A9,9,0,1,0,16.61,18l3.68,3.68a1,1,0,0,0,1.42,0A1,1,0,0,0,21.71,20.29ZM11,18a7,7,0,1,1,7-7A7,7,0,0,1,11,18Z";

interface SearchComponentProps {
  url: string;
  mobile?: boolean;
}

interface SearchResult {
  username: string;
  email: string;
  img_path: string;
}

const SearchResultItem: React.FC<{ result: SearchResult }> = ({ result }) => {
  const navigate = useNavigate(); // Hook para navegación

  const handleNavigateToProfile = () => {
    navigate(`/dashboard/profile/${result.username}`); // Redirige a la página del perfil
  };

  return (
    <div className="p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 flex justify-between items-center">
      <div className="flex items-center">
        <img
          src={import.meta.env.VITE_BACKEND_URL + '/userImg/' + result.img_path}
          alt={result.username}
          className="w-8 h-8 rounded-full mr-2"
        />
        <div>
          <div>{result.username}</div>
          <div className="text-sm text-gray-500">{result.email}</div>
        </div>
      </div>
      <button
        onClick={handleNavigateToProfile}
        className="text-blue-500 hover:text-blue-700"
        title={`Ver perfil de ${result.username}`}
      >
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="#0134fe"
          stroke="#0134fe"
          className="h-6 w-6"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <g id="Complete">
              <g id="info-circle">
                <g>
                  <circle
                    cx="12"
                    cy="12"
                    data-name="--Circle"
                    fill="none"
                    id="_--Circle"
                    r="10"
                    stroke="#000000"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></circle>
                  <line
                    fill="none"
                    stroke="#000000"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    x1="12"
                    x2="12"
                    y1="12"
                    y2="16"
                  ></line>
                  <line
                    fill="none"
                    stroke="#000000"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    x1="12"
                    x2="12"
                    y1="8"
                    y2="8"
                  ></line>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </button>
    </div>
  );
};

const SearchComponent: React.FC<SearchComponentProps> = ({ url, mobile }) => {
  const [search, setSearch] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);

  const searchBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchResults = async (searchQuery: string) => {
    if (!searchQuery) {
      setResults([]);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(`${url}?username=${searchQuery}`, {
        method: 'GET',
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud al servidor');
      }

      const data = await response.json();
      setResults(Array.isArray(data.result) ? data.result : []);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Solicitud cancelada:', searchQuery);
      } else {
        console.error("Error fetching search results:", error);
        setResults([]);
      }
    }
  };

  const debouncedFetchResults = useCallback(debounce((value: string) => fetchResults(value), 500), []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    debouncedFetchResults(value);
  };

  return (
    <div className="flex flex-1 justify-center items-center relative">
      <div ref={searchBoxRef} className={"flex items-center transition-all" + (mobile ? " w-full" : " w-1/3")}>
        {!mobile && SVGComponent({ className: 'w-6 h-6 mr-3', d: searchIcon })}
        <input
          ref={inputRef}
          type="text"
          id="search"
          name="search"
          placeholder="Buscar"
          value={search}
          onChange={handleInputChange}
          className="w-full px-4 py-2 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-black-500 focus:ring-opacity-50 transition-all"
        />
      </div>

      {results.length > 0 && (
        <div
          className="absolute top-full bg-white border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto transition-all"
          style={{
            width: inputRef.current?.offsetWidth || 'auto',
          }}
        >
          {results.map((result) => (
            <SearchResultItem key={result.username} result={result} />
          ))}
        </div>
      )}

      {results.length === 0 && search && (
        <div
          className="absolute top-full text-red-500 bg-white border border-gray-300 text-center py-2 rounded-md transition-all"
          style={{
            width: inputRef.current?.offsetWidth || 'auto',
          }}
        >
          No se encontraron resultados.
        </div>
      )}
    </div>
  );
};

export default SearchComponent;

