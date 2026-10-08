import React, { useEffect, useState } from 'react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import * as api from '../services/api.js'

export default function EmployeeProfilePage() {
  const { employeeId } = useParams()
  const { employee: currentEmployee } = useOutletContext()
  const isOwnProfile =
    currentEmployee?.employeeId?.toLowerCase() === employeeId?.toLowerCase()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    const fetchProfile = isOwnProfile
      ? api.getProfile()
      : api.getEmployeeById(employeeId)

    fetchProfile
      .then((data) => { if (active) setProfile(data) })
      .catch((err) => { if (active) setError(err.message || 'Employee not found.') })
      .finally(() => { if (active) setLoading(false) })

    return () => { active = false }
  }, [employeeId, isOwnProfile])

  if (loading) {
    return (
      <section className="page-content">
        <p className="empty-state">Loading profile…</p>
      </section>
    )
  }

  if (error || !profile) {
    return (
      <section className="page-content">
        <p className="eyebrow">COMPANY DIRECTORY</p>
        <h1>Employee not found</h1>
        {error && <p className="form-alert" role="alert" style={{ marginTop: 12 }}>{error}</p>}
        <Link className="back-link" to="/employees" style={{ marginTop: 16, display: 'inline-block' }}>
          ← Back to employees
        </Link>
      </section>
    )
  }

  const name = profile.name || 'Employee'
  const initials = name.split(' ').map((p) => p.charAt(0)).join('')

  return (
    <section className="page-content" aria-labelledby="employee-profile-title">
      <Link className="back-link" to="/employees">← Employees</Link>

      <header className="profile-header">
        <span className="profile-avatar" aria-hidden="true">{initials}</span>
        <div>
          <p className="eyebrow">EMPLOYEE PROFILE</p>
          <h1 id="employee-profile-title">{name}</h1>
          <p>{profile.departmentName || '—'}</p>
        </div>
      </header>

      <dl className="profile-details">
        <div>
          <dt>Employee ID</dt>
          <dd>{profile.employeeId}</dd>
        </div>
        <div>
          <dt>Department</dt>
          <dd>{profile.departmentName || '—'}</dd>
        </div>
        <div>
          <dt>Work email</dt>
          <dd>{profile.email || 'Not provided'}</dd>
        </div>
        <div>
          <dt>Department code</dt>
          <dd>{profile.departmentCode || '—'}</dd>
        </div>
      </dl>

      {/* Read-only notice for other employees' profiles */}
      {!isOwnProfile && (
        <p className="dashboard-note" style={{ marginTop: 16 }}>
          You are viewing a read-only profile. To manage your own account, go to{' '}
          <Link to="/settings" style={{ color: 'var(--primary-blue)', fontWeight: 600, textDecoration: 'none' }}>
            Settings
          </Link>.
        </p>
      )}

      {/* Own profile link to settings */}
      {isOwnProfile && (
        <p className="dashboard-note" style={{ marginTop: 16 }}>
          <Link to="/settings" style={{ color: 'var(--primary-blue)', fontWeight: 600, textDecoration: 'none' }}>
            Go to Settings
          </Link>{' '}to change your password or log out.
        </p>
      )}
    </section>
  )
}
