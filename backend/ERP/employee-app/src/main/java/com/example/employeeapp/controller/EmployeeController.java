package com.example.employeeapp.controller;

import com.example.employeeapp.dto.EmployeeResponse;
import com.example.employeeapp.service.EmployeeService;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(
            EmployeeService employeeService) {

        this.employeeService =
                employeeService;
    }

    // GET /api/employees/department
    @GetMapping("/department")
    public ResponseEntity<List<EmployeeResponse>>
    getDepartmentEmployees(
            Authentication authentication) {

        String email =
                authentication.getName();

        return ResponseEntity.ok(
                employeeService
                        .getDepartmentEmployees(email)
        );
    }

    // GET /api/employees/{employeeId}
    @GetMapping("/{employeeId}")
    public ResponseEntity<EmployeeResponse>
    getEmployee(
            @PathVariable String employeeId,
            Authentication authentication) {

        String email =
                authentication.getName();

        return ResponseEntity.ok(
                employeeService.getEmployeeById(
                        employeeId,
                        email
                )
        );
    }
}