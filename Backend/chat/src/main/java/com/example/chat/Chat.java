package com.example.chat;

    

    import jakarta.persistence.*;
    import java.time.LocalDateTime;

    @Entity
    @Table(name = "chat_messages")
    public class Chat {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false)
        private Long senderId;

        @Column(nullable = false)
        private Long recipientId;

        @Column(columnDefinition = "TEXT", nullable = false)
        private String content;

        @Column(nullable = false)
        private LocalDateTime timestamp;

        @Column(nullable = false)
        private boolean readStatus;

        // Default constructor
        public Chat() {
        }

        // All-args constructor
        public Chat(Long id, Long senderId, Long recipientId, String content, LocalDateTime timestamp, boolean readStatus) {
            this.id = id;
            this.senderId = senderId;
            this.recipientId = recipientId;
            this.content = content;
            this.timestamp = timestamp;
            this.readStatus = readStatus;
        }

        // Getters and Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getSenderId() {
            return senderId;
        }

        public void setSenderId(Long senderId) {
            this.senderId = senderId;
        }

        public Long getRecipientId() {
            return recipientId;
        }

        public void setRecipientId(Long recipientId) {
            this.recipientId = recipientId;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public LocalDateTime getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
        }

        public boolean isReadStatus() {
            return readStatus;
        }

        public void setReadStatus(boolean readStatus) {
            this.readStatus = readStatus;
        }

        @PrePersist
        protected void onCreate() {
            this.timestamp = LocalDateTime.now();
            this.readStatus = false;
        }
    }
    