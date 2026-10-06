export const departments = [
  { id: 'engineering', name: 'Engineering', description: 'Product and software development' },
  { id: 'human-resources', name: 'Human Resources', description: 'People and workplace experience' },
  { id: 'finance', name: 'Finance', description: 'Planning, accounting and reporting' },
  { id: 'operations', name: 'Operations', description: 'Business operations and delivery' },
  { id: 'sales', name: 'Sales', description: 'Customer partnerships and growth' },
]

const directoryEmployees = [
  { id: 'EMP-1001', name: 'Alex Morgan', email: 'alex.morgan@example.com', departmentId: 'engineering', jobTitle: 'Software Engineer', location: 'New York' },
  { id: 'EMP-1002', name: 'Riley Chen', email: 'riley.chen@example.com', departmentId: 'engineering', jobTitle: 'Product Designer', location: 'Remote' },
  { id: 'EMP-2001', name: 'Jordan Lee', email: 'jordan.lee@example.com', departmentId: 'human-resources', jobTitle: 'People Specialist', location: 'New York' },
  { id: 'EMP-3001', name: 'Taylor Kim', email: 'taylor.kim@example.com', departmentId: 'finance', jobTitle: 'Financial Analyst', location: 'Chicago' },
  { id: 'EMP-4001', name: 'Morgan Patel', email: 'morgan.patel@example.com', departmentId: 'operations', jobTitle: 'Operations Coordinator', location: 'Austin' },
  { id: 'EMP-5001', name: 'Casey Brooks', email: 'casey.brooks@example.com', departmentId: 'sales', jobTitle: 'Account Executive', location: 'Remote' },
]

const demoTasks = [
  {
    id: 'TASK-01',
    title: 'Review the onboarding checklist',
    description: 'Check the engineering onboarding guide and note any steps that need updating.',
    priority: 'High',
    dueDate: '2026-10-12',
    status: 'In Progress',
  },
  {
    id: 'TASK-02',
    title: 'Complete security awareness training',
    description: 'Finish the assigned security and data-handling training module.',
    priority: 'Medium',
    dueDate: '2026-10-18',
    status: 'Pending',
  },
  {
    id: 'TASK-03',
    title: 'Submit weekly project update',
    description: 'Share a short update on current work, progress, and any blockers.',
    priority: 'Low',
    dueDate: '2026-10-08',
    status: 'Completed',
  },
]

export function getDepartmentById(id) {
  return departments.find((department) => department.id === id)
}

export function getEmployeesByDepartment(departmentId) {
  return directoryEmployees.filter((employee) => employee.departmentId === departmentId)
}

export function getEmployeeById(employeeId) {
  return directoryEmployees.find(
    (employee) => employee.id.toLowerCase() === employeeId.toLowerCase(),
  )
}

export function getTasksForEmployee(employeeId) {
  // Demo tasks are assigned to the currently signed-in employee until task APIs are available.
  return demoTasks.map((task) => ({ ...task, assignedToEmployeeId: employeeId }))
}

export function toEmployeeProfile(employee) {
  const department = departments.find((item) => item.name === employee.department)
  const emailName = employee.email?.split('@')[0] ?? ''
  const name = emailName
    .replace(/[._-]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

  return {
    id: employee.employeeId,
    name: name || 'Employee',
    email: employee.email || '',
    departmentId: department?.id,
    department: employee.department || 'Department not set',
    jobTitle: 'Employee',
    location: 'Not specified',
  }
}
