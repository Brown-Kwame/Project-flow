package com.example.goals;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GoalsRepository extends JpaRepository<Goals, Long> {
    // Find all goals within a specific workspace
    List<Goals> findByWorkspaceId(Long workspaceId);

    // Find all goals owned by a specific user
    List<Goals> findByOwnerUserId(Long ownerUserId);

    // Find goals by status
    List<Goals> findByStatus(GoalsStatus status);

    // Find a goal by name within a specific workspace (useful for uniqueness checks)
    Optional<Goals> findByNameAndWorkspaceId(String name, Long workspaceId);
}