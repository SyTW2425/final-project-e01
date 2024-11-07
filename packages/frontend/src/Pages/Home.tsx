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

import React from 'react';
import { Link } from 'react-router-dom';
import InfoSection from '../Components/Information/InfoSection';
import NavbarHome from '../Components/NavBars/NavBarHome';


const HomePage: React.FC = () => {
  return (
    <>
    <NavbarHome />
    <div id="home" className="pt-4 flex items-center justify-center min-h-screen bg-blue-700 text-white pb-4">
      <div className="border-4 border-white p-16 rounded-lg max-w-xl">
        <div className="text-center">
          <p className="text-4xl mb-4">Start your project</p>
          <h2 className="text-6xl font-bold mb-12 leading-tight">
            Prepare<br />for the future.
          </h2>
          <Link
            to="/login"
            className="bg-white text-blue-700 font-bold py-4 px-8 rounded-full hover:bg-gray-200 text-2xl"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
    {/* What is Section */}
    <InfoSection 
        id="whatis"
        title="What is Velia?"
        paragraphs={[
          "Velia is a web application that allows you to manage your projects efficiently and agilely.",
          "With Velia, you can organize your tasks, assign them to your teammates, and track their progress.",
          "All this in an intuitive and easy-to-use platform."
        ]}
        image="../../public/blank_logo.png"
        position="left"
      />
      {/* Why Velia Section */}
      <InfoSection 
        id="whyvelia"
        title="Why Velia?"
        paragraphs={
          [
            "Elevate Your Projects with Velia",
            "Velia is more than just a tool; it's your partner in achieving project excellence. By centralizing all your project information, tasks, and team communication, Velia streamlines your workflow and boosts efficiency.",
            "Real-time Collaboration, Simplified",
            "Collaborate seamlessly with your team, regardless of their location. Real-time updates and instant messaging ensure everyone stays informed and aligned.",
            "Advanced Task Management at Your Fingertips",
            "Break down complex projects into manageable tasks and track progress effortlessly. Prioritize tasks, set deadlines, and assign responsibilities with ease.",
            "Automated Workflows for Increased Efficiency",
            "Save time and reduce errors with automated workflows. Automate repetitive tasks and focus on strategic initiatives.",
            "Data-Driven Insights for Informed Decision-Making",
            "Gain valuable insights into project performance with detailed analytics. Track key metrics, identify bottlenecks, and make data-driven decisions to optimize your projects.",
            "Join the Velia Community",
            "Thousands of users trust Velia to achieve their project goals. Start your free trial today and experience the future of project management."
          ]
        }
        image="../../public/project-manager.png"
        position="right"
      />

  </>
  );
}

export default HomePage;
