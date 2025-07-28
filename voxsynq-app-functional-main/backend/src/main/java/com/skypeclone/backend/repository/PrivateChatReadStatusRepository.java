package com.skypeclone.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.skypeclone.backend.model.PrivateChatReadStatus;
import com.skypeclone.backend.model.User;

@Repository
public interface PrivateChatReadStatusRepository extends JpaRepository<PrivateChatReadStatus, Long> {
    Optional<PrivateChatReadStatus> findByUserAndOtherUser(User user, User otherUser);
} 