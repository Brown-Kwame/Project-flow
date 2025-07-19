package com.example.chat; // Correct package

import com.example.chat.Chat; // Import ChatMessage entity
import com.example.chat.ChatRepository; // Import ChatMessageRepository
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Comparator; // For sorting

@Service
public class ChatService { // Public access

    @Autowired
    private ChatRepository chatMessageRepository;

    public Chat saveChatMessage(Chat chatMessage) {
        return chatMessageRepository.save(chatMessage);
    }

    public List<Chat> getChatHistory(Long user1Id, Long user2Id) {
        List<Chat> messages1 = chatMessageRepository.findBySenderIdAndRecipientIdOrderByTimestampAsc(user1Id, user2Id);
        List<Chat> messages2 = chatMessageRepository.findBySenderIdAndRecipientIdOrderByTimestampAsc(user2Id, user1Id);

        messages1.addAll(messages2);
        // Sort the combined list by timestamp
        messages1.sort(Comparator.comparing(Chat::getTimestamp));
        return messages1;
    }

    public void markMessagesAsRead(Long senderId, Long recipientId) {
        List<Chat> unreadMessages = chatMessageRepository.findBySenderIdAndRecipientIdAndReadStatusFalse(senderId, recipientId);
        unreadMessages.forEach(message -> message.setReadStatus(true));
        chatMessageRepository.saveAll(unreadMessages);
    }

    public int getUnreadMessageCount(Long senderId, Long recipientId) {
        return chatMessageRepository.findBySenderIdAndRecipientIdAndReadStatusFalse(senderId, recipientId).size();
    }

    public int getTotalUnreadMessages(Long userId) {
        return chatMessageRepository.findByRecipientIdAndReadStatusFalse(userId).size();
    }
}
