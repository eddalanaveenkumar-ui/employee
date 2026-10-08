package com.example.employeeapp.dto;

public class DashboardResponse {

    private String name;
    private String department;
    private Double attendancePercentage;
    private Double performanceScore;

    public DashboardResponse(
            String name,
            String department,
            Double attendancePercentage,
            Double performanceScore) {

        this.name = name;
        this.department = department;
        this.attendancePercentage = attendancePercentage;
        this.performanceScore = performanceScore;
    }

    public String getName() {
        return name;
    }

    public String getDepartment() {
        return department;
    }

    public Double getAttendancePercentage() {
        return attendancePercentage;
    }

    public Double getPerformanceScore() {
        return performanceScore;
    }
}