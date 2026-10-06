import React, { useEffect, useState } from 'react'
import { getDepartments, registerEmployee } from '../services/signupApi.js'

const initialForm = {
  email: '',
  employeeId: '',
  password: '',
  department: '',
}

function validateForm(form) {
  const errors = {}

  if (!form.email.trim()) {
    errors.email = 'Enter your work email.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!form.employeeId.trim()) {
    errors.employeeId = 'Enter your employee ID.'
  }

  if (!form.password) {
    errors.password = 'Create a password.'
  } else if (form.password.length < 8) {
    errors.password = 'Use at least 8 characters.'
  }

  if (!form.department) {
    errors.department = 'Choose your department.'
  }

  return errors
}

export default function Signupcontainer({ onRegistrationSuccess, onLogin }) {
  const [form, setForm] = useState(initialForm)
  const [departments, setDepartments] = useState([])
  const [departmentError, setDepartmentError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [registrationError, setRegistrationError] = useState('')
  const [loadingDepartments, setLoadingDepartments] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let active = true

    getDepartments()
      .then((result) => {
        if (active) setDepartments(result)
      })
      .catch(() => {
        if (active) {
          setDepartmentError('Departments could not be loaded. Please try again.')
        }
      })
      .finally(() => {
        if (active) setLoadingDepartments(false)
      })

    return () => {
      active = false
    }
  }, [])

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setFieldErrors((current) => ({ ...current, [name]: '' }))
    setRegistrationError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const errors = validateForm(form)
    setFieldErrors(errors)
    setRegistrationError('')

    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    try {
      await registerEmployee(form)
      const department = departments.find((item) => item.id === form.department)
      onRegistrationSuccess({
        email: form.email.trim(),
        employeeId: form.employeeId.trim(),
        department: department?.name ?? form.department,
      })
    } catch (error) {
      setRegistrationError(
        error instanceof Error
          ? error.message
          : 'Registration failed. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-card" aria-labelledby="signup-title">
      <div className="brand-mark" aria-hidden="true">E</div>
      <p className="eyebrow">EMPLOYEE PORTAL</p>
      <h1 id="signup-title">Create your account</h1>
      <p className="intro">Set up your account to get started.</p>

      <form className="signup-form" onSubmit={handleSubmit} noValidate>
        <label className="form-field" htmlFor="email">
          <span>Work email</span>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={updateField}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
          />
          {fieldErrors.email && <small id="email-error">{fieldErrors.email}</small>}
        </label>

        <label className="form-field" htmlFor="employeeId">
          <span>Employee ID</span>
          <input
            id="employeeId"
            name="employeeId"
            type="text"
            autoComplete="off"
            placeholder="e.g. EMP-1042"
            value={form.employeeId}
            onChange={updateField}
            aria-invalid={Boolean(fieldErrors.employeeId)}
            aria-describedby={fieldErrors.employeeId ? 'employee-id-error' : undefined}
          />
          {fieldErrors.employeeId && (
            <small id="employee-id-error">{fieldErrors.employeeId}</small>
          )}
        </label>

        <label className="form-field" htmlFor="department">
          <span>Department</span>
          <select
            id="department"
            name="department"
            value={form.department}
            onChange={updateField}
            disabled={loadingDepartments || Boolean(departmentError)}
            aria-invalid={Boolean(fieldErrors.department)}
            aria-describedby={fieldErrors.department ? 'department-error' : undefined}
          >
            <option value="">
              {loadingDepartments ? 'Loading departments…' : 'Select your department'}
            </option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
          {fieldErrors.department && (
            <small id="department-error">{fieldErrors.department}</small>
          )}
          {departmentError && (
            <small className="error-message" role="alert">{departmentError}</small>
          )}
        </label>

        <label className="form-field" htmlFor="password">
          <span>Password</span>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={updateField}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={fieldErrors.password ? 'password-error' : undefined}
          />
          {fieldErrors.password && (
            <small id="password-error">{fieldErrors.password}</small>
          )}
        </label>

        {registrationError && (
          <p className="form-alert" role="alert">{registrationError}</p>
        )}

        <button
          className="primary-button"
          type="submit"
          disabled={submitting || loadingDepartments || Boolean(departmentError)}
        >
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="auth-switch">
        Already registered?{' '}
        <button className="text-button" type="button" onClick={onLogin}>
          Log in
        </button>
      </p>
      <p className="secure-note">Your employee details are kept secure.</p>
    </section>
  )
}
