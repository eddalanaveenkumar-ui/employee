package com.example.employeeapp.service;

import com.example.employeeapp.dto.ChangePasswordRequest;
import com.example.employeeapp.dto.EmployeeResponse;

import com.example.employeeapp.entity.Employee;

import com.example.employeeapp.exception.BadRequestException;
import com.example.employeeapp.exception.ResourceNotFoundException;

import com.example.employeeapp.repository.EmployeeRepository;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileService(
            EmployeeRepository employeeRepository,
            PasswordEncoder passwordEncoder) {

        this.employeeRepository =
                employeeRepository;

        this.passwordEncoder =
                passwordEncoder;
    }

    public EmployeeResponse getProfile(
            String email) {

        Employee employee =
                employeeRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee not found"
                                )
                        );

        return new EmployeeResponse(employee);
    }

    public String changePassword(
            String email,
            ChangePasswordRequest request) {

        Employee employee =
                employeeRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee not found"
                                )
                        );

        // Verify current password
        boolean passwordCorrect =
                passwordEncoder.matches(
                        request.getCurrentPassword(),
                        employee.getPasswordHash()
                );

        if (!passwordCorrect) {

            throw new BadRequestException(
                    "Current password is incorrect"
            );
        }

        // New password must be different
        if (request.getCurrentPassword()
                .equals(request.getNewPassword())) {

            throw new BadRequestException(
                    "New password must be different"
            );
        }

        // Hash new password
        String newPasswordHash =
                passwordEncoder.encode(
                        request.getNewPassword()
                );

        employee.setPasswordHash(
                newPasswordHash
        );

        employeeRepository.save(employee);

        return "Password changed successfully";
    }
}