package com.skypeclone.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.skypeclone.backend.model.Group;
import com.skypeclone.backend.model.GroupReadStatus;
import com.skypeclone.backend.model.User;

@Repository
public interface GroupReadStatusRepository extends JpaRepository<GroupReadStatus, Long> {
    Optional<GroupReadStatus> findByUserAndGroup(User user, Group group);
    java.util.List<GroupReadStatus> findAllByGroup(Group group);
} 