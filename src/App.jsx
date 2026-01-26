import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import Landing from './pages/Landing'
import Register from './pages/Register'
import Login from './pages/login'


const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  </AuthProvider>
)

export default App
