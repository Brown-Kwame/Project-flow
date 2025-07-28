package com.example.asana.dto;

import lombok.Data;

@Data
public class TeamRequest {
    private String name;
    private String description;
    private Long ownerUserId;
} 