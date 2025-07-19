package com.example.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/projects") // Base URL for project-related endpoints
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    // DTO for creating/updating a project (request body)
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProjectRequest {
        private String name;
        private String description;
        private ProjectStatus status;
        private Long ownerUserId; // Required for creation
        private Long workspaceId; // Required for creation
        private LocalDate startDate;
        private LocalDate dueDate;
    }

    // Endpoint to create a new project
    @PostMapping("/")
    public ResponseEntity<Project> createProject(@RequestBody ProjectRequest request) {
        // Basic validation: ensure required fields are not null for creation
        if (request.getName() == null || request.getOwnerUserId() == null || request.getWorkspaceId() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Or more detailed error message
        }

        // Optional: Check for duplicate project name within the workspace
        if (projectService.projectExistsInWorkspace(request.getName(), request.getWorkspaceId())) {
            return new ResponseEntity<>(HttpStatus.CONFLICT); // 409 Conflict
        }

        Project newProject = projectService.createProject(
                request.getName(),
                request.getDescription(),
                request.getStatus(),
                request.getOwnerUserId(),
                request.getWorkspaceId(),
                request.getStartDate(),
                request.getDueDate()
        );
        return new ResponseEntity<>(newProject, HttpStatus.CREATED); // Return 201 Created status
    }

    // Endpoint to get a project by ID
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        Optional<Project> project = projectService.getProjectById(id);
        return project.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Endpoint to update an existing project
    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody ProjectRequest request) {
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

    // Endpoint to delete a project
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        boolean deleted = projectService.deleteProject(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint to get all projects for a specific workspace
    @GetMapping("/workspace/{workspaceId}")
    public ResponseEntity<List<Project>> getProjectsByWorkspaceId(@PathVariable Long workspaceId) {
        List<Project> projects = projectService.getProjectsByWorkspaceId(workspaceId);
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }

    // Endpoint to get all projects owned by a specific user
    @GetMapping("/owner/{ownerUserId}")
    public ResponseEntity<List<Project>> getProjectsByOwnerUserId(@PathVariable Long ownerUserId) {
        List<Project> projects = projectService.getProjectsByOwnerUserId(ownerUserId);
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }

        // NEW: Get all projects for a specific portfolio ID
    @GetMapping("/portfolio/{portfolioId}")
    public ResponseEntity<List<Project>> getProjectsByPortfolioId(@PathVariable Long portfolioId) {
        List<Project> projects = projectService.getProjectsByPortfolioId(portfolioId);
        if (projects.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }

    // NEW: Get all projects for a specific portfolio ID and user ID (for ownership check)
    @GetMapping("/portfolio/{portfolioId}/user/{userId}")
    public ResponseEntity<List<Project>> getProjectsByPortfolioIdAndUserId(@PathVariable Long portfolioId, @PathVariable Long userId) {
        List<Project> projects = projectService.getProjectsByPortfolioIdAndUserId(portfolioId, userId);
        if (projects.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }
}
