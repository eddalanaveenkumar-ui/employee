import React from 'react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import {
  getEmployeeById,
  getDepartmentById,
  toEmployeeProfile,
} from '../services/portalData.js'

export default function EmployeeProfilePage() {
  const { employeeId } = useParams()
  const { employee: currentEmployee } = useOutletContext()
  const isCurrentEmployee =
    currentEmployee.employeeId.toLowerCase() === employeeId.toLowerCase()
  const employee = isCurrentEmployee
    ? toEmployeeProfile(currentEmployee)
    : getEmployeeById(employeeId)

  if (!employee) {
    return (
      <section className="page-content">
        <p className="eyebrow">COMPANY DIRECTORY</p>
        <h1>Employee not found</h1>
        <Link className="back-link" to="/departments">Back to departments</Link>
      </section>
    )
  }

  const departmentName = employee.department
    || getDepartmentById(employee.departmentId)?.name
    || 'Department not set'

  return (
    <section className="page-content" aria-labelledby="employee-profile-title">
      <Link
        className="back-link"
        to={employee.departmentId ? `/departments/${employee.departmentId}/employees` : '/departments'}
      >
        ← {employee.departmentId ? 'Department employees' : 'All departments'}
      </Link>
      <header className="profile-header">
        <span className="profile-avatar" aria-hidden="true">
          {employee.name.split(' ').map((part) => part.charAt(0)).join('')}
        </span>
        <div>
          <p className="eyebrow">EMPLOYEE PROFILE</p>
          <h1 id="employee-profile-title">{employee.name}</h1>
          <p>{employee.jobTitle}</p>
        </div>
      </header>

      <dl className="profile-details">
        <div>
          <dt>Employee ID</dt>
          <dd>{employee.id}</dd>
        </div>
        <div>
          <dt>Department</dt>
          <dd>{departmentName}</dd>
        </div>
        <div>
          <dt>Work email</dt>
          <dd>{employee.email || 'Not provided'}</dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>{employee.location || 'Not specified'}</dd>
        </div>
      </dl>
    </section>
  )
}
