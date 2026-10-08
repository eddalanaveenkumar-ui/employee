package com.example.employeeapp.dto;

import com.example.employeeapp.entity.Department;

public class DepartmentResponse {

    private Long id;
    private String departmentCode;
    private String departmentName;

    public DepartmentResponse(Department department) {

        this.id = department.getId();
        this.departmentCode =
                department.getDepartmentCode();
        this.departmentName =
                department.getDepartmentName();
    }

    public Long getId() {
        return id;
    }

    public String getDepartmentCode() {
        return departmentCode;
    }

    public String getDepartmentName() {
        return departmentName;
    }
}