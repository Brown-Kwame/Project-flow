package com.example.asana.controller;

import com.example.asana.model.Project;
import com.example.asana.model.ProjectStatus;
import com.example.asana.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
        List<Project> projects = projectService.getAllProjects();
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Project> createProject(@Valid @RequestBody ProjectRequest request) {
        if (request.getName() == null || request.getOwnerUserId() == null || request.getWorkspaceId() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (projectService.projectExistsInWorkspace(request.getName(), request.getWorkspaceId())) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        Project newProject = projectService.createProject(
                request.getName(),
                request.getDescription(),
                request.getStatus(),
                request.getOwnerUserId(),
                request.getWorkspaceId(),
                request.getStartDate(),
                request.getDueDate(),
                request.getPortfolioId()
        );
        return new ResponseEntity<>(newProject, HttpStatus.CREATED);
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