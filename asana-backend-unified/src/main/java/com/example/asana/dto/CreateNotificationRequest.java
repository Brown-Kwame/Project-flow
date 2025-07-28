package com.example.asana.dto;

import lombok.Data;

@Data
public class CreateNotificationRequest {
    private Long userId;
    private String message;
    private String type;
    private Long targetId;
    private String targetType;
} 