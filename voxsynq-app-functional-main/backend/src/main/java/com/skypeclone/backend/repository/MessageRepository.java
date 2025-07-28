package com.skypeclone.backend.repository;

import java.time.Instant;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.skypeclone.backend.model.Group;
import com.skypeclone.backend.model.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    // Custom query to find all messages between two users, in either direction.
    // It orders them by timestamp to create the conversation history.
    @Query("SELECT m FROM Message m WHERE (m.sender.id = ?1 AND m.recipient.id = ?2) OR (m.sender.id = ?2 AND m.recipient.id = ?1) ORDER BY m.timestamp ASC")
    List<Message> findChatHistory(Long userId1, Long userId2);

    // ... inside the MessageRepository interface

    // This query finds the latest message for each conversation a user is involved in.
    @Query(value = "SELECT m.* FROM messages m " +
            "INNER JOIN ( " +
            "    SELECT " +
            "        LEAST(sender_id, recipient_id) as user1, " +
            "        GREATEST(sender_id, recipient_id) as user2, " +
            "        MAX(timestamp) as max_timestamp " +
            "    FROM messages " +
            "    WHERE sender_id = ?1 OR recipient_id = ?1 " +
            "    GROUP BY user1, user2 " +
            ") AS latest ON " +
            "((m.sender_id = latest.user1 AND m.recipient_id = latest.user2) OR (m.sender_id = latest.user2 AND m.recipient_id = latest.user1)) " +
            "AND m.timestamp = latest.max_timestamp", nativeQuery = true)
    List<Message> findLatestMessageForEachConversation(Long userId);

    List<Message> findByGroupIdOrderByTimestampDesc(Long groupId);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.group = :group AND m.timestamp > :timestamp AND m.sender <> :user")
    long countByGroupAndTimestampGreaterThan(@Param("group") Group group, @Param("timestamp") Instant timestamp, @Param("user") com.skypeclone.backend.model.User user);

    @Query("SELECT COUNT(m) FROM Message m WHERE ((m.sender = :user1 AND m.recipient = :user2) OR (m.sender = :user2 AND m.recipient = :user1)) AND m.timestamp > :timestamp AND m.sender <> :user1")
    long countByUsersAndTimestampGreaterThan(@Param("user1") com.skypeclone.backend.model.User user1, @Param("user2") com.skypeclone.backend.model.User user2, @Param("timestamp") java.time.Instant timestamp, @Param("user1") com.skypeclone.backend.model.User sender);
}