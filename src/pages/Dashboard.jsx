import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { toEmployeeProfile } from '../services/portalData.js'

const demoMetrics = {
  attendance: 96,
  performance: 88,
}

export default function Dashboard() {
  const { employee } = useOutletContext()
  const profile = toEmployeeProfile(employee)

  return (
    <section className="page-content" aria-labelledby="dashboard-title">
      <header className="page-heading">
        <p className="eyebrow">OVERVIEW</p>
        <h1 id="dashboard-title">Employee snapshot</h1>
        <p>Your department and current performance at a glance.</p>
      </header>

      <section className="employee-summary" aria-label="Employee details">
        <div className="employee-avatar" aria-hidden="true">{profile.name.charAt(0)}</div>
        <div>
          <p className="summary-label">Logged in as</p>
          <h2>{profile.name}</h2>
          <p className="department-line">{profile.department}</p>
        </div>
      </section>

      <div className="dashboard-metrics">
        <article className="metric-card">
          <div className="metric-card-heading">
            <p className="metric-label">Attendance</p>
            <span className="metric-symbol" aria-hidden="true">◷</span>
          </div>
          <p className="metric-value">{demoMetrics.attendance}%</p>
          <div
            className="metric-track"
            role="img"
            aria-label={`Attendance ${demoMetrics.attendance}%`}
          >
            <span style={{ width: `${demoMetrics.attendance}%` }} />
          </div>
        </article>
        <article className="metric-card">
          <div className="metric-card-heading">
            <p className="metric-label">Performance score</p>
            <span className="metric-symbol" aria-hidden="true">↗</span>
          </div>
          <p className="metric-value">{demoMetrics.performance}<span>/100</span></p>
          <div
            className="metric-track"
            role="img"
            aria-label={`Performance score ${demoMetrics.performance} out of 100`}
          >
            <span style={{ width: `${demoMetrics.performance}%` }} />
          </div>
        </article>
      </div>
      <p className="dashboard-note">Sample dashboard metrics for demonstration.</p>
    </section>
  )
}
