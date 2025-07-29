package com.example.asana.controller;

import com.example.asana.model.Chat;
import com.example.asana.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    public ChatWebSocketController(SimpMessagingTemplate messagingTemplate, ChatService chatService) {
        this.messagingTemplate = messagingTemplate;
        this.chatService = chatService;
    }

    // Handle incoming chat messages
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload Chat chat) {
        // Save the message to the database
        Chat savedMessage = chatService.saveChatMessage(chat);
        // Use shared chatId for private chats if present
        if (chat.getChatId() != null && !chat.getChatId().isEmpty()) {
            messagingTemplate.convertAndSend("/topic/chat." + chat.getChatId(), savedMessage);
        } else {
            // Fallback for group chats or legacy: broadcast to recipient and sender
            messagingTemplate.convertAndSend("/topic/chat." + savedMessage.getRecipientId(), savedMessage);
            messagingTemplate.convertAndSend("/topic/chat." + savedMessage.getSenderId(), savedMessage);
        }
    }

    // Handle typing indicator
    @MessageMapping("/chat.typing")
    public void typing(@Payload TypingIndicator indicator) {
        messagingTemplate.convertAndSend("/topic/chat." + indicator.getChatId() + ".typing", indicator);
    }

    // TypingIndicator class
    public static class TypingIndicator {
        private Long chatId;
        private Long userId;
        private boolean isTyping;

        public TypingIndicator() {}
        public TypingIndicator(Long chatId, Long userId, boolean isTyping) {
            this.chatId = chatId;
            this.userId = userId;
            this.isTyping = isTyping;
        }
        public Long getChatId() { return chatId; }
        public void setChatId(Long chatId) { this.chatId = chatId; }
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public boolean isTyping() { return isTyping; }
        public void setTyping(boolean typing) { isTyping = typing; }
    }
} 