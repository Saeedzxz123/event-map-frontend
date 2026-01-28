import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import EditEvent from './pages/AddEvent/EditEvent'


import Landing from './pages/Landing/Landing'
import Login from './pages/Login/Login'
import Register from './pages/register/Register'
import OTP from './pages/OTP/OTP'
import Events from './pages/Events/Events'
import EventShow from './pages/EventShow/EventShow'
import AddEvent from './pages/AddEvent/AddEvent'
import Footerbar from './components/Footerbar'

const App = () => (
  <AuthProvider>
    <Router>
              <Navbar />
      <Routes >
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/new" element={
        <ProtectedRoute> <AddEvent /></ProtectedRoute>} />
        <Route path="/events/:id" element={<EventShow />} />
        <Route path="/events/:id/edit"element={<ProtectedRoute>
      <EditEvent /> </ProtectedRoute>}/>

      </Routes>
    </Router>

  </AuthProvider>
  
)

export default App
