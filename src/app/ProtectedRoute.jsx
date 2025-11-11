import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

function ProtectedRoute() {
  const location = useLocation()
  const { user, loading } = useAuth()

  if (loading) return 'Loading…'
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return <Outlet />
}

export default ProtectedRoute


