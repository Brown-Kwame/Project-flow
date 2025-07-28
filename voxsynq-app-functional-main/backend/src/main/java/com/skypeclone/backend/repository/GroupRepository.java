package com.skypeclone.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.skypeclone.backend.model.Group;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {
} 