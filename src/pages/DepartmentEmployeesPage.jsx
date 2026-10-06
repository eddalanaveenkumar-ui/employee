import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { getDepartmentById, getEmployeesByDepartment } from '../services/portalData.js'

export default function DepartmentEmployeesPage() {
  const { id } = useParams()
  const department = getDepartmentById(id)

  if (!department) {
    return (
      <section className="page-content">
        <p className="eyebrow">COMPANY DIRECTORY</p>
        <h1>Department not found</h1>
        <Link className="back-link" to="/departments">Back to departments</Link>
      </section>
    )
  }

  const employees = getEmployeesByDepartment(department.id)

  return (
    <section className="page-content" aria-labelledby="department-employees-title">
      <Link className="back-link" to="/departments">← All departments</Link>
      <header className="page-heading page-heading-spaced">
        <p className="eyebrow">DEPARTMENT</p>
        <h1 id="department-employees-title">{department.name}</h1>
        <p>{department.description}</p>
      </header>

      <div className="directory-list">
        {employees.map((employee) => (
          <Link className="directory-person" key={employee.id} to={`/employees/${employee.id}`}>
            <span className="person-avatar" aria-hidden="true">
              {employee.name.split(' ').map((part) => part.charAt(0)).join('')}
            </span>
            <span className="directory-person-info">
              <strong>{employee.name}</strong>
              <small>{employee.jobTitle}</small>
            </span>
            <span className="directory-person-email">{employee.email}</span>
            <span className="department-arrow" aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
      {employees.length === 0 && <p className="empty-state">No employees found in this department.</p>}
    </section>
  )
}
