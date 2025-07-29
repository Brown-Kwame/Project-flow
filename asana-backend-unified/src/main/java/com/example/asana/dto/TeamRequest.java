package com.example.asana.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class TeamRequest {
    @NotBlank(message = "Team name is required")
    private String name;
    
    private String description;
    
    private Long ownerUserId;
} 