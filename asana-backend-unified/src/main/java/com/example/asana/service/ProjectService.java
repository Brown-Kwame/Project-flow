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
        try {
            System.out.println("ProjectService.createProject called");
            System.out.println("Project name: " + name);
            System.out.println("Project description: " + description);
            System.out.println("Owner user ID: " + ownerUserId);
            System.out.println("Workspace ID: " + workspaceId);
            System.out.println("Status: " + status);
            
            User ownerUser = userRepository.findById(ownerUserId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + ownerUserId));
            System.out.println("Found owner user: " + ownerUser.getUsername());

            Project project = new Project();
            project.setName(name);
            project.setDescription(description);
            project.setStatus(status != null ? status : ProjectStatus.NOT_STARTED);
            project.setOwnerUser(ownerUser);
            project.setWorkspaceId(workspaceId);
            project.setStartDate(startDate);
            project.setDueDate(dueDate);
            project.setPortfolioId(portfolioId);
            
            System.out.println("Saving project to database...");
            Project savedProject = projectRepository.save(project);
            System.out.println("Project saved with ID: " + savedProject.getId());
            return savedProject;
        } catch (Exception e) {
            System.err.println("Error in ProjectService.createProject: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
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

    public Project createTeamProject(String name, String description, ProjectStatus status,
                                    Long ownerUserId, Long workspaceId, Long teamId, 
                                    LocalDate startDate, LocalDate dueDate, Long portfolioId) {
        try {
            System.out.println("ProjectService.createTeamProject called");
            System.out.println("Project name: " + name);
            System.out.println("Team ID: " + teamId);
            System.out.println("Owner user ID: " + ownerUserId);
            
            User ownerUser = userRepository.findById(ownerUserId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + ownerUserId));
            System.out.println("Found owner user: " + ownerUser.getUsername());

            Project project = new Project();
            project.setName(name);
            project.setDescription(description);
            project.setStatus(status != null ? status : ProjectStatus.NOT_STARTED);
            project.setOwnerUser(ownerUser);
            project.setWorkspaceId(workspaceId);
            project.setStartDate(startDate);
            project.setDueDate(dueDate);
            project.setPortfolioId(portfolioId);
            
            // Add team-specific metadata (you can extend the Project model if needed)
            // For now, we'll use the description to indicate it's a team project
            if (description != null && !description.isEmpty()) {
                project.setDescription(description + " [Team Project]");
            } else {
                project.setDescription("[Team Project]");
            }
            
            System.out.println("Saving team project to database...");
            Project savedProject = projectRepository.save(project);
            System.out.println("Team project saved with ID: " + savedProject.getId());
            return savedProject;
        } catch (Exception e) {
            System.err.println("Error in ProjectService.createTeamProject: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
} 