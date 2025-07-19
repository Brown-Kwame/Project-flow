package com.example.chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.chat.Chat;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {

    // Find all messages between two users (for a one-on-one chat history)
    // Order by timestamp to get messages in chronological order
    List<Chat> findBySenderIdAndRecipientIdOrderByTimestampAsc(Long senderId, Long recipientId);

    // Find all messages where the current user is either sender or recipient
    // This is useful for getting a list of all conversations a user is part of.
    List<Chat> findBySenderIdOrRecipientIdOrderByTimestampAsc(Long senderId, Long recipientId);

    // Find unread messages for a specific recipient from a specific sender
    List<Chat> findBySenderIdAndRecipientIdAndReadStatusFalse(Long senderId, Long recipientId);

    // Find all unread messages for a specific recipient
    List<Chat> findByRecipientIdAndReadStatusFalse(Long recipientId);
}
