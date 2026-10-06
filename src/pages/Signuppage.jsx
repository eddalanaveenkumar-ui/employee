import React from 'react'

export function RegistrationComplete({ email, onLogin }) {
  return (
    <section className="auth-card login-card" aria-labelledby="login-title">
      <div className="brand-mark" aria-hidden="true">E</div>
      <p className="eyebrow">EMPLOYEE PORTAL</p>
      <h1 id="login-title">You're registered</h1>
      <p className="intro">
        Your account has been created{email ? ` for ${email}` : ''}. Continue
        to login to access your account.
      </p>
      <div className="success-panel" role="status">
        <span className="success-icon" aria-hidden="true">✓</span>
        <span>Registration complete</span>
      </div>
      <button className="primary-button" type="button" onClick={onLogin}>
        Continue to Login
      </button>
      <p className="secure-note">
        You can sign in with the credentials you just created.
      </p>
    </section>
  )
}

export default function Loginpage({ email, onSignup, onLogin }) {
  return (
    <section className="auth-card login-card" aria-labelledby="login-title">
      <div className="brand-mark" aria-hidden="true">E</div>
      <p className="eyebrow">EMPLOYEE PORTAL</p>
      <h1 id="login-title">Login</h1>
      <p className="intro">
        {email ? `Your account is ready for ${email}.` : 'Your employee account is ready.'}
        {' '}This demo sign-in opens the dashboard.
      </p>
      <div className="login-actions">
        <button className="primary-button" type="button" onClick={onLogin}>
          Sign in to dashboard
        </button>
        <button className="text-button" type="button" onClick={onSignup}>
          Back to sign up
        </button>
      </div>
    </section>
  )
}
