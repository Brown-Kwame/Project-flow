package com.example.asana.dto;

import com.example.asana.model.TaskPriority;
import com.example.asana.model.TaskStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UpdateTaskRequest {
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDateTime dueDate;
    private Long projectId;
} 