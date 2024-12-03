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
 * @brief Página de inicio.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavbarHome from '../Components/NavBars/NavBarHome';
import FooterHome from '../Components/Footer/FooterHome';

const rotatingWords = ['Velia', 'the future', 'the manager', 'the solution', 'the progress'];

const HomePage: React.FC = () => {
  const [currentWord, setCurrentWord] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [cursorVisible, setCursorVisible] = useState<boolean>(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isDeleting) {
      timeout = setTimeout(() => {
        setCurrentWord((prev) => prev.slice(0, -1));
      }, 100);
    } else {
      const nextWord = rotatingWords[currentIndex];
      if (currentWord.length < nextWord.length) {
        timeout = setTimeout(() => {
          setCurrentWord((prev) => nextWord.slice(0, prev.length + 1));
        }, 150);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 1000);
      }
    }

    if (isDeleting && currentWord === '') {
      setIsDeleting(false);
      setCurrentIndex((prev) => (prev + 1) % rotatingWords.length);
    }

    return () => clearTimeout(timeout);
  }, [currentWord, isDeleting, currentIndex]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  const handleScrollToGetStarted = () => {
    const section = document.getElementById('getstarted');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <NavbarHome />
      {/* Hero Section */}
      <div
        id="hero"
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-800 via-blue-600 to-blue-500 text-white text-center px-6"
      >
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
            Welcome to{' '}
            <span className="text-blue-300">
              {currentWord}
              <span className={`text-white ${cursorVisible ? '' : 'invisible'}`}>
                |
              </span>
            </span>
          </h1>
          <p className="text-lg md:text-2xl font-light mb-8">
            The ultimate platform for managing your projects seamlessly and efficiently.
          </p>
          <button
            onClick={handleScrollToGetStarted}
            className="bg-blue-300 text-blue-900 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-blue-400 transition-all duration-300 text-lg"
          >
          Get Started
          </button>
        </div>
        <div className="mt-12 motion-safe:animate-bounce">
          <svg
            className="w-6 h-6 mx-auto text-blue-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 min-h-[80vh] bg-gray-100 text-gray-800">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12 text-blue-900">
            Why Choose Velia?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m2 0a2 2 0 100-4H7a2 2 0 100 4m0 0a2 2 0 100 4h10a2 2 0 100-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Collaboration</h3>
              <p className="text-gray-600">
                Work seamlessly with your team and stay aligned with real-time updates.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Task Management</h3>
              <p className="text-gray-600">
                Break down complex projects into manageable tasks.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m2 0a2 2 0 100-4H7a2 2 0 100 4m0 0a2 2 0 100 4h10a2 2 0 100-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Analytics</h3>
              <p className="text-gray-600">
                Gain insights with real-time performance metrics.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {/* Icono de integración */}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m-4-4h8m-8-8h8"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Integration</h3>
            <p className="text-gray-600">
              Easily integrate with your favorite tools and services.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-3-3v6m-7 4h14m2-4a2 2 0 00-2-2H5a2 2 0 00-2 2m16 0a2 2 0 002-2H3a2 2 0 00-2 2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Customization</h3>
            <p className="text-gray-600">
              Tailor the platform to fit your unique workflow and preferences.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 2C8.134 2 4.5 4.794 4.5 8v5c0 4.006 4.5 7.5 7.5 7.5s7.5-3.494 7.5-7.5V8c0-3.206-3.634-6-7.5-6zm0 8v5m0-8a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Security</h3>
            <p className="text-gray-600">
              Keep your data safe with our top-notch security features.
            </p>
          </div>

          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-16 bg-white text-gray-800 min-h-1/2">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12 text-blue-900">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-100 rounded-lg shadow-lg p-6">
              <p className="italic">"Velia has transformed how we manage projects. It's a game-changer!"</p>
              <p className="mt-4 font-bold">- Jane Doe</p>
            </div>
            <div className="bg-gray-100 rounded-lg shadow-lg p-6">
              <p className="italic">"I love the real-time collaboration features. Highly recommend!"</p>
              <p className="mt-4 font-bold">- John Smith</p>
            </div>
            <div className="bg-gray-100 rounded-lg shadow-lg p-6">
              <p className="italic">"The analytics tools provide insights that are invaluable for our team."</p>
              <p className="mt-4 font-bold">- Sarah Lee</p>
            </div>
          </div>
        </div>
      </div>
      
      
      {/* Get Started Section */}
      <div
        id="getstarted"
        className="py-32 bg-blue-700 text-white text-center flex flex-col items-center justify-center"
      >
        <div className="max-w-4xl">
          <h2 className="text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg md:text-xl mb-12 font-light">
            Sign up or log in to start organizing your projects with Velia today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/login"
              className="bg-white text-blue-700 font-semibold py-4 px-10 rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300 text-xl"
            >
              Log In
            </Link>
            <Link
              to="/login"
              className="bg-white text-blue-700 font-semibold py-4 px-10 rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300 text-xl"
            >
              Register
            </Link>
          </div>
        </div>
      </div>

      <FooterHome />
    </>
  );
};

export default HomePage;
