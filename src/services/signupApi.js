const mockDepartments = [
  { id: 'engineering', name: 'Engineering' },
  { id: 'human-resources', name: 'Human Resources' },
  { id: 'finance', name: 'Finance' },
  { id: 'operations', name: 'Operations' },
  { id: 'sales', name: 'Sales' },
]

const registeredEmails = new Set()
const registeredEmployeeIds = new Set()

export async function getDepartments() {
  // Replace this mock response with the departments API when its contract is available.
  return Promise.resolve(mockDepartments)
}

export async function registerEmployee(form) {
  // Replace this mock registration with the backend request when its contract is available.
  const email = form.email.trim().toLowerCase()
  const employeeId = form.employeeId.trim().toLowerCase()

  if (registeredEmails.has(email) || registeredEmployeeIds.has(employeeId)) {
    throw new Error('This email or employee ID is already registered.')
  }

  registeredEmails.add(email)
  registeredEmployeeIds.add(employeeId)
  return { success: true }
}
