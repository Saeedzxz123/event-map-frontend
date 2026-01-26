import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const Profile = () => {
  const { user } = useContext(AuthContext)
  if (!user) return <p>Loading...</p>

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Profile</h2>
      <p><strong>Username:</strong> {user.username}</p>
      {user.profilePhoto && <img src={user.profilePhoto} alt="profile" style={{ maxWidth: '200px' }} />}
      <p><strong>Admin:</strong> {user.isAdmin ? 'Yes' : 'No'}</p>
    </div>
  )
}

export default Profile
