package com.example.asana.controller;

import com.example.asana.model.Project;
import com.example.asana.model.ProjectStatus;
import com.example.asana.service.ProjectService;
import com.example.asana.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Project>> getAllProjects() {
        try {
            // Get the authenticated user ID from security context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() instanceof UserDetailsImpl) {
                Long authenticatedUserId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
                List<Project> projects = projectService.getProjectsByOwnerUserId(authenticatedUserId);
                return new ResponseEntity<>(projects, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Project> createProject(@Valid @RequestBody ProjectRequest request) {
        System.out.println("=== PROJECT CREATION ENDPOINT CALLED ===");
        System.out.println("createProject endpoint called");
        System.out.println("Project name: " + request.getName());
        System.out.println("Project description: " + request.getDescription());
        System.out.println("Owner user ID: " + request.getOwnerUserId());
        System.out.println("Workspace ID: " + request.getWorkspaceId());
        
        if (request.getName() == null || request.getOwnerUserId() == null) {
            System.err.println("Missing required fields: name or ownerUserId");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // Use default workspace ID if not provided
        Long workspaceId = request.getWorkspaceId();
        if (workspaceId == null) {
            workspaceId = 1L; // Default workspace ID
            System.out.println("Using default workspace ID: " + workspaceId);
        }
        
        // Check if workspace exists (optional check)
        try {
            // For now, we'll assume workspace 1 exists
            System.out.println("Workspace validation skipped - assuming workspace " + workspaceId + " exists");
        } catch (Exception e) {
            System.err.println("Workspace validation error: " + e.getMessage());
        }

        if (projectService.projectExistsInWorkspace(request.getName(), workspaceId)) {
            System.err.println("Project already exists in workspace");
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        Project newProject = projectService.createProject(
                request.getName(),
                request.getDescription(),
                request.getStatus(),
                request.getOwnerUserId(),
                workspaceId,
                request.getStartDate(),
                request.getDueDate(),
                request.getPortfolioId()
        );
        System.out.println("Project created successfully: " + newProject.getId());
        return new ResponseEntity<>(newProject, HttpStatus.CREATED);
    }

    @PostMapping("/team/{teamId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Project> createTeamProject(@PathVariable Long teamId, @Valid @RequestBody ProjectRequest request) {
        try {
            System.out.println("=== TEAM PROJECT CREATION ENDPOINT CALLED ===");
            System.out.println("Team ID: " + teamId);
            System.out.println("Project name: " + request.getName());
            System.out.println("Project description: " + request.getDescription());
            System.out.println("Owner user ID: " + request.getOwnerUserId());
            
            if (request.getName() == null || request.getOwnerUserId() == null) {
                System.err.println("Missing required fields: name or ownerUserId");
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            // Use default workspace ID if not provided
            Long workspaceId = request.getWorkspaceId();
            if (workspaceId == null) {
                workspaceId = 1L; // Default workspace ID
                System.out.println("Using default workspace ID: " + workspaceId);
            }

            // Create team project with special logic
            Project teamProject = projectService.createTeamProject(
                    request.getName(),
                    request.getDescription(),
                    request.getStatus(),
                    request.getOwnerUserId(),
                    workspaceId,
                    teamId,
                    request.getStartDate(),
                    request.getDueDate(),
                    request.getPortfolioId()
            );
            
            System.out.println("Team project created successfully: " + teamProject.getId());
            return new ResponseEntity<>(teamProject, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error in createTeamProject: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        Optional<Project> project = projectService.getProjectById(id);
        return project.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @Valid @RequestBody ProjectRequest request) {
        Optional<Project> updatedProject = projectService.updateProject(
                id,
                request.getName(),
                request.getDescription(),
                request.getStatus(),
                request.getStartDate(),
                request.getDueDate()
        );
        return updatedProject.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        boolean deleted = projectService.deleteProject(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PatchMapping("/{id}/starred")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Project> updateProjectStarred(@PathVariable Long id, @RequestBody StarredRequest request) {
        Optional<Project> projectOpt = projectService.getProjectById(id);
        if (projectOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Project project = projectOpt.get();
        project.setStarred(request.isStarred());
        Project updated = projectService.saveProject(project);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @GetMapping("/workspace/{workspaceId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Project>> getProjectsByWorkspaceId(@PathVariable Long workspaceId) {
        List<Project> projects = projectService.getProjectsByWorkspaceId(workspaceId);
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }

    @GetMapping("/owner/{ownerUserId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Project>> getProjectsByOwnerUserId(@PathVariable Long ownerUserId) {
        List<Project> projects = projectService.getProjectsByOwnerUserId(ownerUserId);
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }

    @GetMapping("/portfolio/{portfolioId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Project>> getProjectsByPortfolioId(@PathVariable Long portfolioId) {
        List<Project> projects = projectService.getProjectsByPortfolioId(portfolioId);
        if (projects.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }

    @GetMapping("/portfolio/{portfolioId}/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Project>> getProjectsByPortfolioIdAndUserId(@PathVariable Long portfolioId, @PathVariable Long userId) {
        List<Project> projects = projectService.getProjectsByPortfolioIdAndUserId(portfolioId, userId);
        if (projects.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }

    // DTO for creating/updating a project
    public static class ProjectRequest {
        private String name;
        private String description;
        private ProjectStatus status;
        private Long ownerUserId;
        private Long workspaceId;
        private LocalDate startDate;
        private LocalDate dueDate;
        private Long portfolioId;

        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public ProjectStatus getStatus() { return status; }
        public void setStatus(ProjectStatus status) { this.status = status; }

        public Long getOwnerUserId() { return ownerUserId; }
        public void setOwnerUserId(Long ownerUserId) { this.ownerUserId = ownerUserId; }

        public Long getWorkspaceId() { return workspaceId; }
        public void setWorkspaceId(Long workspaceId) { this.workspaceId = workspaceId; }

        public LocalDate getStartDate() { return startDate; }
        public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

        public LocalDate getDueDate() { return dueDate; }
        public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

        public Long getPortfolioId() { return portfolioId; }
        public void setPortfolioId(Long portfolioId) { this.portfolioId = portfolioId; }
    }

    public static class StarredRequest {
        private boolean starred;
        public boolean isStarred() { return starred; }
        public void setStarred(boolean starred) { this.starred = starred; }
    }
} 