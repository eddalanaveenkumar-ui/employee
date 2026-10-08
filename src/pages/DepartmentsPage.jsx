import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as api from '../services/api.js'

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    api.getDepartments()
      .then((data) => {
        if (active) setDepartments(data || [])
      })
      .catch((err) => {
        if (active) setError(err.message || 'Failed to load departments.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [])

  return (
    <section className="page-content" aria-labelledby="departments-title">
      <header className="page-heading">
        <p className="eyebrow">COMPANY DIRECTORY</p>
        <h1 id="departments-title">Departments</h1>
        <p>Browse company departments and view the employees within each team.</p>
      </header>

      {loading && <p className="empty-state">Loading departments…</p>}

      {error && (
        <p className="form-alert" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="department-grid">
          {departments.map((department) => (
            <Link
              className="department-card"
              key={department.id}
              to={`/departments/${department.id}/employees`}
            >
              <span className="department-card-icon" aria-hidden="true">
                {(department.departmentName || department.departmentCode || 'D').charAt(0)}
              </span>
              <span className="department-card-copy">
                <strong>{department.departmentName}</strong>
                <small>Code: {department.departmentCode}</small>
                <span>View team employees →</span>
              </span>
              <span className="department-arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      )}

      {!loading && !error && departments.length === 0 && (
        <p className="empty-state">No departments found.</p>
      )}
    </section>
  )
}
