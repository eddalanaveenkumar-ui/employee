package com.example.employeeapp.dto;

import com.example.employeeapp.entity.Attendance;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class AttendanceResponse {

    private Long id;
    private LocalDate date;
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;
    private String status;

    public AttendanceResponse(Attendance attendance) {

        this.id = attendance.getId();
        this.date = attendance.getAttendanceDate();
        this.checkIn = attendance.getCheckIn();
        this.checkOut = attendance.getCheckOut();
        this.status = attendance.getStatus();
    }

    public Long getId() {
        return id;
    }

    public LocalDate getDate() {
        return date;
    }

    public LocalDateTime getCheckIn() {
        return checkIn;
    }

    public LocalDateTime getCheckOut() {
        return checkOut;
    }

    public String getStatus() {
        return status;
    }
}