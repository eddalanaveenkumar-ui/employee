import React, { useCallback, useEffect, useRef, useState } from 'react'
import * as api from '../services/api.js'

function formatTime(isoString) {
  if (!isoString) return '—'
  const d = new Date(isoString)
  return d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' })
    .format(new Date(`${dateStr}T00:00:00`))
}

export default function AttendancePage() {
  const [today, setToday] = useState(null)       // today's attendance record or null
  const [percentage, setPercentage] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')

  // 1-minute countdown after check-in
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef(null)

  // Fetch all attendance data
  const fetchData = useCallback(async () => {
    setError('')
    try {
      const [pctData, historyData] = await Promise.all([
        api.getAttendancePercentage(),
        api.getAttendanceHistory(),
      ])
      setPercentage(pctData.attendancePercentage)
      setHistory(historyData)

      // Try to get today's record
      try {
        const todayData = await api.getAttendanceToday()
        setToday(todayData)

        // If checked in but not checked out, calculate remaining countdown
        if (todayData.checkIn && !todayData.checkOut) {
          const checkInTime = new Date(todayData.checkIn).getTime()
          const elapsed = Math.floor((Date.now() - checkInTime) / 1000)
          const remaining = Math.max(0, 60 - elapsed)
          if (remaining > 0) {
            startCountdown(remaining)
          }
        }
      } catch {
        // No attendance today yet — that's fine
        setToday(null)
      }
    } catch (err) {
      setError(err.message || 'Failed to load attendance data.')
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchData().finally(() => setLoading(false))
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [fetchData])

  function startCountdown(seconds) {
    setCountdown(seconds)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          timerRef.current = null
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  async function handleCheckIn() {
    setActionLoading(true)
    setActionError('')
    try {
      const record = await api.checkIn()
      setToday(record)
      startCountdown(60)
      // Refresh percentage + history
      const [pctData, historyData] = await Promise.all([
        api.getAttendancePercentage(),
        api.getAttendanceHistory(),
      ])
      setPercentage(pctData.attendancePercentage)
      setHistory(historyData)
    } catch (err) {
      setActionError(err.message || 'Check-in failed.')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleCheckOut() {
    setActionLoading(true)
    setActionError('')
    try {
      const record = await api.checkOut()
      setToday(record)
      // Refresh data
      const [pctData, historyData] = await Promise.all([
        api.getAttendancePercentage(),
        api.getAttendanceHistory(),
      ])
      setPercentage(pctData.attendancePercentage)
      setHistory(historyData)
    } catch (err) {
      setActionError(err.message || 'Check-out failed.')
    } finally {
      setActionLoading(false)
    }
  }

  const hasCheckedIn = today?.checkIn != null
  const hasCheckedOut = today?.checkOut != null
  const isCountdownActive = countdown > 0
  const canCheckOut = hasCheckedIn && !hasCheckedOut && !isCountdownActive

  if (loading) {
    return (
      <section className="page-content">
        <p className="empty-state">Loading attendance…</p>
      </section>
    )
  }

  return (
    <section className="page-content" aria-labelledby="attendance-title">
      <header className="page-heading">
        <p className="eyebrow">TIME TRACKING</p>
        <h1 id="attendance-title">Attendance</h1>
        <p>Track your daily check-in and check-out.</p>
      </header>

      {error && <p className="form-alert" role="alert">{error}</p>}

      {/* ── Percentage card ──────────────────────────────────── */}
      <div className="dashboard-metrics" style={{ marginBottom: 22 }}>
        <article className="metric-card">
          <div className="metric-card-heading">
            <p className="metric-label">Attendance rate</p>
            <span className="metric-symbol" aria-hidden="true">◷</span>
          </div>
          <p className="metric-value">{percentage != null ? `${percentage}%` : '—'}</p>
          <div className="metric-track" role="img" aria-label={`Attendance ${percentage ?? 0}%`}>
            <span style={{ width: `${percentage ?? 0}%` }} />
          </div>
        </article>

        {/* ── Today status card ─────────────────────────────── */}
        <article className="metric-card attendance-today-card">
          <div className="metric-card-heading">
            <p className="metric-label">Today</p>
            <span className="metric-symbol" aria-hidden="true">📋</span>
          </div>
          {today ? (
            <div className="attendance-today-details">
              <p><strong>Status:</strong> <span className={`status-badge status-${(today.status || 'pending').toLowerCase()}`}>{today.status}</span></p>
              <p><strong>Check-in:</strong> {formatTime(today.checkIn)}</p>
              <p><strong>Check-out:</strong> {formatTime(today.checkOut)}</p>
            </div>
          ) : (
            <p className="attendance-today-details" style={{ color: 'var(--description-slate)' }}>
              Not checked in yet today.
            </p>
          )}
        </article>
      </div>

      {/* ── Action buttons ───────────────────────────────────── */}
      <div className="attendance-actions">
        {!hasCheckedIn && (
          <button
            className="primary-button"
            onClick={handleCheckIn}
            disabled={actionLoading}
          >
            {actionLoading ? 'Checking in…' : '☀ Check In'}
          </button>
        )}

        {hasCheckedIn && !hasCheckedOut && (
          <button
            className="primary-button attendance-checkout-btn"
            onClick={handleCheckOut}
            disabled={!canCheckOut || actionLoading}
            title={isCountdownActive ? `Available in ${countdown}s` : ''}
          >
            {actionLoading
              ? 'Checking out…'
              : isCountdownActive
                ? `Check Out (${countdown}s)`
                : '🌙 Check Out'}
          </button>
        )}

        {hasCheckedOut && (
          <div className="success-panel" role="status">
            <span className="success-icon" aria-hidden="true">✓</span>
            <span>Attendance complete for today</span>
          </div>
        )}

        {actionError && <p className="form-alert" role="alert" style={{ marginTop: 10 }}>{actionError}</p>}
      </div>

      {/* ── History table ────────────────────────────────────── */}
      {history.length > 0 && (
        <>
          <header className="page-heading" style={{ marginTop: 32 }}>
            <p className="eyebrow">RECORDS</p>
            <h1 style={{ fontSize: 18 }}>Attendance history</h1>
          </header>

          <div className="attendance-history">
            <div className="attendance-history-header">
              <span>Date</span>
              <span>Check-in</span>
              <span>Check-out</span>
              <span>Status</span>
            </div>
            {history.map((record) => (
              <div className="attendance-history-row" key={record.id}>
                <span>{formatDate(record.date)}</span>
                <span>{formatTime(record.checkIn)}</span>
                <span>{formatTime(record.checkOut)}</span>
                <span>
                  <span className={`status-badge status-${(record.status || 'pending').toLowerCase()}`}>
                    {record.status}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
