import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import defaultAvatar from '../assets/default-avatar.png'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const goToProfile = () => {
    navigate('/profile')
  }

  const navButtonStyle = {
    background: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    padding: '0.4rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    margin: '0 0.15rem'
  }

  return (
    <div style={{paddingBottom:'2.5rem'}}>
    <nav
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        background: '#1e3a8a',
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        zIndex: 1000,
            }}
    >
      <div>
        {user && (
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#ffffff'
            }}
          >
            <img
              src={user.profilePhoto || defaultAvatar}
              alt="profile"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
            <span style={{ fontWeight: '600' }}>
              {user.username}
            </span>
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <Link to="/">
          <button style={navButtonStyle}>Home</button>
        </Link>

     <Link to="/events">
  <button style={navButtonStyle}>Events</button>
     </Link>

{user && (
  <Link to="/events/new">
    <button style={navButtonStyle}>Add Event</button>
  </Link>
)}



        {user ? (
          <button style={navButtonStyle} onClick={logout}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">
              <button style={navButtonStyle}>Login</button>
            </Link>

            <Link to="/register">
              <button style={navButtonStyle}>Register</button>
            </Link>
          </>
        )}
      </div>
    </nav>
    </div>
  )
}

export default Navbar
