import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getSession, setSession, clearSession, getUsers, saveUsers } from '../features/auth/services/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = getSession()
    if (session) setUser(session)
    setLoading(false)
  }, [])

  function signIn(email, password) {
    const trimmedEmail = String(email || '').trim().toLowerCase()
    const users = getUsers()
    const found = users.find(u => u.email === trimmedEmail && u.password === password)
    if (!found) return { ok: false, error: 'Invalid email or password.' }
    const session = { id: found.email, name: found.name, email: found.email, role: found.role || 'user' }
    setSession(session)
    try {
      localStorage.setItem('auth_token', `token_${session.id}`)
    } catch {}
    setUser(session)
    return { ok: true }
  }

  function register(name, email, password) {
    const trimmedEmail = String(email || '').trim().toLowerCase()
    const trimmedName = String(name || '').trim()
    const users = getUsers()
    if (users.some(u => u.email === trimmedEmail)) {
      return { ok: false, error: 'An account with this email already exists.' }
    }
    const newUser = { name: trimmedName, email: trimmedEmail, password, role: 'user' }
    saveUsers([...users, newUser])
    const session = { id: newUser.email, name: newUser.name, email: newUser.email, role: newUser.role }
    setSession(session)
    try {
      localStorage.setItem('auth_token', `token_${session.id}`)
    } catch {}
    setUser(session)
    return { ok: true }
  }

  function signOut() {
    clearSession()
    try {
      localStorage.removeItem('auth_token')
    } catch {}
    setUser(null)
  }

  const value = useMemo(() => ({ user, loading, signIn, register, signOut }), [user, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


