import './App.css'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import NavBar from './components/navigation/NavBar'
import HomePage from './pages/HomePage'
import CampaignPage from './pages/CampaignPage'
import UserProfilePage from './pages/UserProfilePage'
import ManagedPage from './pages/ManagedPage'
import AdminPage from './pages/AdminPage'
import AuthPage from './auth/AuthPage'
import ProtectedRoute from './app/ProtectedRoute'
import AdminRoute from './app/AdminRoute'
import DetailIndex from './pages/DetailIndex'

function App() {
  const location = useLocation()
  const hideNav = location.pathname === '/login'

  return (
    <div>
      {!hideNav && <NavBar />}
      <div style={{ paddingTop: hideNav ? 0 : 56 }}>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/campaign" element={<CampaignPage />} />
          <Route path="/login" element={<AuthPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/managed" element={<ManagedPage />} />
          <Route path="/dashboard" element={<ManagedPage />} />
          <Route path="/user/:id" element={<UserProfilePage />} />
          <Route path="/detail" element={<DetailIndex />} />
        </Route>

        <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
