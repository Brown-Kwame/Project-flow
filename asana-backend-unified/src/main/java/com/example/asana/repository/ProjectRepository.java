package com.example.asana.repository;

import com.example.asana.model.Project;
import com.example.asana.model.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    List<Project> findByWorkspaceId(Long workspaceId);

    List<Project> findByOwnerUser_Id(Long ownerUserId);

    Optional<Project> findByNameAndWorkspaceId(String name, Long workspaceId);

    List<Project> findByPortfolioId(Long portfolioId);

    List<Project> findByPortfolioIdAndOwnerUser_Id(Long portfolioId, Long ownerUserId);
    
    List<Project> findByOwnerUser_IdAndStatus(Long ownerUserId, ProjectStatus status);
    
    List<Project> findByOwnerUser_IdIn(List<Long> ownerUserIds);
    
    List<Project> findByGoalIdAndStatus(Long goalId, ProjectStatus status);
    
    List<Project> findByGoalId(Long goalId);
} 