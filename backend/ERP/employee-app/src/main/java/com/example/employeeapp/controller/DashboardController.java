package com.example.employeeapp.controller;

import com.example.employeeapp.dto.DashboardResponse;
import com.example.employeeapp.service.DashboardService;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(
            DashboardService dashboardService) {

        this.dashboardService =
                dashboardService;
    }

    // GET /api/dashboard
    @GetMapping
    public ResponseEntity<DashboardResponse>
    getDashboard(
            Authentication authentication) {

        String email =
                authentication.getName();

        return ResponseEntity.ok(
                dashboardService
                        .getDashboard(email)
        );
    }
}