package com.example.employeeapp.service;

import com.example.employeeapp.dto.LoginRequest;
import com.example.employeeapp.dto.LoginResponse;
import com.example.employeeapp.dto.RegisterRequest;

import com.example.employeeapp.entity.Department;
import com.example.employeeapp.entity.Employee;

import com.example.employeeapp.exception.BadRequestException;

import com.example.employeeapp.repository.DepartmentRepository;
import com.example.employeeapp.repository.EmployeeRepository;

import com.example.employeeapp.security.JwtBlacklistService;
import com.example.employeeapp.security.JwtService;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final JwtBlacklistService blacklistService;

    public AuthService(
            EmployeeRepository employeeRepository,
            DepartmentRepository departmentRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            JwtBlacklistService blacklistService) {

        this.employeeRepository =
                employeeRepository;

        this.departmentRepository =
                departmentRepository;

        this.passwordEncoder =
                passwordEncoder;

        this.authenticationManager =
                authenticationManager;

        this.jwtService =
                jwtService;

        this.blacklistService =
                blacklistService;
    }

    public String register(
            RegisterRequest request) {

        if (employeeRepository
                .existsByEmail(request.getEmail())) {

            throw new BadRequestException(
                    "Email already registered"
            );
        }

        if (employeeRepository
                .existsByEmployeeId(
                        request.getEmployeeId())) {

            throw new BadRequestException(
                    "Employee ID already registered"
            );
        }

        Department department =
                departmentRepository
                        .findByDepartmentCode(
                                request.getDepartmentCode()
                        )
                        .orElseThrow(() ->
                                new BadRequestException(
                                        "Invalid department"
                                )
                        );

        Employee employee =
                new Employee();

        employee.setEmployeeId(
                request.getEmployeeId()
        );

        employee.setName(
                request.getName()
        );

        employee.setEmail(
                request.getEmail()
        );

        // Hash password before storing
        employee.setPasswordHash(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        employee.setDepartment(
                department
        );

        employee.setAttendancePercentage(
                0.0
        );

        employee.setPerformanceScore(
                0.0
        );

        employeeRepository.save(employee);

        return "Registration successful";
    }

    public LoginResponse login(
            LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmployeeId(),
                        request.getPassword()
                )
        );

        Employee employee =
                employeeRepository
                        .findByEmployeeId(
                                request.getEmployeeId()
                        )
                        .orElseThrow(() ->
                                new BadRequestException(
                                        "Employee not found"
                                )
                        );

        String token =
                jwtService.generateToken(
                        employee.getEmployeeId()
                );

        return new LoginResponse(
                "Login successful",
                token,
                employee.getEmployeeId(),
                employee.getName()
        );
    }

    public String logout(String token) {

        if (token != null &&
                !token.isBlank()) {

            blacklistService.blacklist(token);
        }

        return "Logout successful";
    }
}