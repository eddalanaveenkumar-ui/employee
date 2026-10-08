import React, { useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import * as api from '../services/api.js'

export default function EmployeesPage() {
  const { employee } = useOutletContext()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    api.getDepartmentEmployees()
      .then((data) => { if (active) setEmployees(data) })
      .catch((err) => { if (active) setError(err.message || 'Failed to load employees.') })
      .finally(() => { if (active) setLoading(false) })

    return () => { active = false }
  }, [])

  return (
    <section className="page-content" aria-labelledby="employees-title">
      <header className="page-heading">
        <p className="eyebrow">YOUR DEPARTMENT</p>
        <h1 id="employees-title">Employees</h1>
        <p>People in your department.</p>
      </header>

      {loading && <p className="empty-state">Loading employees…</p>}

      {error && <p className="form-alert" role="alert">{error}</p>}

      {!loading && !error && employees.length === 0 && (
        <p className="empty-state">No employees found in your department.</p>
      )}

      {!loading && !error && employees.length > 0 && (
        <div className="directory-list">
          {employees.map((emp) => (
            <Link
              className="directory-person"
              key={emp.employeeId}
              to={`/employees/${emp.employeeId}`}
            >
              <span className="person-avatar" aria-hidden="true">
                {emp.name
                  ? emp.name.split(' ').map((p) => p.charAt(0)).join('')
                  : emp.employeeId.charAt(0)}
              </span>
              <span className="directory-person-info">
                <strong>{emp.name || emp.employeeId}</strong>
                <small>{emp.departmentName || 'Employee'}</small>
              </span>
              <span className="directory-person-email">{emp.email}</span>
              <span className="department-arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
