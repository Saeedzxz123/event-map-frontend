import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import defaultAvatar from '../assets/default-avatar.png'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)

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
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           
              <span>{user.username}</span>
                 <img
                src={user.profilePhoto || defaultAvatar}
                alt="profile"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            </div>

            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
