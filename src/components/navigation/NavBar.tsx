import { NavLink, useNavigate } from 'react-router-dom'
import React from 'react'
import { useAuth } from '../../auth/AuthContext'

function NavBar() {
	const navigate = useNavigate()
	const { user, signOut } = useAuth()
	const username = user?.name || 'Guest'
	const handleLogout = () => {
		try {
			signOut()
			try {
				localStorage.removeItem('auth_token')
			} catch {}
			navigate('/login', { replace: true })
		} catch {
			navigate('/login', { replace: true })
		}
	}

	return (
		<nav style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 12, borderBottom: '1px solid #eee', position: 'fixed', top: 0, left: 0, right: 0, width: '100%', background: '#fff', zIndex: 1000, height: 56 }}>
			<button
				type="button"
				onClick={() => navigate('/dashboard')}
				style={{
					background: 'none',
					border: 'none',
					padding: 0,
					marginRight: 12,
					fontSize: 18,
					fontWeight: 700,
					cursor: 'pointer'
				}}
				aria-label="uuStarter - go to dashboard"
			>
				uuStarter
			</button>

			<NavLink
				to="/dashboard"
				className={({ isActive }) =>
					isActive ? 'navlink-active' : 'navlink'
				}
				style={({ isActive }) => ({
					textDecoration: isActive ? 'underline' : 'none'
				})}
			>
				Dashboard
			</NavLink>

			<NavLink
				to="/detail"
				className={({ isActive }) =>
					isActive ? 'navlink-active' : 'navlink'
				}
				style={({ isActive }) => ({
					textDecoration: isActive ? 'underline' : 'none'
				})}
			>
				Detail
			</NavLink>

			<div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12, color: '#333' }}>
				<span>Username: {username}</span>
				<button type="button" onClick={handleLogout}>Logout</button>
			</div>
		</nav>
	)
}

export default NavBar


