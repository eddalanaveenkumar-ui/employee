package com.example.employeeapp.service;

import com.example.employeeapp.dto.AttendanceResponse;
import com.example.employeeapp.entity.Attendance;
import com.example.employeeapp.entity.Employee;
import com.example.employeeapp.exception.BadRequestException;
import com.example.employeeapp.exception.ResourceNotFoundException;
import com.example.employeeapp.repository.AttendanceRepository;
import com.example.employeeapp.repository.EmployeeRepository;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    public AttendanceService(
            AttendanceRepository attendanceRepository,
            EmployeeRepository employeeRepository) {

        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
    }

    private Employee getEmployee(String email) {

        return employeeRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found"
                        )
                );
    }

    // GET /api/attendance/today
    public AttendanceResponse getToday(String email) {

        Employee employee = getEmployee(email);

        Attendance attendance =
                attendanceRepository
                        .findByEmployeeAndAttendanceDate(
                                employee,
                                LocalDate.now()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "No attendance record for today"
                                )
                        );

        return new AttendanceResponse(attendance);
    }

    // POST /api/attendance/check-in
    public AttendanceResponse checkIn(String email) {

        Employee employee = getEmployee(email);

        LocalDate today = LocalDate.now();

        if (attendanceRepository
                .findByEmployeeAndAttendanceDate(
                        employee,
                        today
                )
                .isPresent()) {

            throw new BadRequestException(
                    "Attendance already marked for today"
            );
        }

        Attendance attendance = new Attendance();

        attendance.setEmployee(employee);
        attendance.setAttendanceDate(today);
        attendance.setCheckIn(LocalDateTime.now());
        attendance.setStatus("PRESENT");

        Attendance saved =
                attendanceRepository.save(attendance);

        return new AttendanceResponse(saved);
    }

    // POST /api/attendance/check-out
    public AttendanceResponse checkOut(String email) {

        Employee employee = getEmployee(email);

        Attendance attendance =
                attendanceRepository
                        .findByEmployeeAndAttendanceDate(
                                employee,
                                LocalDate.now()
                        )
                        .orElseThrow(() ->
                                new BadRequestException(
                                        "Please check in first"
                                )
                        );

        if (attendance.getCheckOut() != null) {

            throw new BadRequestException(
                    "Already checked out"
            );
        }

        LocalDateTime now = LocalDateTime.now();

        long secondsElapsed =
                Duration.between(
                        attendance.getCheckIn(),
                        now
                ).getSeconds();

        // Backend enforces the real 1-minute rule
        if (secondsElapsed < 60) {

            throw new BadRequestException(
                    "Check-out is allowed only after 1 minute from check-in"
            );
        }

        attendance.setCheckOut(now);

        Attendance saved =
                attendanceRepository.save(attendance);

        return new AttendanceResponse(saved);
    }

    // GET /api/attendance/percentage
    public double getAttendancePercentage(
            String email) {

        Employee employee = getEmployee(email);

        long total =
                attendanceRepository.countByEmployee(employee);

        if (total == 0) {
            return 0.0;
        }

        long present =
                attendanceRepository
                        .countByEmployeeAndStatus(
                                employee,
                                "PRESENT"
                        );

        return Math.round(
                ((double) present / total) * 10000
        ) / 100.0;
    }

    // GET /api/attendance/history
    public List<AttendanceResponse> getHistory(
            String email) {

        Employee employee = getEmployee(email);

        return attendanceRepository
                .findByEmployeeOrderByAttendanceDateDesc(
                        employee
                )
                .stream()
                .map(AttendanceResponse::new)
                .toList();
    }
}