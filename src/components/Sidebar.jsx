import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const navigation = [
  { to: '/dashboard', label: 'Dashboard', number: '01' },
  { to: '/employees', label: 'Employees', number: '02' },
  { to: '/departments', label: 'Departments', number: '03' },
  { to: '/tasks', label: 'Tasks', number: '04' },
  { to: '/attendance', label: 'Attendance', number: '05' },
  { to: '/settings', label: 'Settings', number: '06' },
]

export default function Sidebar({ employee, onLogout }) {
  const name = employee?.name || 'Employee'

  return (
    <aside className="portal-sidebar">
      <Link className="sidebar-brand" to="/dashboard">
        <span className="brand-mark" aria-hidden="true">E</span>
        <span>EMPLOYEE<br />PORTAL</span>
      </Link>

      <div className="sidebar-section-label">WORKSPACE</div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span className="sidebar-number" aria-hidden="true">{item.number}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-user">
        <span className="sidebar-avatar" aria-hidden="true">{name.charAt(0)}</span>
        <span className="sidebar-user-info">
          <strong>{name}</strong>
          <small>{employee?.employeeId || 'Employee'}</small>
        </span>
        <button
          className="sidebar-logout"
          type="button"
          onClick={onLogout}
          aria-label="Log out"
          title="Log out"
        >
          ↗
        </button>
      </div>
    </aside>
  )
}
