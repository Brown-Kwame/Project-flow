package com.example.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    // Create a new project
    public Project createProject(String name, String description, ProjectStatus status,
                                 Long ownerUserId, Long workspaceId, LocalDate startDate, LocalDate dueDate) {
        Project project = new Project();
        project.setName(name);
        project.setDescription(description);
        project.setStatus(status != null ? status : ProjectStatus.NOT_STARTED);
        project.setOwnerUserId(ownerUserId);
        project.setWorkspaceId(workspaceId);
        project.setStartDate(startDate);
        project.setDueDate(dueDate);
        return projectRepository.save(project);
    }

    // Get a project by ID
    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    // Update an existing project
    public Optional<Project> updateProject(Long id, String name, String description, ProjectStatus status,
                                          LocalDate startDate, LocalDate dueDate) {
        return projectRepository.findById(id).map(project -> {
            if (name != null) project.setName(name);
            if (description != null) project.setDescription(description);
            if (status != null) project.setStatus(status);
            if (startDate != null) project.setStartDate(startDate);
            if (dueDate != null) project.setDueDate(dueDate);
            // ownerUserId and workspaceId are typically not updated directly via this method
            return projectRepository.save(project);
        });
    }

    // Delete a project
    public boolean deleteProject(Long id) {
        if (projectRepository.existsById(id)) {
            projectRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Get all projects for a specific workspace
    public List<Project> getProjectsByWorkspaceId(Long workspaceId) {
        return projectRepository.findByWorkspaceId(workspaceId);
    }

    // Get all projects owned by a specific user
    public List<Project> getProjectsByOwnerUserId(Long ownerUserId) {
        return projectRepository.findByOwnerUserId(ownerUserId);
    }

    // Check if a project name already exists within a workspace
    public boolean projectExistsInWorkspace(String name, Long workspaceId) {
        return projectRepository.findByNameAndWorkspaceId(name, workspaceId).isPresent();
    }
    
    // NEW: Get all projects for a specific portfolio ID
    public List<Project> getProjectsByPortfolioId(Long portfolioId) {
        return projectRepository.findByPortfolioId(portfolioId);
    }

    // NEW: Get all projects for a specific portfolio ID and user ID (for ownership check)
    public List<Project> getProjectsByPortfolioIdAndUserId(Long portfolioId, Long userId) {
        return projectRepository.findByPortfolioIdAndOwnerUserId(portfolioId, userId);
    }
}