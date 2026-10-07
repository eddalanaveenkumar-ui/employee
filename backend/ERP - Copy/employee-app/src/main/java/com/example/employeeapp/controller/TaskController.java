package com.example.employeeapp.controller;

import com.example.employeeapp.dto.CreateTaskRequest;
import com.example.employeeapp.dto.TaskResponse;
import com.example.employeeapp.service.TaskService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // POST /api/tasks
    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @Valid @RequestBody CreateTaskRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                taskService.createTask(request, email)
        );
    }

    // GET /api/tasks
    @GetMapping
    public ResponseEntity<List<TaskResponse>>
    getTasks(Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                taskService.getMyTasks(email)
        );
    }

    // GET /api/tasks/{taskId}
    @GetMapping("/{taskId}")
    public ResponseEntity<TaskResponse>
    getTask(
            @PathVariable Long taskId,
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                taskService.getTask(
                        taskId,
                        email
                )
        );
    }
}