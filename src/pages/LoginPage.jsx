import React, { useState } from 'react'
import * as api from '../services/api.js'

export default function LoginPage({ onLoginSuccess, onSignup }) {
  const [employeeId, setEmployeeId] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  function validate() {
    const e = {}
    if (!employeeId.trim()) e.employeeId = 'Enter your Employee ID.'
    if (!password) e.password = 'Enter your password.'
    else if (password.length < 6) e.password = 'Password must be at least 6 characters.'
    return e
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const fieldErrors = validate()
    setErrors(fieldErrors)
    setApiError('')

    if (Object.keys(fieldErrors).length > 0) return

    setLoading(true)
    try {
      const data = await api.login(employeeId.trim(), password)
      // data = { message, token, employeeId, name }
      api.setToken(data.token)
      onLoginSuccess({
        token: data.token,
        employeeId: data.employeeId,
        name: data.name,
      })
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : 'Login failed. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-card login-card" aria-labelledby="login-title">
      <div className="brand-mark" aria-hidden="true">E</div>
      <p className="eyebrow">EMPLOYEE PORTAL</p>
      <h1 id="login-title">Sign in</h1>
      <p className="intro">Enter your Employee ID and password to access your account.</p>

      <form className="signup-form" onSubmit={handleSubmit} noValidate>
        <label className="form-field" htmlFor="login-employee-id">
          <span>Employee ID</span>
          <input
            id="login-employee-id"
            type="text"
            autoComplete="username"
            placeholder="e.g. EMP-1042"
            value={employeeId}
            onChange={(e) => { setEmployeeId(e.target.value); setErrors((p) => ({ ...p, employeeId: '' })); setApiError('') }}
            aria-invalid={Boolean(errors.employeeId)}
            aria-describedby={errors.employeeId ? 'login-eid-error' : undefined}
          />
          {errors.employeeId && <small id="login-eid-error">{errors.employeeId}</small>}
        </label>

        <label className="form-field" htmlFor="login-password">
          <span>Password</span>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); setApiError('') }}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'login-pw-error' : undefined}
          />
          {errors.password && <small id="login-pw-error">{errors.password}</small>}
        </label>

        {apiError && <p className="form-alert" role="alert">{apiError}</p>}

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="secure-note">Your credentials are transmitted securely.</p>

      {onSignup && (
        <p className="auth-switch">
          Don&apos;t have an account?{' '}
          <button className="text-button" type="button" onClick={onSignup}>
            Sign up
          </button>
        </p>
      )}
    </section>
  )
}
