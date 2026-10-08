package com.example.employeeapp.controller;

import com.example.employeeapp.dto.AttendanceResponse;
import com.example.employeeapp.service.AttendanceService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(
            AttendanceService attendanceService) {

        this.attendanceService = attendanceService;
    }

    // GET /api/attendance/today
    @GetMapping("/today")
    public ResponseEntity<AttendanceResponse> getToday(
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                attendanceService.getToday(email)
        );
    }

    // POST /api/attendance/check-in
    @PostMapping("/check-in")
    public ResponseEntity<AttendanceResponse> checkIn(
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                attendanceService.checkIn(email)
        );
    }

    // POST /api/attendance/check-out
    @PostMapping("/check-out")
    public ResponseEntity<AttendanceResponse> checkOut(
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                attendanceService.checkOut(email)
        );
    }

    // GET /api/attendance/percentage
    @GetMapping("/percentage")
    public ResponseEntity<Map<String, Object>>
    getPercentage(
            Authentication authentication) {

        String email = authentication.getName();

        double percentage =
                attendanceService.getAttendancePercentage(
                        email
                );

        return ResponseEntity.ok(
                Map.of(
                        "attendancePercentage",
                        percentage
                )
        );
    }

    // GET /api/attendance/history
    @GetMapping("/history")
    public ResponseEntity<List<AttendanceResponse>>
    getHistory(
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                attendanceService.getHistory(email)
        );
    }
}