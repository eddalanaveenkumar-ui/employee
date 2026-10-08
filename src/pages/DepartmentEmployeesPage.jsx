import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import * as api from '../services/api.js'

export default function DepartmentEmployeesPage() {
  const { departmentId } = useParams()
  const [employees, setEmployees] = useState([])
  const [department, setDepartment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    Promise.all([
      api.getDepartmentEmployeesById(departmentId),
      api.getDepartments(),
    ])
      .then(([empData, deptList]) => {
        if (!active) return
        setEmployees(empData || [])
        const matched = deptList?.find((d) => String(d.id) === String(departmentId))
        setDepartment(matched || null)
      })
      .catch((err) => {
        if (active) setError(err.message || 'Failed to load department employees.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [departmentId])

  const deptTitle = department ? department.departmentName : `Department #${departmentId}`
  const deptCode = department ? department.departmentCode : ''

  return (
    <section className="page-content" aria-labelledby="department-employees-title">
      <Link className="back-link" to="/departments">← All departments</Link>

      <header className="page-heading page-heading-spaced">
        <p className="eyebrow">DEPARTMENT {deptCode && `• ${deptCode}`}</p>
        <h1 id="department-employees-title">{deptTitle}</h1>
        <p>Members of this department. Click an employee to view their profile.</p>
      </header>

      {loading && <p className="empty-state">Loading employees…</p>}

      {error && (
        <p className="form-alert" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="directory-list">
          {employees.map((employee) => {
            const name = employee.name || 'Employee'
            const initials = name
              .split(' ')
              .map((part) => part.charAt(0))
              .join('')

            return (
              <Link
                className="directory-person"
                key={employee.employeeId}
                to={`/employees/${employee.employeeId}`}
              >
                <span className="person-avatar" aria-hidden="true">
                  {initials}
                </span>
                <span className="directory-person-info">
                  <strong>{name}</strong>
                  <small>ID: {employee.employeeId}</small>
                </span>
                <span className="directory-person-email">{employee.email || 'No email'}</span>
                <span className="department-arrow" aria-hidden="true">→</span>
              </Link>
            )
          })}
        </div>
      )}

      {!loading && !error && employees.length === 0 && (
        <p className="empty-state">No employees found in this department.</p>
      )}
    </section>
  )
}
