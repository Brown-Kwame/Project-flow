package com.skypeclone.backend.controller;

import com.skypeclone.backend.dto.MessageDto;
import com.skypeclone.backend.model.Message;
import com.skypeclone.backend.service.MessageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.messaging.handler.annotation.MessageMapping;

@Controller
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    @Autowired
    private MessageService messageService;

    // We will use the messagingTemplate to send ALL messages manually.
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * This is the final, corrected version for handling private messages.
     * It does not use @SendTo, which was causing the issue. Instead, it manually
     * sends messages to both the sender and the recipient using SimpMessagingTemplate.
     */
    @MessageMapping("/chat.privateMessage")
    public void processPrivateMessage(@Payload MessageDto messageDto) {
        logger.info("[BACKEND] Received DTO: sender={}, recipient={}", messageDto.getSenderUsername(), messageDto.getRecipientUsername());

        // 1. Save the message to the database
        Message savedMessage = messageService.saveMessage(messageDto);
        MessageDto savedMessageDto = messageService.convertToDto(savedMessage);

        // --- THE CRITICAL FIX IS HERE ---

        // 2. Define the destination for the recipient.
        String recipientDestination = "/topic/messages." + savedMessageDto.getRecipientUsername();
        logger.info("[BACKEND] Sending message to RECIPIENT at: {}", recipientDestination);
        // Explicitly send the message to the recipient.
        messagingTemplate.convertAndSend(recipientDestination, savedMessageDto);

        // 3. Define the destination for the sender (for confirmation/sync).
        String senderDestination = "/topic/messages." + savedMessageDto.getSenderUsername();
        logger.info("[BACKEND] Sending confirmation to SENDER at: {}", senderDestination);
        // Explicitly send the message back to the sender.
        messagingTemplate.convertAndSend(senderDestination, savedMessageDto);
    }
}