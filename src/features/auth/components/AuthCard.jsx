import { useEffect, useState } from 'react'
import { getUsers, saveUsers, getSession, setSession, clearSession } from '../services/storage'

function AuthCard() {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [currentUser, setCurrentUser] = useState(null)

  const isRegister = mode === 'register'

  useEffect(() => {
    const existing = getSession()
    if (existing) setCurrentUser(existing)
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    setMessage('')

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
      const existing = getUsers()
      if (existing.some(u => u.email === trimmedEmail)) {
        setMessage('An account with this email already exists.')
        return
      }
      const newUser = { name: trimmedName, email: trimmedEmail, password }
      const next = [...existing, newUser]
      saveUsers(next)
      const session = { name: newUser.name, email: newUser.email }
      setSession(session)
      setCurrentUser(session)
      setMessage('Account created! You are now signed in.')
      setPassword('')
    } else {
      const existing = getUsers()
      const found = existing.find(u => u.email === trimmedEmail && u.password === password)
      if (!found) {
        setMessage('Invalid email or password.')
        return
      }
      const session = { name: found.name, email: found.email }
      setSession(session)
      setCurrentUser(session)
      setMessage('Welcome back!')
      setPassword('')
    }
  }

  function handleSignOut() {
    clearSession()
    setCurrentUser(null)
    setMessage('You have been signed out.')
  }

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

        {currentUser ? (
          <div className="session">
            <div className="welcome">Signed in as <strong>{currentUser.name}</strong></div>
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
            <button className="primary-btn" type="submit">
              {isRegister ? 'Create account' : 'Sign in'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default AuthCard


