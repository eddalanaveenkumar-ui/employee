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
import Signupcontainer from './components/Signupcontainer.jsx'
import Sidebar from './components/Sidebar.jsx'
import Loginpage, { RegistrationComplete } from './pages/Signuppage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import TasksPage from './pages/TasksPage.jsx'
import DepartmentsPage from './pages/DepartmentsPage.jsx'
import DepartmentEmployeesPage from './pages/DepartmentEmployeesPage.jsx'
import EmployeeProfilePage from './pages/EmployeeProfilePage.jsx'
import './style.css'

const demoEmployee = {
  email: 'alex.morgan@example.com',
  employeeId: 'EMP-1001',
  department: 'Engineering',
}

function AppRoutes() {
  const navigate = useNavigate()
  const location = useLocation()
  const [employee, setEmployee] = useState(() => {
    const storedEmployee = sessionStorage.getItem('employee')
    return storedEmployee ? JSON.parse(storedEmployee) : null
  })
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => sessionStorage.getItem('employeeLoggedIn') === 'true',
  )

  const handleRegistrationSuccess = (employeeDetails) => {
    setEmployee(employeeDetails)
    sessionStorage.setItem('employee', JSON.stringify(employeeDetails))
    setIsLoggedIn(false)
    sessionStorage.removeItem('employeeLoggedIn')
    navigate('/registration-complete')
  }

  const handleLogin = () => {
    const activeEmployee = employee ?? demoEmployee
    setEmployee(activeEmployee)
    sessionStorage.setItem('employee', JSON.stringify(activeEmployee))
    sessionStorage.setItem('employeeLoggedIn', 'true')
    setIsLoggedIn(true)
    navigate('/dashboard')
  }

  const handleLogout = () => {
    sessionStorage.removeItem('employeeLoggedIn')
    setIsLoggedIn(false)
    navigate('/login')
  }

  const portalPage = [
    { path: '/dashboard', title: 'Dashboard', description: 'A clear view of your employee information.' },
    { path: '/tasks', title: 'My tasks', description: 'Stay on top of your assigned work.' },
    { path: '/departments', title: 'Departments', description: 'Explore teams across the organization.' },
  ].find((page) => location.pathname.startsWith(page.path))
  const pageTitle = location.pathname.startsWith('/employees/')
    ? 'Employee profile'
    : location.pathname.startsWith('/departments/') && location.pathname.endsWith('/employees')
      ? 'Department employees'
      : portalPage?.title ?? 'Employee Portal'

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
              <p className="portal-header-description">
                {portalPage?.description ?? 'A clear view of your employee information.'}
              </p>
            </div>
            <div className="header-account">
              <span className="header-avatar" aria-hidden="true">
                {(employee.email?.[0] ?? 'E').toUpperCase()}
              </span>
              <span>{employee.email?.split('@')[0]?.replace(/[._-]+/g, ' ') || 'Employee'}</span>
            </div>
          </header>
          <div className="portal-workspace">
            <Outlet context={{ employee }} />
          </div>
        </main>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" replace />} />
      <Route
        path="/signup"
        element={
          <main className="app-shell">
            <Signupcontainer onRegistrationSuccess={handleRegistrationSuccess} />
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
          <main className="app-shell">
            <Loginpage
              email={employee?.email}
              onSignup={() => navigate('/signup')}
              onLogin={handleLogin}
            />
          </main>
        }
      />
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route
          path="/departments/:id/employees"
          element={<DepartmentEmployeesPage />}
        />
        <Route path="/employees/:employeeId" element={<EmployeeProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
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
