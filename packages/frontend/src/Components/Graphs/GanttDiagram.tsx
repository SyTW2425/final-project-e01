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
 * @date 18/11/2024
 * @brief Componente de diagrama de Gantt
 */

import React from 'react';
import { Gantt, Task } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';


const GanttDiagram: React.FC = () => {
  let tasks: Task[] = [
    {
      start: new Date(2020, 1, 1),
      end: new Date(2020, 1, 2),
      name: 'Idea',
      id: 'Task 0',
      type: 'task',
      progress: 45,
      isDisabled: true,
      styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
    },
    {
      start: new Date(2020, 1, 2),
      end: new Date(2020, 1, 4),
      name: 'Research',
      id: 'Task 1',
      type: 'task',
      progress: 60,
      dependencies: ['Task 0'],
      styles: { progressColor: '#85e085', progressSelectedColor: '#5fd55f' },
    },
    {
      start: new Date(2020, 1, 5),
      end: new Date(2020, 1, 10),
      name: 'Prototype',
      id: 'Task 2',
      type: 'task',
      progress: 20,
      dependencies: ['Task 1'],
      styles: { progressColor: '#5daeff', progressSelectedColor: '#237bd4' },
    },
    {
      start: new Date(2020, 1, 11),
      end: new Date(2020, 1, 12),
      name: 'Feedback',
      id: 'Task 3',
      type: 'task',
      progress: 10,
      dependencies: ['Task 2'],
      styles: { progressColor: '#f2a5ff', progressSelectedColor: '#da66ff' },
    },
    {
      start: new Date(2020, 1, 13),
      end: new Date(2020, 1, 20),
      name: 'Implementation Phase 1',
      id: 'Task 4',
      type: 'milestone',
      progress: 0,
      dependencies: ['Task 3'],
      styles: { progressColor: '#ffa500', progressSelectedColor: '#ff7700' },
    },
    {
      start: new Date(2020, 1, 21),
      end: new Date(2020, 2, 10),
      name: 'Testing',
      id: 'Task 5',
      type: 'task',
      progress: 75,
      dependencies: ['Task 4'],
      styles: { progressColor: '#e74c3c', progressSelectedColor: '#c0392b' },
    },
    {
      start: new Date(2020, 2, 11),
      end: new Date(2020, 2, 15),
      name: 'Implementation Phase 2',
      id: 'Task 6',
      type: 'task',
      progress: 50,
      dependencies: ['Task 5'],
      styles: { progressColor: '#7f8c8d', progressSelectedColor: '#5d6d6d' },
    },
    {
      start: new Date(2020, 2, 16),
      end: new Date(2020, 2, 20),
      name: 'Review',
      id: 'Task 7',
      type: 'task',
      progress: 30,
      dependencies: ['Task 6'],
      styles: { progressColor: '#9b59b6', progressSelectedColor: '#8e44ad' },
    },
    {
      start: new Date(2020, 2, 21),
      end: new Date(2020, 2, 25),
      name: 'Final Adjustments',
      id: 'Task 8',
      type: 'task',
      progress: 15,
      dependencies: ['Task 7'],
      styles: { progressColor: '#34495e', progressSelectedColor: '#2c3e50' },
    },
    {
      start: new Date(2020, 2, 26),
      end: new Date(2020, 2, 28),
      name: 'Launch Preparation',
      id: 'Task 9',
      type: 'task',
      progress: 85,
      dependencies: ['Task 8'],
      styles: { progressColor: '#27ae60', progressSelectedColor: '#1e8449' },
    },
    {
      start: new Date(2020, 2, 29),
      end: new Date(2020, 2, 29),
      name: 'Launch',
      id: 'Task 10',
      type: 'milestone',
      progress: 100,
      dependencies: ['Task 9'],
      styles: { progressColor: '#f39c12', progressSelectedColor: '#d35400' },
    },
    {
      start: new Date(2020, 3, 1),
      end: new Date(2020, 3, 7),
      name: 'Post-launch Review',
      id: 'Task 11',
      type: 'task',
      progress: 40,
      dependencies: ['Task 10'],
      styles: { progressColor: '#2980b9', progressSelectedColor: '#1f618d' },
    },
    {
      start: new Date(2020, 3, 8),
      end: new Date(2020, 3, 12),
      name: 'Bug Fixing',
      id: 'Task 12',
      type: 'task',
      progress: 50,
      dependencies: ['Task 11'],
      styles: { progressColor: '#e67e22', progressSelectedColor: '#d35400' },
    },
    {
      start: new Date(2020, 3, 13),
      end: new Date(2020, 3, 15),
      name: 'Documentation',
      id: 'Task 13',
      type: 'task',
      progress: 25,
      dependencies: ['Task 12'],
      styles: { progressColor: '#8e44ad', progressSelectedColor: '#71368a' },
    },
    {
      start: new Date(2020, 3, 16),
      end: new Date(2020, 3, 20),
      name: 'Marketing Campaign',
      id: 'Task 14',
      type: 'task',
      progress: 10,
      dependencies: ['Task 13'],
      styles: { progressColor: '#16a085', progressSelectedColor: '#0e6655' },
    },
    {
      start: new Date(2020, 3, 21),
      end: new Date(2020, 3, 25),
      name: 'Client Feedback Round 1',
      id: 'Task 15',
      type: 'task',
      progress: 35,
      dependencies: ['Task 14'],
      styles: { progressColor: '#f4d03f', progressSelectedColor: '#f1c40f' },
    },
    {
      start: new Date(2020, 3, 26),
      end: new Date(2020, 3, 30),
      name: 'Optimization',
      id: 'Task 16',
      type: 'task',
      progress: 45,
      dependencies: ['Task 15'],
      styles: { progressColor: '#5dade2', progressSelectedColor: '#3498db' },
    },
    {
      start: new Date(2020, 4, 1),
      end: new Date(2020, 4, 5),
      name: 'Client Feedback Round 2',
      id: 'Task 17',
      type: 'task',
      progress: 20,
      dependencies: ['Task 16'],
      styles: { progressColor: '#dc7633', progressSelectedColor: '#ba4a00' },
    },
    {
      start: new Date(2020, 4, 6),
      end: new Date(2020, 4, 10),
      name: 'Final Approval',
      id: 'Task 18',
      type: 'milestone',
      progress: 0,
      dependencies: ['Task 17'],
      styles: { progressColor: '#58d68d', progressSelectedColor: '#28b463' },
    },
    {
      start: new Date(2020, 4, 11),
      end: new Date(2020, 4, 15),
      name: 'Handover',
      id: 'Task 19',
      type: 'task',
      progress: 0,
      dependencies: ['Task 18'],
      styles: { progressColor: '#f1948a', progressSelectedColor: '#ec7063' },
    },
    {
      start: new Date(2020, 4, 16),
      end: new Date(2020, 4, 20),
      name: 'Closure',
      id: 'Task 20',
      type: 'task',
      progress: 0,
      dependencies: ['Task 19'],
      styles: { progressColor: '#5b2c6f', progressSelectedColor: '#4a235a' },
    },
  ];
  

  return (
    <div className="h-screen overflow-scroll">
      <Gantt tasks={tasks} />
    </div>

    
  );
}

export default GanttDiagram;