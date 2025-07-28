package com.example.asana.dto;

import com.example.asana.model.GoalsStatus;
import lombok.Data;
import java.time.LocalDate;

@Data
public class GoalRequest {
    private String name;
    private String description;
    private GoalsStatus status;
    private Long ownerUserId;
    private Long workspaceId;
    private LocalDate startDate;
    private LocalDate dueDate;
    private Double targetValue;
    private Double currentValue;
    private String unit;
} 