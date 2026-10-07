package com.example.employeeapp.controller;

import com.example.employeeapp.dto.DepartmentResponse;
import com.example.employeeapp.dto.EmployeeResponse;
import com.example.employeeapp.service.DepartmentService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(
            DepartmentService departmentService) {

        this.departmentService =
                departmentService;
    }

    // GET /api/departments
    @GetMapping
    public ResponseEntity<List<DepartmentResponse>>
    getDepartments() {

        return ResponseEntity.ok(
                departmentService.getAllDepartments()
        );
    }

    // GET /api/departments/{departmentId}/employees
    @GetMapping("/{departmentId}/employees")
    public ResponseEntity<List<EmployeeResponse>>
    getEmployees(
            @PathVariable Long departmentId) {

        return ResponseEntity.ok(
                departmentService
                        .getDepartmentEmployees(
                                departmentId
                        )
        );
    }

    // GET /api/departments/{departmentId}/employees/{employeeId}
    @GetMapping(
            "/{departmentId}/employees/{employeeId}"
    )
    public ResponseEntity<EmployeeResponse>
    getEmployee(
            @PathVariable Long departmentId,
            @PathVariable String employeeId) {

        return ResponseEntity.ok(
                departmentService
                        .getDepartmentEmployee(
                                departmentId,
                                employeeId
                        )
        );
    }
}