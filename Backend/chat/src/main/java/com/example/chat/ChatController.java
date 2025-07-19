package com.example.chat; // Correct package

    import com.example.chat.Chat;
    import com.example.chat.ChatService;
    // REMOVE Lombok imports: import lombok.Data; import lombok.NoArgsConstructor; import lombok.AllArgsConstructor;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;

    @RestController
    @RequestMapping("/api/chat")
    public class ChatController {

        @Autowired
        private ChatService chatService;

        // DTO for sending a message - MANUALLY IMPLEMENTED (NO LOMBOK)
        public static class SendMessageRequest {
            private Long senderId;
            private Long recipientId;
            private String content;

            // No-args constructor
            public SendMessageRequest() {
            }

            // All-args constructor
            public SendMessageRequest(Long senderId, Long recipientId, String content) {
                this.senderId = senderId;
                this.recipientId = recipientId;
                this.content = content;
            }

            // Getters
            public Long getSenderId() {
                return senderId;
            }

            public Long getRecipientId() {
                return recipientId;
            }

            public String getContent() {
                return content;
            }

            // Setters (optional, but good practice if needed for deserialization)
            public void setSenderId(Long senderId) {
                this.senderId = senderId;
            }

            public void setRecipientId(Long recipientId) {
                this.recipientId = recipientId;
            }

            public void setContent(String content) {
                this.content = content;
            }
        }

        @PostMapping("/send")
        public ResponseEntity<Chat> sendMessage(@RequestBody SendMessageRequest request) {
            Chat message = new Chat();
            message.setSenderId(request.getSenderId());
            message.setRecipientId(request.getRecipientId());
            message.setContent(request.getContent());
            Chat savedMessage = chatService.saveChatMessage(message);
            return new ResponseEntity<>(savedMessage, HttpStatus.CREATED);
        }

        @GetMapping("/history/{user1Id}/{user2Id}")
        public ResponseEntity<List<Chat>> getChatHistory(@PathVariable Long user1Id, @PathVariable Long user2Id) {
            List<Chat> history = chatService.getChatHistory(user1Id, user2Id);
            chatService.markMessagesAsRead(user2Id, user1Id);
            return new ResponseEntity<>(history, HttpStatus.OK);
        }

        @GetMapping("/unread/from/{senderId}/to/{recipientId}")
        public ResponseEntity<Integer> getUnreadCount(@PathVariable Long senderId, @PathVariable Long recipientId) {
            int count = chatService.getUnreadMessageCount(senderId, recipientId);
            return new ResponseEntity<>(count, HttpStatus.OK);
        }

        @GetMapping("/unread/{userId}")
        public ResponseEntity<Integer> getTotalUnreadMessages(@PathVariable Long userId) {
            int count = chatService.getTotalUnreadMessages(userId);
            return new ResponseEntity<>(count, HttpStatus.OK);
        }

        @PutMapping("/mark-read/from/{senderId}/to/{recipientId}")
        public ResponseEntity<Void> markMessagesAsRead(@PathVariable Long senderId, @PathVariable Long recipientId) {
            chatService.markMessagesAsRead(senderId, recipientId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }