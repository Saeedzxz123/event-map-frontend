import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import Landing from './pages/Landing'
import Register from './pages/Register'
import Login from './pages/login'
import OTP from './pages/OTP'
import Navbar from './components/Navbar'


const App = () => (
  <AuthProvider>
    <Router>
      <Navbar/>

      <Routes>

        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<OTP />} />

      </Routes>
    </Router>
  </AuthProvider>
)

export default App
