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

  function normalizeUserPayload(payload) {
    // Accepts user, {user}, {data:{user}}, or session-like objects
    const root = payload && payload.data && payload.data.user ? payload.data.user
      : payload && payload.user ? payload.user
      : payload
    if (!root) return null
    const id = root.id || root.userId || root.email
    const email = root.email || root.username || id
    const name = root.name || root.fullName || email
    const role = root.role || 'user'
    return { id, email, name, role }
  }

  function signIn(email, password) {
    const trimmedEmail = String(email || '').trim().toLowerCase()
    const users = getUsers()
    const found = users.find(u => u.email === trimmedEmail && u.password === password)
    if (!found) return { ok: false, error: 'Invalid email or password.' }
    const token = `token:${found.email}`
    const normalized = normalizeUserPayload(found)
    const session = { ...normalized }
    setSession(session)
    setUser(session)
    return { ok: true, token, user: session }
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
    const token = `token:${newUser.email}`
    const normalized = normalizeUserPayload(newUser)
    const session = { ...normalized }
    setSession(session)
    setUser(session)
    return { ok: true, token, user: session }
  }

  function signOut() {
    clearSession()
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


