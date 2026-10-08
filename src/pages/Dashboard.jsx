import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import * as api from '../services/api.js'

export default function Dashboard() {
  const { employee } = useOutletContext()
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    api.getDashboard()
      .then((data) => { if (active) setDashboard(data) })
      .catch((err) => { if (active) setError(err.message || 'Failed to load dashboard.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  if (loading) {
    return (
      <section className="page-content">
        <p className="empty-state">Loading dashboard…</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="page-content">
        <header className="page-heading">
          <p className="eyebrow">OVERVIEW</p>
          <h1>Dashboard</h1>
        </header>
        <p className="form-alert" role="alert">{error}</p>
      </section>
    )
  }

  const name = dashboard?.name || employee?.name || 'Employee'
  const department = dashboard?.department || '—'
  const attendance = dashboard?.attendancePercentage ?? 0
  const performance = dashboard?.performanceScore ?? 0

  return (
    <section className="page-content" aria-labelledby="dashboard-title">
      <header className="page-heading">
        <p className="eyebrow">OVERVIEW</p>
        <h1 id="dashboard-title">Employee snapshot</h1>
        <p>Your department and current performance at a glance.</p>
      </header>

      <section className="employee-summary" aria-label="Employee details">
        <div className="employee-avatar" aria-hidden="true">{name.charAt(0)}</div>
        <div>
          <p className="summary-label">Logged in as</p>
          <h2>{name}</h2>
          <p className="department-line">{department}</p>
        </div>
      </section>

      <div className="dashboard-metrics">
        <article className="metric-card">
          <div className="metric-card-heading">
            <p className="metric-label">Attendance</p>
            <span className="metric-symbol" aria-hidden="true">◷</span>
          </div>
          <p className="metric-value">{attendance}%</p>
          <div
            className="metric-track"
            role="img"
            aria-label={`Attendance ${attendance}%`}
          >
            <span style={{ width: `${attendance}%` }} />
          </div>
        </article>
        <article className="metric-card">
          <div className="metric-card-heading">
            <p className="metric-label">Performance score</p>
            <span className="metric-symbol" aria-hidden="true">↗</span>
          </div>
          <p className="metric-value">{performance}<span>/100</span></p>
          <div
            className="metric-track"
            role="img"
            aria-label={`Performance score ${performance} out of 100`}
          >
            <span style={{ width: `${performance}%` }} />
          </div>
        </article>
      </div>
    </section>
  )
}
