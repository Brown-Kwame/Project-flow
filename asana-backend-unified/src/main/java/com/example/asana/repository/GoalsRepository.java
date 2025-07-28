package com.example.asana.repository;

import com.example.asana.model.Goals;
import com.example.asana.model.GoalsStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GoalsRepository extends JpaRepository<Goals, Long> {
    
    List<Goals> findByWorkspaceId(Long workspaceId);
    
    List<Goals> findByOwnerUserId(Long ownerUserId);
    
    List<Goals> findByStatus(GoalsStatus status);
    
    Optional<Goals> findByNameAndWorkspaceId(String name, Long workspaceId);
} 