import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import AuthCard from '../features/auth/components/AuthCard'
import './auth.css'

function AuthPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  return <AuthCard />
}

export default AuthPage


