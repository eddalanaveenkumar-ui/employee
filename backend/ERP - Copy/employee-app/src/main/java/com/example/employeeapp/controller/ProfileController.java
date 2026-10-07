package com.example.employeeapp.controller;

import com.example.employeeapp.dto.ChangePasswordRequest;
import com.example.employeeapp.dto.EmployeeResponse;
import com.example.employeeapp.service.ProfileService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(
            ProfileService profileService) {

        this.profileService =
                profileService;
    }

    // GET /api/profile
    @GetMapping
    public ResponseEntity<EmployeeResponse>
    getProfile(
            Authentication authentication) {

        String email =
                authentication.getName();

        return ResponseEntity.ok(
                profileService.getProfile(email)
        );
    }

    // PUT /api/profile/password
    @PutMapping("/password")
    public ResponseEntity<String>
    changePassword(
            @Valid @RequestBody
            ChangePasswordRequest request,
            Authentication authentication) {

        String email =
                authentication.getName();

        return ResponseEntity.ok(
                profileService.changePassword(
                        email,
                        request
                )
        );
    }
}