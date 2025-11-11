import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <nav className="navbar" style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #eee' }}>
      <Link to="/home">Home</Link>
      <Link to="/campaign">Campaign</Link>
      {user ? (
        <>
          <Link to="/managed">Dashboard</Link>
          <Link to={`/user/${encodeURIComponent(user.id || user.email)}`}>Profile</Link>
          <button type="button" onClick={signOut} style={{ marginLeft: 'auto' }}>Logout</button>
        </>
      ) : (
        <Link to="/login" style={{ marginLeft: 'auto' }}>Login</Link>
      )}
    </nav>
  )
}

export default Navbar


