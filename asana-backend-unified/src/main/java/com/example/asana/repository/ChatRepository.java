package com.example.asana.repository;

import com.example.asana.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    
    @Query("SELECT c FROM Chat c WHERE " +
           "(c.senderId = :user1Id AND c.recipientId = :user2Id) OR " +
           "(c.senderId = :user2Id AND c.recipientId = :user1Id) " +
           "ORDER BY c.createdAt ASC")
    List<Chat> findChatHistory(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);
    
    @Query("SELECT COUNT(c) FROM Chat c WHERE c.senderId = :senderId AND c.recipientId = :recipientId AND c.isRead = false")
    int countUnreadMessages(@Param("senderId") Long senderId, @Param("recipientId") Long recipientId);
    
    @Query("SELECT COUNT(c) FROM Chat c WHERE c.recipientId = :userId AND c.isRead = false")
    int countTotalUnreadMessages(@Param("userId") Long userId);
    
    @Query("SELECT DISTINCT c FROM Chat c WHERE c.senderId = :userId OR c.recipientId = :userId " +
           "ORDER BY c.createdAt DESC")
    List<Chat> findConversationsForUser(@Param("userId") Long userId);
} 