import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import './auth.css'

function AuthPage() {
  const [mode, setMode] = useState('login')
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      navigate('/managed', { replace: true })
    }
  }, [loading, user, navigate])

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">CrowdFund</h1>
        <p className="auth-subtitle">Login or create an account to get started</p>

        <div className="segmented">
          <button
            className={mode === 'login' ? 'segmented-item active' : 'segmented-item'}
            type="button"
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={mode === 'register' ? 'segmented-item active' : 'segmented-item'}
            type="button"
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        {mode === 'login' ? (
          <LoginForm />
        ) : (
          <RegisterForm onRegistered={() => setMode('login')} />
        )}
      </div>
    </div>
  )
}

export default AuthPage


