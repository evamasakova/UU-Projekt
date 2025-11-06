import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import CampaignPage from './pages/CampaignPage'
import UserProfilePage from './pages/UserProfilePage'
import ManagedPage from './pages/ManagedPage'
import AdminPage from './pages/AdminPage'
import AuthPage from './auth/AuthPage'
import ProtectedRoute from './app/ProtectedRoute'
import AdminRoute from './app/AdminRoute'

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/campaign" element={<CampaignPage />} />
        <Route path="/login" element={<AuthPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/managed" element={<ManagedPage />} />
          <Route path="/user/:id" element={<UserProfilePage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  )
}

export default App
