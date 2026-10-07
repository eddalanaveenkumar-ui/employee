package com.example.employeeapp.service;

import com.example.employeeapp.dto.EmployeeResponse;
import com.example.employeeapp.entity.Employee;

import com.example.employeeapp.exception.ResourceNotFoundException;

import com.example.employeeapp.repository.EmployeeRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(
            EmployeeRepository employeeRepository) {

        this.employeeRepository =
                employeeRepository;
    }

    public List<EmployeeResponse>
    getDepartmentEmployees(
            String email) {

        Employee currentEmployee =
                employeeRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee not found"
                                )
                        );

        Long departmentId =
                currentEmployee
                        .getDepartment()
                        .getId();

        return employeeRepository
                .findByDepartmentId(departmentId)
                .stream()
                .map(EmployeeResponse::new)
                .toList();
    }

    public EmployeeResponse getEmployeeById(
            String employeeId,
            String loggedInEmail) {

        Employee currentEmployee =
                employeeRepository
                        .findByEmail(loggedInEmail)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Logged-in employee not found"
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

        // Only allow same-department employees
        if (!employee
                .getDepartment()
                .getId()
                .equals(
                        currentEmployee
                                .getDepartment()
                                .getId()
                )) {

            throw new ResourceNotFoundException(
                    "Employee does not belong to your department"
            );
        }

        return new EmployeeResponse(employee);
    }
}