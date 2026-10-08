package com.example.employeeapp.controller;

import com.example.employeeapp.dto.LoginRequest;
import com.example.employeeapp.dto.LoginResponse;
import com.example.employeeapp.dto.RegisterRequest;
import com.example.employeeapp.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(
            AuthService authService) {

        this.authService =
                authService;
    }

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<String> register(
            @Valid @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(
                authService.register(request)
        );
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    // POST /api/auth/logout
    @PostMapping("/logout")
    public ResponseEntity<String> logout(
            @RequestHeader(
                    value = "Authorization",
                    required = false
            )
            String authorizationHeader) {

        String token = null;

        if (authorizationHeader != null &&
                authorizationHeader.startsWith("Bearer ")) {

            token =
                    authorizationHeader.substring(7);
        }

        return ResponseEntity.ok(
                authService.logout(token)
        );
    }
}