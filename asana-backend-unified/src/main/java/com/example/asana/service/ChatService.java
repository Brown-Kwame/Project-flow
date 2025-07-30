package com.example.asana.service;

import com.example.asana.model.Chat;
import com.example.asana.repository.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    public List<Chat> getAllChatHistory() {
        return chatRepository.findAll();
    }

    public List<Chat> getConversationsForUser(Long userId) {
        return chatRepository.findConversationsForUser(userId);
    }

    @Transactional
    public Chat saveChatMessage(Chat message) {
        return chatRepository.save(message);
    }

    @Transactional(readOnly = true)
    public List<Chat> getChatHistory(Long user1Id, Long user2Id) {
        List<Chat> messages = chatRepository.findChatHistory(user1Id, user2Id);
        
        // Load replyToMessage for each message that has a replyToId
        for (Chat message : messages) {
            if (message.getReplyToId() != null) {
                Chat replyMessage = chatRepository.findById(message.getReplyToId()).orElse(null);
                message.setReplyToMessage(replyMessage);
            }
        }
        
        return messages;
    }

    public int getUnreadMessageCount(Long senderId, Long recipientId) {
        return chatRepository.countUnreadMessages(senderId, recipientId);
    }

    public int getTotalUnreadMessages(Long userId) {
        return chatRepository.countTotalUnreadMessages(userId);
    }

    @Transactional
    public void markMessagesAsRead(Long senderId, Long recipientId) {
        List<Chat> unreadMessages = chatRepository.findChatHistory(senderId, recipientId)
                .stream()
                .filter(message -> !message.getIsRead() && message.getSenderId().equals(senderId))
                .toList();

        for (Chat message : unreadMessages) {
            message.setIsRead(true);
            chatRepository.save(message);
        }
    }
} 