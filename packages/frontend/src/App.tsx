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
 * @brief Componente principal de la aplicación.
 */

// Setting up Redux
// import store from './store/store.tsx';
// import { Provider } from 'react-redux';

// Routing
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

//  Import Pages
import HomePage from './Pages/Home';
import LoginPage from './Pages/Login';
import RegisterPage from './Pages/Register';
import DashboardPage from './Pages/Dashboard';



function App() {
  return (
    <>
    {/* <Provider store={store}> */}
      <Router>
        <Routes>
          <Route path="/" Component={HomePage} />
          <Route path="/login" Component={LoginPage} />
          <Route path="/register" Component={RegisterPage} />
          <Route path="/dashboard" Component={DashboardPage} />
          <Route path="*" Component={HomePage} />
        </Routes>
      </Router>
    {/* </Provider> */}
    </>
  )
}

export default App
