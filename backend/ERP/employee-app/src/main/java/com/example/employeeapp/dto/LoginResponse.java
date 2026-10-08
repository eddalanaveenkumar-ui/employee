package com.example.employeeapp.dto;

public class LoginResponse {

    private String message;
    private String token;
    private String employeeId;
    private String name;

    public LoginResponse(
            String message,
            String token,
            String employeeId,
            String name) {

        this.message = message;
        this.token = token;
        this.employeeId = employeeId;
        this.name = name;
    }

    public String getMessage() {
        return message;
    }

    public String getToken() {
        return token;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public String getName() {
        return name;
    }
}