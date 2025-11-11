import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../auth/AuthContext'

function AuthCard() {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { user, signIn, register, signOut } = useAuth()
  const navigate = useNavigate()

  const isRegister = mode === 'register'

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return
    setMessage('')
    setSubmitting(true)

    const trimmedEmail = email.trim().toLowerCase()
    const trimmedName = name.trim()

    if (!trimmedEmail || !password) {
      setMessage('Please fill in all required fields.')
      return
    }
    if (isRegister && !trimmedName) {
      setMessage('Please provide your name.')
      return
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.')
      return
    }

    if (isRegister) {
      const res = register(trimmedName, trimmedEmail, password)
      if (!res.ok) {
        setMessage(res.error || 'Registration failed.')
        setSubmitting(false)
        return
      }
      navigate('/dashboard', { replace: true })
    } else {
      const res = signIn(trimmedEmail, password)
      if (!res.ok) {
        setMessage(res.error || 'Invalid email or password.')
        setSubmitting(false)
        return
      }
      navigate('/dashboard', { replace: true })
    }
    setPassword('')
    setSubmitting(false)
  }

  function handleSignOut() {
    signOut()
    setMessage('You have been signed out.')
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">uuStarter</h1>
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

        {user ? (
          <div className="session">
            <div className="welcome">Signed in as <strong>{user.name}</strong></div>
            <button className="primary-btn" type="button" onClick={handleSignOut}>Sign out</button>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && (
              <div className="field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            )}
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                required
              />
            </div>
            {message && <div className="message">{message}</div>}
            <button className="primary-btn" type="submit" disabled={submitting}>
              {isRegister ? 'Create account' : 'Sign in'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default AuthCard


