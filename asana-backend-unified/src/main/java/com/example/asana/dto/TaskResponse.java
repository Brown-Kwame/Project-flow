package com.example.asana.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private String status;
    private String priority;
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long userId;
    private Long projectId;

    public TaskResponse(Long id, String title, String description, String status, String priority, 
                       LocalDateTime dueDate, LocalDateTime createdAt, LocalDateTime updatedAt, 
                       Long userId, Long projectId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.dueDate = dueDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.userId = userId;
        this.projectId = projectId;
    }
} 