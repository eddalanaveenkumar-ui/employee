package com.example.employeeapp.service;

import com.example.employeeapp.dto.DashboardResponse;
import com.example.employeeapp.entity.Employee;
import com.example.employeeapp.exception.ResourceNotFoundException;
import com.example.employeeapp.repository.EmployeeRepository;

import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final EmployeeRepository employeeRepository;
    private final AttendanceService attendanceService;

    public DashboardService(
            EmployeeRepository employeeRepository,
            AttendanceService attendanceService) {

        this.employeeRepository =
                employeeRepository;

        this.attendanceService =
                attendanceService;
    }

    public DashboardResponse getDashboard(
            String email) {

        Employee employee =
                employeeRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee not found"
                                )
                        );

        double attendancePercentage =
                attendanceService
                        .getAttendancePercentage(email);

        return new DashboardResponse(
                employee.getName(),
                employee.getDepartment()
                        .getDepartmentName(),
                attendancePercentage,
                employee.getPerformanceScore()
        );
    }
}