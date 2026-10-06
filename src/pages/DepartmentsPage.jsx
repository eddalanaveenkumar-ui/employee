import React from 'react'
import { Link } from 'react-router-dom'
import { departments, getEmployeesByDepartment } from '../services/portalData.js'

export default function DepartmentsPage() {
  return (
    <section className="page-content" aria-labelledby="departments-title">
      <header className="page-heading">
        <p className="eyebrow">COMPANY DIRECTORY</p>
        <h1 id="departments-title">Departments</h1>
        <p>Browse departments and the people who work in them.</p>
      </header>

      <div className="department-grid">
        {departments.map((department) => {
          const employeeCount = getEmployeesByDepartment(department.id).length

          return (
            <Link
              className="department-card"
              key={department.id}
              to={`/departments/${department.id}/employees`}
            >
              <span className="department-card-icon" aria-hidden="true">
                {department.name.charAt(0)}
              </span>
              <span className="department-card-copy">
                <strong>{department.name}</strong>
                <small>{department.description}</small>
                <span>{employeeCount} {employeeCount === 1 ? 'employee' : 'employees'}</span>
              </span>
              <span className="department-arrow" aria-hidden="true">→</span>
            </Link>
          )
        })}
      </div>
      <p className="dashboard-note">Sample company directory for demonstration.</p>
    </section>
  )
}
