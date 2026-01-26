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
    background: '#6d28d9',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer'
  }

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem'
      }}
    >
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/">
          <button style={navButtonStyle}>Home</button>
        </Link>

        <Link to="/events">
          <button style={navButtonStyle}>Events</button>
        </Link>



        <button style={navButtonStyle} onClick={logout}>Logout</button>

      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <>
            <button
              onClick={goToProfile}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <img
            src={user.profilePhoto || defaultAvatar}
            alt="profile"
            style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            objectFit: 'cover'
                }}
              />  <span>{user.username}</span></button>

          </>
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
  )
}

export default Navbar
