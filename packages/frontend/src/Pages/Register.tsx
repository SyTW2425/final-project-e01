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
 * @brief Página de registro.
 */

import React from "react";
import RegisterForm from "../Components/Forms/RegisterForm";

const RegisterPage : React.FC = () => {
  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-blue-700">
      <RegisterForm />
    </div>
    </>
  );
}

export default RegisterPage;