package com.skypeclone.backend.dto;

import lombok.Data;

@Data
public class ChatMessageDto {
    private String from; // The username of the sender
    private String to;   // The username of the recipient (for 1-on-1 chat later)
    private String text; // The message content
    private String type; // e.g., "CHAT", "JOIN", "LEAVE"
}