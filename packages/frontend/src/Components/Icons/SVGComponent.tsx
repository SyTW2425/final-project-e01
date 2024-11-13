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
 * @brief Componente de formulario de creación de cuenta
 */

import React from "react";

const SVGComponent : React.FC<any> = (props : any) => {
  return (
    <svg
    fill={props.fill ?? "#FFFFFF"}
    width="800px"
    height="800px"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path fillRule="evenodd"
      d={props.d}
    />
  </svg>
  );
}

export default SVGComponent;
