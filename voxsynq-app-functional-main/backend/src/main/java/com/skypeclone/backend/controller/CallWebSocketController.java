package com.skypeclone.backend.controller;

import java.security.Principal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.skypeclone.backend.dto.CallSignalMessage;

@Controller
public class CallWebSocketController {
    private static final Logger logger = LoggerFactory.getLogger(CallWebSocketController.class);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/call.signal")
    public void handleCallSignal(@Payload CallSignalMessage message, Principal principal) {
        logger.info("Received call signal: {} from {} to {}", message.getType(), message.getFromUserId(), message.getToUserId());
        // Removed authentication check to allow signaling without authentication
        // Forward the message to the recipient's topic
        String destination = "/topic/call/" + message.getToUserId();
        messagingTemplate.convertAndSend(destination, message);
    }
} 