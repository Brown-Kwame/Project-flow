package com.example.asana.controller;

import com.example.asana.dto.SendMessageRequest;
import com.example.asana.model.Chat;
import com.example.asana.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping("/history")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Chat>> getAllChatHistory() {
        try {
            List<Chat> history = chatService.getAllChatHistory();
            return new ResponseEntity<>(history, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/send")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Chat> sendMessage(@RequestBody SendMessageRequest request) {
        Chat message = new Chat();
        message.setSenderId(request.getSenderId());
        message.setRecipientId(request.getRecipientId());
        message.setContent(request.getContent());
        Chat savedMessage = chatService.saveChatMessage(message);
        return new ResponseEntity<>(savedMessage, HttpStatus.CREATED);
    }

    @GetMapping("/history/{user1Id}/{user2Id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Chat>> getChatHistory(@PathVariable Long user1Id, @PathVariable Long user2Id) {
        List<Chat> history = chatService.getChatHistory(user1Id, user2Id);
        chatService.markMessagesAsRead(user2Id, user1Id);
        return new ResponseEntity<>(history, HttpStatus.OK);
    }

    @GetMapping("/unread/from/{senderId}/to/{recipientId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Integer> getUnreadCount(@PathVariable Long senderId, @PathVariable Long recipientId) {
        int count = chatService.getUnreadMessageCount(senderId, recipientId);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/unread/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Integer> getTotalUnreadMessages(@PathVariable Long userId) {
        int count = chatService.getTotalUnreadMessages(userId);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @PutMapping("/mark-read/from/{senderId}/to/{recipientId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> markMessagesAsRead(@PathVariable Long senderId, @PathVariable Long recipientId) {
        chatService.markMessagesAsRead(senderId, recipientId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
} 