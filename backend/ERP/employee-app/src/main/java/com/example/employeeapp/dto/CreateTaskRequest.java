package com.example.employeeapp.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateTaskRequest {

    @NotBlank(message = "Task name is required")
    private String taskName;

    @NotNull(message = "Completion percentage is required")
    @Min(value = 0, message = "Completion percentage must be at least 0")
    @Max(value = 100, message = "Completion percentage cannot be greater than 100")
    private Integer completionPercentage;

    @NotBlank(message = "Employee ID is required")
    private String employeeId;

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public Integer getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(Integer completionPercentage) {
        this.completionPercentage = completionPercentage;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }
}
