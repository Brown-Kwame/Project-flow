package com.example.asana.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TeamResponse {
    private Long id;
    private String name;
    private String description;
    private Long ownerUserId;
    private String ownerUsername;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TeamResponse(Long id, String name, String description, Long ownerUserId, String ownerUsername, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.ownerUserId = ownerUserId;
        this.ownerUsername = ownerUsername;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
} 