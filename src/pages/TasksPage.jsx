import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { getTasksForEmployee } from '../services/portalData.js'

function formatDueDate(date) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

export default function TasksPage() {
  const { employee } = useOutletContext()
  const tasks = getTasksForEmployee(employee.employeeId)

  return (
    <section className="page-content" aria-labelledby="tasks-title">
      <header className="page-heading">
        <p className="eyebrow">YOUR WORK</p>
        <h1 id="tasks-title">My tasks</h1>
        <p>Tasks assigned to you, with priority and due dates.</p>
      </header>

      <div className="task-list">
        {tasks.map((task) => (
          <article className="task-card" key={task.id}>
            <div className="task-card-top">
              <div>
                <p className="task-reference">{task.id}</p>
                <h2>{task.title}</h2>
              </div>
              <span className={`status-badge status-${task.status.toLowerCase().replace(' ', '-')}`}>
                {task.status}
              </span>
            </div>
            <p className="task-description">{task.description}</p>
            <div className="task-meta">
              <span className={`priority priority-${task.priority.toLowerCase()}`}>
                <span aria-hidden="true">●</span>
                {task.priority} priority
              </span>
              <span className="due-date">
                <span aria-hidden="true">◷</span>
                Due {formatDueDate(task.dueDate)}
              </span>
            </div>
          </article>
        ))}
      </div>
      <p className="dashboard-note">Sample task assignments for demonstration.</p>
    </section>
  )
}
