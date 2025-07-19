package com.example.project;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    // Find all projects within a specific workspace
    List<Project> findByWorkspaceId(Long workspaceId);

    // Find all projects owned by a specific user
    List<Project> findByOwnerUserId(Long ownerUserId);

    // Find a project by name within a specific workspace (useful for uniqueness checks)
    Optional<Project> findByNameAndWorkspaceId(String name, Long workspaceId);

    // NEW: Find projects by portfolioId
    List<Project> findByPortfolioId(Long portfolioId);

    // NEW: Find projects by portfolioId and userId (for ownership check)
    List<Project> findByPortfolioIdAndOwnerUserId(Long portfolioId, Long ownerUserId);
}