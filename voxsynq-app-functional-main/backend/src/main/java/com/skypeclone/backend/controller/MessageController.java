package com.skypeclone.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.skypeclone.backend.dto.MessageDto;
import com.skypeclone.backend.model.User;
import com.skypeclone.backend.repository.GroupMemberRepository;
import com.skypeclone.backend.security.services.UserDetailsImpl;
import com.skypeclone.backend.service.MessageService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private GroupMemberRepository groupMemberRepository;
    @Autowired
    private com.skypeclone.backend.repository.UserRepository userRepository;

    // This endpoint handles fetching the list of all conversations for the logged-in user.
    @GetMapping("/conversations")
    public ResponseEntity<List<MessageDto>> getMyConversations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long currentUserId = userDetails.getId();

        return ResponseEntity.ok(messageService.getConversations(currentUserId));
    }

    // --- THE CORRECTED ENDPOINT ---
    // This endpoint handles fetching the specific message history between two users.
    // The path is now "/history/{otherUserId}", making it unambiguous.
    @GetMapping("/history/{otherUserId}")
    public ResponseEntity<List<MessageDto>> getChatHistory(@PathVariable Long otherUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long currentUserId = userDetails.getId();

        List<MessageDto> chatHistory = messageService.getChatHistory(currentUserId, otherUserId);
        return ResponseEntity.ok(chatHistory);
    }

    // --- GROUP CHAT ENDPOINTS ---
    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<MessageDto>> getGroupMessages(@PathVariable Long groupId) {
        return ResponseEntity.ok(messageService.getGroupMessages(groupId));
    }

    @PostMapping("/group/{groupId}")
    public ResponseEntity<MessageDto> sendGroupMessage(@PathVariable Long groupId, @RequestBody MessageDto messageDto) {
        MessageDto saved = messageService.saveGroupMessage(groupId, messageDto);

        // Broadcast to all group members
        List<com.skypeclone.backend.model.GroupMember> members = groupMemberRepository.findAllByGroupId(groupId);
        for (com.skypeclone.backend.model.GroupMember member : members) {
            User user = member.getUser();
            String destination = "/topic/messages." + user.getUsername();
            messagingTemplate.convertAndSend(destination, saved);
        }

        return ResponseEntity.ok(saved);
    }

    @PutMapping("/private/{otherUserId}/read")
    public ResponseEntity<?> updateLastReadPrivate(@PathVariable Long otherUserId, @RequestParam Long timestamp, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        User otherUser = userRepository.findById(otherUserId).orElseThrow();
        messageService.updateLastReadTimestampPrivate(user, otherUser, timestamp);
        // Broadcast new read status to both users
        com.skypeclone.backend.model.PrivateChatReadStatus status = messageService.getPrivateChatReadStatus(user, otherUser);
        long lastReadTimestamp = status != null ? status.getLastReadTimestamp() : 0L;
        java.util.Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("userId", user.getId());
        payload.put("otherUserId", otherUser.getId());
        payload.put("lastReadTimestamp", lastReadTimestamp);
        String dest1 = "/topic/read-status.private.user." + user.getId() + ".other." + otherUser.getId();
        String dest2 = "/topic/read-status.private.user." + otherUser.getId() + ".other." + user.getId();
        messagingTemplate.convertAndSend(dest1, payload);
        messagingTemplate.convertAndSend(dest2, payload);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/private/{otherUserId}/unread-count")
    public ResponseEntity<Long> getUnreadCountPrivate(@PathVariable Long otherUserId, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        User otherUser = userRepository.findById(otherUserId).orElseThrow();
        long count = messageService.getUnreadCountPrivate(user, otherUser);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/private/{otherUserId}/read-status")
    public ResponseEntity<?> getPrivateReadStatus(@PathVariable Long otherUserId, Authentication authentication) {
        String username = authentication.getName();
        User sender = userRepository.findByUsername(username).orElseThrow();
        User recipient = userRepository.findById(otherUserId).orElseThrow();
        // Swap sender/recipient: get the recipient's read status for the sender's messages
        com.skypeclone.backend.model.PrivateChatReadStatus status = messageService.getPrivateChatReadStatus(recipient, sender);
        long lastReadTimestamp = status != null ? status.getLastReadTimestamp() : 0L;
        return ResponseEntity.ok(java.util.Collections.singletonMap("lastReadTimestamp", lastReadTimestamp));
    }
}