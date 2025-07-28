package com.skypeclone.backend.dto;

import java.time.Instant;

import lombok.Data;

@Data
public class MessageDto {
    private Long id;
    private Long senderId;
    private String senderUsername;
    private Long recipientId;
    private String recipientUsername;
    private String content;
    private String imageUrl;
    private String audioUrl;
    private Instant timestamp;
    private Long audioDurationMillis;
    private Long groupId;
    private String senderProfilePictureUrl;
    private String recipientProfilePictureUrl;
}