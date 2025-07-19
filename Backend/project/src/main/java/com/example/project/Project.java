package com.example.project;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 255)
    private String name; // The name/title of the project

    @Column(name = "description", length = 1000)
    private String description; // Detailed description of the project

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING) // Store enum as String in DB
    private ProjectStatus status; // Current status of the project

    @Column(name = "owner_user_id", nullable = false)
    private Long ownerUserId; // The ID of the user who owns this project (links to User Service)

    @Column(name = "workspace_id", nullable = false)
    private Long workspaceId; // The ID of the workspace this project belongs to (links to Workspace Service)

    @Column(name = "start_date")
    private LocalDate startDate; // Optional: Project start date

    @Column(name = "due_date")
    private LocalDate dueDate; // Optional: Project due date

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt; // Timestamp when the project was created

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt; // Timestamp when the project was last updated

    @Column(name = "portfolio_id", nullable = false)
    private Long portfolioId;

    @PrePersist // Called before a new entity is persisted
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = ProjectStatus.NOT_STARTED; // Default status
        }
    }

    @PreUpdate // Called before an existing entity is updated
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}