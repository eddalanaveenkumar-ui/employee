package com.example.employeeapp.service;

import com.example.employeeapp.dto.CreateTaskRequest;
import com.example.employeeapp.dto.TaskResponse;
import com.example.employeeapp.entity.Employee;
import com.example.employeeapp.entity.Task;
import com.example.employeeapp.exception.ResourceNotFoundException;
import com.example.employeeapp.repository.EmployeeRepository;
import com.example.employeeapp.repository.TaskRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final EmployeeRepository employeeRepository;

    public TaskService(
            TaskRepository taskRepository,
            EmployeeRepository employeeRepository) {

        this.taskRepository = taskRepository;
        this.employeeRepository = employeeRepository;
    }

    private Employee getEmployee(String email) {

        return employeeRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found"
                        )
                );
    }

    // POST /api/tasks
    public TaskResponse createTask(
            CreateTaskRequest request,
            String email) {

        Employee currentEmployee = getEmployee(email);

        Employee employee = employeeRepository
                .findByEmployeeId(request.getEmployeeId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Assigned employee not found"
                        )
                );

        if (!currentEmployee.getDepartment().getId()
                .equals(employee.getDepartment().getId())) {
            throw new ResourceNotFoundException(
                    "You can only assign tasks within your department"
            );
        }

        Task task = new Task();
        task.setTitle(request.getTaskName());
        task.setDescription("Completion: " + request.getCompletionPercentage() + "%");
        task.setStatus(request.getCompletionPercentage() == 100 ? "COMPLETED" : "IN_PROGRESS");
        task.setDueDate(LocalDate.now().plusDays(7));
        task.setEmployee(employee);

        Task savedTask = taskRepository.save(task);
        return new TaskResponse(savedTask);
    }

    // GET /api/tasks
    public List<TaskResponse> getMyTasks(
            String email) {

        Employee employee = getEmployee(email);

        return taskRepository
                .findByEmployee(employee)
                .stream()
                .map(TaskResponse::new)
                .toList();
    }

    // GET /api/tasks/{taskId}
    public TaskResponse getTask(
            Long taskId,
            String email) {

        Employee employee = getEmployee(email);

        Task task =
                taskRepository
                        .findByIdAndEmployee(
                                taskId,
                                employee
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Task not found or not assigned to you"
                                )
                        );

        return new TaskResponse(task);
    }
}