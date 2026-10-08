import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Signupcontainer from './components/Signupcontainer.jsx'
import LoginPage from './pages/LoginPage.jsx'
import { RegistrationComplete } from './pages/Signuppage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import EmployeesPage from './pages/EmployeesPage.jsx'
import EmployeeProfilePage from './pages/EmployeeProfilePage.jsx'
import DepartmentsPage from './pages/DepartmentsPage.jsx'
import DepartmentEmployeesPage from './pages/DepartmentEmployeesPage.jsx'
import TasksPage from './pages/TasksPage.jsx'
import AttendancePage from './pages/AttendancePage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import { clearToken, getToken } from './services/api.js'
import './style.css'

const pageMeta = [
  { path: '/dashboard', title: 'Dashboard', description: 'A clear view of your employee information.' },
  { path: '/employees', title: 'Employees', description: 'People in your department.' },
  { path: '/departments', title: 'Departments', description: 'Company departments directory.' },
  { path: '/tasks', title: 'Tasks', description: 'Tasks assigned to you and your team.' },
  { path: '/attendance', title: 'Attendance', description: 'Track your daily check-in and check-out.' },
  { path: '/settings', title: 'Settings', description: 'Manage your profile and security.' },
  { path: '/profile', title: 'My Profile', description: 'Your profile and account settings.' },
]

function AppRoutes() {
  const navigate = useNavigate()
  const location = useLocation()

  const [employee, setEmployee] = useState(() => {
    const stored = sessionStorage.getItem('employee')
    return stored ? JSON.parse(stored) : null
  })

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => sessionStorage.getItem('employeeLoggedIn') === 'true' && Boolean(getToken()),
  )

  // ── Registration success ──────────────────────────────────────────────────
  const handleRegistrationSuccess = (employeeDetails) => {
    setEmployee(employeeDetails)
    sessionStorage.setItem('employee', JSON.stringify(employeeDetails))
    setIsLoggedIn(false)
    sessionStorage.removeItem('employeeLoggedIn')
    navigate('/registration-complete')
  }

  // ── Login handler ─────────────────────────────────────────────────────────
  const handleLoginSuccess = (authData) => {
    // authData = { token, employeeId, name }
    const emp = {
      employeeId: authData.employeeId,
      name: authData.name,
    }
    setEmployee(emp)
    sessionStorage.setItem('employee', JSON.stringify(emp))
    sessionStorage.setItem('employeeLoggedIn', 'true')
    setIsLoggedIn(true)
    navigate('/dashboard')
  }

  // ── Logout handler ────────────────────────────────────────────────────────
  const handleLogout = () => {
    clearToken()
    sessionStorage.removeItem('employeeLoggedIn')
    sessionStorage.removeItem('employee')
    setIsLoggedIn(false)
    setEmployee(null)
    navigate('/login')
  }

  // ── Page title logic ──────────────────────────────────────────────────────
  const matchedPage = pageMeta.find((p) => location.pathname.startsWith(p.path))
  let pageTitle = matchedPage?.title ?? 'Employee Portal'
  if (location.pathname.startsWith('/employees/')) {
    pageTitle = 'Employee Profile'
  } else if (location.pathname.startsWith('/departments/') && location.pathname.includes('/employees')) {
    pageTitle = 'Department Employees'
  }

  const pageDescription = matchedPage?.description ?? 'A clear view of your employee information.'

  // ── Protected layout wrapper ──────────────────────────────────────────────
  const ProtectedLayout = () => {
    if (!isLoggedIn || !employee) return <Navigate to="/login" replace />

    return (
      <div className="portal-layout">
        <Sidebar employee={employee} onLogout={handleLogout} />
        <main className="portal-main">
          <header className="portal-header">
            <div>
              <p className="portal-header-label">EMPLOYEE MANAGEMENT</p>
              <h1>{pageTitle}</h1>
              <p className="portal-header-description">{pageDescription}</p>
            </div>
            <div className="header-account">
              <span className="header-avatar" aria-hidden="true">
                {(employee.name?.[0] ?? 'E').toUpperCase()}
              </span>
              <span>{employee.name || 'Employee'}</span>
            </div>
          </header>
          <div className="portal-workspace">
            <Outlet context={{ employee, onLogout: handleLogout }} />
          </div>
        </main>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" replace />} />

      {/* ── Auth pages ─────────────────────────────────────── */}
      <Route
        path="/signup"
        element={
          <main className="app-shell">
            <Signupcontainer
              onRegistrationSuccess={handleRegistrationSuccess}
              onLogin={() => navigate('/login')}
            />
          </main>
        }
      />
      <Route
        path="/registration-complete"
        element={
          <main className="app-shell">
            <RegistrationComplete
              email={employee?.email}
              onLogin={() => navigate('/login')}
            />
          </main>
        }
      />
      <Route
        path="/login"
        element={
          isLoggedIn
            ? <Navigate to="/dashboard" replace />
            : (
              <main className="app-shell">
                <LoginPage
                  onLoginSuccess={handleLoginSuccess}
                  onSignup={() => navigate('/signup')}
                />
              </main>
            )
        }
      />

      {/* ── Protected pages ────────────────────────────────── */}
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/employees/:employeeId" element={<EmployeeProfilePage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/departments/:departmentId/employees" element={<DepartmentEmployeesPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to={isLoggedIn ? '/dashboard' : '/signup'} replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

createRoot(document.getElementById('app')).render(<App />)
