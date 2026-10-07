package com.example.employeeapp.service;

import com.example.employeeapp.dto.DepartmentResponse;
import com.example.employeeapp.dto.EmployeeResponse;
import com.example.employeeapp.entity.Department;
import com.example.employeeapp.entity.Employee;
import com.example.employeeapp.exception.ResourceNotFoundException;
import com.example.employeeapp.repository.DepartmentRepository;
import com.example.employeeapp.repository.EmployeeRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;

    public DepartmentService(
            DepartmentRepository departmentRepository,
            EmployeeRepository employeeRepository) {

        this.departmentRepository =
                departmentRepository;

        this.employeeRepository =
                employeeRepository;
    }

    // GET /api/departments
    public List<DepartmentResponse>
    getAllDepartments() {

        return departmentRepository
                .findAll()
                .stream()
                .map(DepartmentResponse::new)
                .toList();
    }

    // GET /api/departments/{departmentId}/employees
    public List<EmployeeResponse>
    getDepartmentEmployees(
            Long departmentId) {

        Department department =
                departmentRepository
                        .findById(departmentId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Department not found"
                                )
                        );

        return employeeRepository
                .findByDepartmentId(
                        department.getId()
                )
                .stream()
                .map(EmployeeResponse::new)
                .toList();
    }

    // GET /api/departments/{departmentId}/employees/{employeeId}
    public EmployeeResponse
    getDepartmentEmployee(
            Long departmentId,
            String employeeId) {

        Department department =
                departmentRepository
                        .findById(departmentId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Department not found"
                                )
                        );

        Employee employee =
                employeeRepository
                        .findByEmployeeId(employeeId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee not found"
                                )
                        );

        if (!employee.getDepartment()
                .getId()
                .equals(department.getId())) {

            throw new ResourceNotFoundException(
                    "Employee does not belong to this department"
            );
        }

        return new EmployeeResponse(employee);
    }
}