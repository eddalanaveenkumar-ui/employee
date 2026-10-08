package com.example.employeeapp.repository;

import com.example.employeeapp.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository
        extends JpaRepository<Employee, Long> {

    Optional<Employee> findByEmail(String email);

    Optional<Employee> findByEmployeeId(String employeeId);

    boolean existsByEmail(String email);

    boolean existsByEmployeeId(String employeeId);

    List<Employee> findByDepartmentId(Long departmentId);
}