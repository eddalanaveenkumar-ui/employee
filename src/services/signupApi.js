import * as api from './api.js'

export async function getDepartments() {
  // Fetch departments from the backend API
  const departments = await api.getDepartments()
  // Backend returns [{ id, departmentCode, departmentName }]
  // Map to the shape the signup form expects: { id, name }
  return departments.map((d) => ({
    id: d.departmentCode,
    name: d.departmentName,
  }))
}

export async function registerEmployee(form) {
  // POST /api/auth/register
  // Backend expects: { employeeId, name, email, departmentCode, password }
  const emailName = form.email
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

  await api.register({
    employeeId: form.employeeId.trim(),
    name: emailName || 'Employee',
    email: form.email.trim(),
    departmentCode: form.department,
    password: form.password,
  })

  return { success: true }
}
