package com.example.asana.dto;

import lombok.Data;

@Data
public class SendMessageRequest {
    private Long senderId;
    private Long recipientId;
    private String content;
} 