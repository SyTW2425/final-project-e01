import HomePage from './Pages/Home';
import LoginPage from './Pages/Login';
import RegisterPage from './Pages/Register';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';

// import RegisterForm from './Components/Forms/RegisterForm'

const inlineRouterStyle = {
  margin: '2vh',
  textDecoration: 'none',
  color: 'white',
  fontWeight: 'bold',
}

function App() {
  return (
    <>

    <Router>
      {
        !localStorage.getItem('token') &&
        <nav className="flex items-center justify-between p-4 bg-gray-600">
          <div className="text-white font-bold">AGILE PROJECT MANAGER</div>
          <div>
            <Link to="/login" className="text-white mr-4 bg-blue-400 rounded pl-2 pr-2 " style={inlineRouterStyle}>Login</Link>
            <Link to="/register" className="text-white bg-blue-400" style={inlineRouterStyle}>Register</Link>
          </div>
        </nav>
      }

      <Routes>
        <Route path="/" Component={HomePage} />
        <Route path="/home" Component={HomePage} />
        <Route path="/login" Component={LoginPage} />
        <Route path="/register" Component={RegisterPage} />
      </Routes>
    
    </Router>
    </>
  )
}

export default App
