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
 * @brief Componente de búsqueda de usuarios
 */

import React, { useState, useCallback, ChangeEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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

const SearchResultItem: React.FC<{ result: SearchResult; onSelect: (user: SearchResult) => void }> = ({ result, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(result)}
      className="p-3 flex items-center border-b border-gray-200 cursor-pointer hover:bg-blue-50 transition"
    >
      <img
        src={`${import.meta.env.VITE_BACKEND_URL}/userImg/${result.img_path}`}
        alt={result.username}
        className="w-10 h-10 rounded-full mr-3"
      />
      <div>
        <p className="font-semibold text-gray-800">{result.username}</p>
        <p className="text-sm text-gray-500">{result.email}</p>
      </div>
    </div>
  );
};

const SearchComponent: React.FC<SearchComponentProps> = ({ url, mobile }) => {
  const [search, setSearch] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const navigate = useNavigate();

  const handleSelectUser = (user: SearchResult) => {
    setSearch(user.username);
    setResults([]);
    navigate(`/dashboard/profile/${user.username}`);
    window.location.reload();
  };

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
        throw new Error('Error fetching search results');
      }

      const data = await response.json();
      setResults(data.result);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setResults([]);
    }
  };

  const debouncedFetchResults = useCallback(debounce((value: string) => fetchResults(value), 500), []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    debouncedFetchResults(value);
  };

  return (
    <div className="relative w-full md:w-1/2">
      {/* Search Input */}
      <div
        ref={searchBoxRef}
        className="flex items-center bg-white border border-gray-300 rounded-2xl shadow-sm px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all"
      >
        <SVGComponent className="w-5 h-5 text-gray-400 mr-3" d={searchIcon}  fill={"bg-blue-700"} />
        <input
          ref={inputRef}
          type="text"
          id="search"
          name="search"
          placeholder="Search users..."
          value={search}
          onChange={handleInputChange}
          className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Results Dropdown */}
      {results.length > 0 && (
        <div
          className="absolute top-full  bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
          style={{ width: inputRef.current?.offsetWidth || '100%' }}
        >
          {results.map((result) => (
            <SearchResultItem key={result.username} result={result} onSelect={handleSelectUser} />
          ))}
        </div>
      )}

      {/* No Results Message */}
      {results.length === 0 && search && (
        <div
          className="absolute top-full mt-2 text-sm text-red-500 bg-white border border-gray-300 text-center py-2 rounded-lg shadow-lg z-50"
          style={{ width: inputRef.current?.offsetWidth || '100%' }}
        >
          No results found.
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
