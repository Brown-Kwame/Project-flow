package com.example.asana.service;

import com.example.asana.exception.ResourceNotFoundException;
import com.example.asana.model.Project;
import com.example.asana.model.ProjectStatus;
import com.example.asana.model.User;
import com.example.asana.repository.ProjectRepository;
import com.example.asana.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project createProject(String name, String description, ProjectStatus status,
                                 Long ownerUserId, Long workspaceId, LocalDate startDate, LocalDate dueDate, Long portfolioId) {
        User ownerUser = userRepository.findById(ownerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + ownerUserId));

        Project project = new Project();
        project.setName(name);
        project.setDescription(description);
        project.setStatus(status != null ? status : ProjectStatus.NOT_STARTED);
        project.setOwnerUser(ownerUser);
        project.setWorkspaceId(workspaceId);
        project.setStartDate(startDate);
        project.setDueDate(dueDate);
        project.setPortfolioId(portfolioId);
        
        return projectRepository.save(project);
    }

    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    public Optional<Project> updateProject(Long id, String name, String description, ProjectStatus status,
                                          LocalDate startDate, LocalDate dueDate) {
        return projectRepository.findById(id).map(project -> {
            if (name != null) project.setName(name);
            if (description != null) project.setDescription(description);
            if (status != null) project.setStatus(status);
            if (startDate != null) project.setStartDate(startDate);
            if (dueDate != null) project.setDueDate(dueDate);
            return projectRepository.save(project);
        });
    }

    public boolean deleteProject(Long id) {
        if (projectRepository.existsById(id)) {
            projectRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Project> getProjectsByWorkspaceId(Long workspaceId) {
        return projectRepository.findByWorkspaceId(workspaceId);
    }

    public List<Project> getProjectsByOwnerUserId(Long ownerUserId) {
        return projectRepository.findByOwnerUser_Id(ownerUserId);
    }

    public boolean projectExistsInWorkspace(String name, Long workspaceId) {
        return projectRepository.findByNameAndWorkspaceId(name, workspaceId).isPresent();
    }
    
    public List<Project> getProjectsByPortfolioId(Long portfolioId) {
        return projectRepository.findByPortfolioId(portfolioId);
    }

    public List<Project> getProjectsByPortfolioIdAndUserId(Long portfolioId, Long userId) {
        return projectRepository.findByPortfolioIdAndOwnerUser_Id(portfolioId, userId);
    }

    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }
} 