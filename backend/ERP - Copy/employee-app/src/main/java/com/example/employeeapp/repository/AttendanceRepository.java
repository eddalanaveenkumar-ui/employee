package com.example.employeeapp.repository;

import com.example.employeeapp.entity.Attendance;
import com.example.employeeapp.entity.Employee;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {

    Optional<Attendance> findByEmployeeAndAttendanceDate(
            Employee employee,
            LocalDate date
    );

    List<Attendance> findByEmployeeOrderByAttendanceDateDesc(
            Employee employee
    );

    long countByEmployee(Employee employee);

    long countByEmployeeAndStatus(
            Employee employee,
            String status
    );
}