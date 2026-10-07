package com.example.employeeapp.dto;

import com.example.employeeapp.entity.Employee;

public class EmployeeResponse {

    private String employeeId;
    private String name;
    private String email;
    private String departmentCode;
    private String departmentName;

    public EmployeeResponse(Employee employee) {

        this.employeeId = employee.getEmployeeId();
        this.name = employee.getName();
        this.email = employee.getEmail();

        if (employee.getDepartment() != null) {
            this.departmentCode =
                    employee.getDepartment().getDepartmentCode();

            this.departmentName =
                    employee.getDepartment().getDepartmentName();
        }
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getDepartmentCode() {
        return departmentCode;
    }

    public String getDepartmentName() {
        return departmentName;
    }
}