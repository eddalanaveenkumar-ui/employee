package com.example.employeeapp.security;

import com.example.employeeapp.entity.Employee;
import com.example.employeeapp.repository.EmployeeRepository;

import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService
        implements UserDetailsService {

    private final EmployeeRepository employeeRepository;

    public CustomUserDetailsService(
            EmployeeRepository employeeRepository) {

        this.employeeRepository = employeeRepository;
    }

    @Override
    public UserDetails loadUserByUsername(
            String employeeId)
            throws UsernameNotFoundException {

        Employee employee =
                employeeRepository.findByEmployeeId(employeeId)
                        .orElseThrow(() ->
                                new UsernameNotFoundException(
                                        "Employee not found"
                                )
                        );

        return User.builder()
                .username(employee.getEmail())
                .password(employee.getPasswordHash())
                .roles("EMPLOYEE")
                .build();
    }
}