import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import * as api from '../services/api.js'

export default function SettingsPage() {
  const { employee, onLogout } = useOutletContext()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileError, setProfileError] = useState('')

  // Change password form
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [pwErrors, setPwErrors] = useState({})
  const [pwLoading, setPwLoading] = useState(false)
  const [pwSuccess, setPwSuccess] = useState('')
  const [pwApiError, setPwApiError] = useState('')

  useEffect(() => {
    let active = true
    api.getProfile()
      .then((data) => { if (active) setProfile(data) })
      .catch((err) => { if (active) setProfileError(err.message || 'Failed to load profile.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  function validatePassword() {
    const e = {}
    if (!currentPassword) e.currentPassword = 'Enter your current password.'
    if (!newPassword) e.newPassword = 'Enter a new password.'
    else if (newPassword.length < 6) e.newPassword = 'Must be at least 6 characters.'
    return e
  }

  async function handleChangePassword(event) {
    event.preventDefault()
    const errors = validatePassword()
    setPwErrors(errors)
    setPwApiError('')
    setPwSuccess('')

    if (Object.keys(errors).length > 0) return

    setPwLoading(true)
    try {
      const msg = await api.changePassword(currentPassword, newPassword)
      setPwSuccess(typeof msg === 'string' ? msg : 'Password changed successfully.')
      setCurrentPassword('')
      setNewPassword('')
    } catch (err) {
      setPwApiError(err.message || 'Failed to change password.')
    } finally {
      setPwLoading(false)
    }
  }

  async function handleLogout() {
    try {
      await api.logout()
    } catch {
      // proceed with local logout even if API call fails
    }
    api.clearToken()
    onLogout()
  }

  if (loading) {
    return (
      <section className="page-content">
        <p className="empty-state">Loading profile…</p>
      </section>
    )
  }

  if (profileError) {
    return (
      <section className="page-content">
        <p className="form-alert" role="alert">{profileError}</p>
      </section>
    )
  }

  const displayName = profile?.name || employee?.name || 'Employee'
  const initials = displayName.split(' ').map((p) => p.charAt(0)).join('')

  return (
    <section className="page-content" aria-labelledby="settings-title">
      <header className="page-heading">
        <p className="eyebrow">ACCOUNT</p>
        <h1 id="settings-title">Settings</h1>
        <p>Manage your profile and security.</p>
      </header>

      {/* ── Profile info ──────────────────────────────────── */}
      <header className="profile-header">
        <span className="profile-avatar" aria-hidden="true">{initials}</span>
        <div>
          <p className="eyebrow">YOUR PROFILE</p>
          <h1>{displayName}</h1>
          <p>{profile?.departmentName || ''}</p>
        </div>
      </header>

      <dl className="profile-details">
        <div>
          <dt>Employee ID</dt>
          <dd>{profile?.employeeId || '—'}</dd>
        </div>
        <div>
          <dt>Department</dt>
          <dd>{profile?.departmentName || '—'}</dd>
        </div>
        <div>
          <dt>Name</dt>
          <dd>{profile?.name || '—'}</dd>
        </div>
        <div>
          <dt>Work email</dt>
          <dd>{profile?.email || '—'}</dd>
        </div>
      </dl>

      {/* ── Change password ───────────────────────────────── */}
      <div className="settings-section">
        <h2 className="settings-section-title">Change password</h2>
        <form className="settings-form" onSubmit={handleChangePassword} noValidate>
          <label className="form-field" htmlFor="current-password">
            <span>Current password</span>
            <input
              id="current-password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => { setCurrentPassword(e.target.value); setPwErrors((p) => ({ ...p, currentPassword: '' })); setPwApiError(''); setPwSuccess('') }}
              aria-invalid={Boolean(pwErrors.currentPassword)}
            />
            {pwErrors.currentPassword && <small>{pwErrors.currentPassword}</small>}
          </label>

          <label className="form-field" htmlFor="new-password">
            <span>New password</span>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setPwErrors((p) => ({ ...p, newPassword: '' })); setPwApiError(''); setPwSuccess('') }}
              aria-invalid={Boolean(pwErrors.newPassword)}
            />
            {pwErrors.newPassword && <small>{pwErrors.newPassword}</small>}
          </label>

          {pwApiError && <p className="form-alert" role="alert">{pwApiError}</p>}
          {pwSuccess && (
            <div className="success-panel" role="status">
              <span className="success-icon" aria-hidden="true">✓</span>
              <span>{pwSuccess}</span>
            </div>
          )}

          <button className="primary-button" type="submit" disabled={pwLoading}>
            {pwLoading ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>

      {/* ── Logout ────────────────────────────────────────── */}
      <div className="settings-section">
        <h2 className="settings-section-title">Session</h2>
        <p style={{ color: 'var(--description-slate)', fontSize: 13, marginBottom: 14 }}>
          End your current session and return to the login page.
        </p>
        <button className="primary-button logout-button" type="button" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </section>
  )
}
