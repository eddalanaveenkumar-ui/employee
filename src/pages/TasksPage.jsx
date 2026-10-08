import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import * as api from '../services/api.js'

function formatDueDate(date) {
  if (!date) return 'No due date'
  try {
    return new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(`${date}T00:00:00`))
  } catch {
    return String(date)
  }
}

export default function TasksPage() {
  const { employee: currentEmployee } = useOutletContext()
  const [tasks, setTasks] = useState([])
  const [departmentEmployees, setDepartmentEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Create Task form state
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [taskName, setTaskName] = useState('')
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [assignedEmpId, setAssignedEmpId] = useState('')
  const [createSubmitting, setCreateSubmitting] = useState(false)
  const [createError, setCreateError] = useState('')
  const [createSuccess, setCreateSuccess] = useState('')

  const fetchTasksData = () => {
    setLoading(true)
    setError('')
    Promise.all([
      api.getTasks(),
      api.getDepartmentEmployees().catch(() => []),
    ])
      .then(([tasksData, empData]) => {
        setTasks(tasksData || [])
        setDepartmentEmployees(empData || [])
        if (empData && empData.length > 0 && !assignedEmpId) {
          setAssignedEmpId(empData[0].employeeId)
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to load tasks.')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchTasksData()
  }, [])

  const handleCreateTask = async (e) => {
    e.preventDefault()
    setCreateError('')
    setCreateSuccess('')

    if (!taskName.trim()) {
      setCreateError('Task name is required.')
      return
    }
    const empIdToUse = assignedEmpId || currentEmployee?.employeeId
    if (!empIdToUse) {
      setCreateError('Please select or enter an employee ID.')
      return
    }

    setCreateSubmitting(true)
    try {
      await api.createTask(taskName, completionPercentage, empIdToUse)
      setCreateSuccess('Task created successfully!')
      setTaskName('')
      setCompletionPercentage(0)
      setShowCreateForm(false)
      fetchTasksData()
    } catch (err) {
      setCreateError(err.message || 'Failed to create task.')
    } finally {
      setCreateSubmitting(false)
    }
  }

  return (
    <section className="page-content" aria-labelledby="tasks-title">
      <header className="page-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p className="eyebrow">YOUR WORK</p>
          <h1 id="tasks-title">My Tasks</h1>
          <p>Tasks assigned to you and your department team.</p>
        </div>
        <button
          type="button"
          className="auth-button"
          style={{ width: 'auto', padding: '10px 20px', marginTop: 8 }}
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : '+ Create Task'}
        </button>
      </header>

      {/* Create Task Form */}
      {showCreateForm && (
        <form className="settings-card" onSubmit={handleCreateTask} style={{ marginBottom: 24 }}>
          <h3>Create New Task</h3>
          {createError && <p className="form-alert" role="alert">{createError}</p>}
          {createSuccess && <p className="form-alert form-success" role="alert">{createSuccess}</p>}

          <div className="form-field" style={{ marginTop: 12 }}>
            <label htmlFor="taskName">Task Name</label>
            <input
              id="taskName"
              type="text"
              className="form-input"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="e.g. Implement API Endpoint"
              required
            />
          </div>

          <div className="form-field" style={{ marginTop: 12 }}>
            <label htmlFor="assignedEmp">Assign To (Department Employee)</label>
            {departmentEmployees.length > 0 ? (
              <select
                id="assignedEmp"
                className="form-input"
                value={assignedEmpId}
                onChange={(e) => setAssignedEmpId(e.target.value)}
              >
                {departmentEmployees.map((emp) => (
                  <option key={emp.employeeId} value={emp.employeeId}>
                    {emp.name} ({emp.employeeId})
                  </option>
                ))}
              </select>
            ) : (
              <input
                id="assignedEmp"
                type="text"
                className="form-input"
                value={assignedEmpId}
                onChange={(e) => setAssignedEmpId(e.target.value)}
                placeholder="Employee ID"
                required
              />
            )}
          </div>

          <div className="form-field" style={{ marginTop: 12 }}>
            <label htmlFor="completionPct">Completion Percentage ({completionPercentage}%)</label>
            <input
              id="completionPct"
              type="range"
              min="0"
              max="100"
              value={completionPercentage}
              onChange={(e) => setCompletionPercentage(Number(e.target.value))}
              style={{ width: '100%', marginTop: 8 }}
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={createSubmitting}
            style={{ marginTop: 16 }}
          >
            {createSubmitting ? 'Creating…' : 'Save Task'}
          </button>
        </form>
      )}

      {loading && <p className="empty-state">Loading tasks…</p>}

      {error && <p className="form-alert" role="alert">{error}</p>}

      {!loading && !error && (
        <div className="task-list">
          {tasks.map((task) => {
            const status = task.status || 'IN_PROGRESS'
            return (
              <article className="task-card" key={task.id}>
                <div className="task-card-top">
                  <div>
                    <p className="task-reference">TASK-{task.id}</p>
                    <h2>{task.title}</h2>
                  </div>
                  <span className={`status-badge status-${status.toLowerCase().replace('_', '-')}`}>
                    {status.replace('_', ' ')}
                  </span>
                </div>
                {task.description && <p className="task-description">{task.description}</p>}
                <div className="task-meta">
                  <span className="due-date">
                    <span aria-hidden="true">◷</span>
                    Due {formatDueDate(task.dueDate)}
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {!loading && !error && tasks.length === 0 && (
        <p className="empty-state">No tasks assigned yet. Click "+ Create Task" to add one.</p>
      )}
    </section>
  )
}
