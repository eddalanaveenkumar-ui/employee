package com.example.employeeapp.repository;

import com.example.employeeapp.entity.Employee;
import com.example.employeeapp.entity.Task;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository
        extends JpaRepository<Task, Long> {

    List<Task> findByEmployee(Employee employee);

    Optional<Task> findByIdAndEmployee(
            Long id,
            Employee employee
    );
}