const BASE_URL = '/api'

// ─── Token helpers ──────────────────────────────────────────────────────────
export function getToken() {
  return sessionStorage.getItem('token')
}

export function setToken(token) {
  sessionStorage.setItem('token', token)
}

export function clearToken() {
  sessionStorage.removeItem('token')
}

// ─── Core fetch wrapper ─────────────────────────────────────────────────────
async function request(path, options = {}) {
  const token = getToken()
  const headers = { ...options.headers }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (options.body && typeof options.body === 'object') {
    headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(options.body)
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const data = await response.json()
      message = data.message || data.error || message
    } catch {
      // use default message
    }
    throw new Error(message)
  }

  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return response.json()
  }
  return response.text()
}

// ─── Auth ───────────────────────────────────────────────────────────────────
// POST /api/auth/login  →  { message, token, employeeId, name }
export function login(employeeId, password) {
  return request('/auth/login', {
    method: 'POST',
    body: { employeeId, password },
  })
}

// POST /api/auth/register  →  string message
// body: { employeeId, name, email, departmentCode, password }
export function register({ employeeId, name, email, departmentCode, password }) {
  return request('/auth/register', {
    method: 'POST',
    body: { employeeId, name, email, departmentCode, password },
  })
}

// POST /api/auth/logout
export function logout() {
  return request('/auth/logout', { method: 'POST' })
}

// ─── Departments ────────────────────────────────────────────────────────────
// GET /api/departments  →  [{ id, departmentCode, departmentName }]
export function getDepartments() {
  return request('/departments')
}

// GET /api/departments/:departmentId/employees  →  [{ employeeId, name, email, departmentCode, departmentName }]
export function getDepartmentEmployeesById(departmentId) {
  return request(`/departments/${encodeURIComponent(departmentId)}/employees`)
}

// ─── Tasks ───────────────────────────────────────────────────────────────────
// GET /api/tasks  →  [{ id, title, description, status, dueDate }]
export function getTasks() {
  return request('/tasks')
}

// POST /api/tasks  →  TaskResponse
// body: { taskName, completionPercentage, employeeId }
export function createTask(taskName, completionPercentage, employeeId) {
  return request('/tasks', {
    method: 'POST',
    body: { taskName, completionPercentage: Number(completionPercentage), employeeId },
  })
}

// ─── Dashboard ──────────────────────────────────────────────────────────────
// GET /api/dashboard  →  { name, department, attendancePercentage, performanceScore }
export function getDashboard() {
  return request('/dashboard')
}

// ─── Employees ──────────────────────────────────────────────────────────────
// GET /api/employees/department  →  [{ employeeId, name, email, departmentCode, departmentName }]
export function getDepartmentEmployees() {
  return request('/employees/department')
}

// GET /api/employees/:id  →  { employeeId, name, email, departmentCode, departmentName }
export function getEmployeeById(employeeId) {
  return request(`/employees/${encodeURIComponent(employeeId)}`)
}

// ─── Profile ────────────────────────────────────────────────────────────────
// GET /api/profile  →  { employeeId, name, email, departmentCode, departmentName }
export function getProfile() {
  return request('/profile')
}

// PUT /api/profile/password
export function changePassword(currentPassword, newPassword) {
  return request('/profile/password', {
    method: 'PUT',
    body: { currentPassword, newPassword },
  })
}

// ─── Attendance ─────────────────────────────────────────────────────────────
// GET /api/attendance/today  →  { id, date, checkIn, checkOut, status }
export function getAttendanceToday() {
  return request('/attendance/today')
}

// POST /api/attendance/check-in
export function checkIn() {
  return request('/attendance/check-in', { method: 'POST' })
}

// POST /api/attendance/check-out
export function checkOut() {
  return request('/attendance/check-out', { method: 'POST' })
}

// GET /api/attendance/percentage  →  { attendancePercentage }
export function getAttendancePercentage() {
  return request('/attendance/percentage')
}

// GET /api/attendance/history  →  [{ id, date, checkIn, checkOut, status }]
export function getAttendanceHistory() {
  return request('/attendance/history')
}
