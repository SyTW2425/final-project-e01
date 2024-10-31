import HomePage from './Pages/Home';
import LoginPage from './Pages/Login';
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
      <nav className="flex items-center justify-between p-4 bg-gray-600">
        <div className="text-white font-bold">AGILE PROJECT MANAGER</div>
        <div>
          <Link to="/home" className="text-white" style={inlineRouterStyle}>Home</Link>
          <Link to="/login" className="text-white mr-4" style={inlineRouterStyle}>Login</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/home" Component={HomePage} />
        <Route path="/login" Component={LoginPage} />
      </Routes>
    
    </Router>
    </>
  )
}

export default App
