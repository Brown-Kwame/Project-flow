package com.example.goals;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "goals") // Specify the table name in the database
@Data // Lombok annotation to generate getters, setters, toString, equals, hashCode
@NoArgsConstructor // Lombok annotation to generate a no-argument constructor
@AllArgsConstructor // Lombok annotation to generate an all-argument constructor
public class Goals {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generate the primary key
    private Long id;

    @Column(name = "name", nullable = false, length = 255)
    private String name; // The name/title of the goal

    @Column(name = "description", length = 1000)
    private String description; // Detailed description of the goal

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING) // Store enum as String in DB
    private GoalsStatus status; // Current status of the goal

    @Column(name = "owner_user_id", nullable = false)
    private Long ownerUserId; // The ID of the user who owns this goal (links to User Service)

    @Column(name = "workspace_id", nullable = false)
    private Long workspaceId; // The ID of the workspace this goal belongs to (links to Workspace Service)

    @Column(name = "start_date")
    private LocalDate startDate; // Optional: Goal start date

    @Column(name = "due_date")
    private LocalDate dueDate; // Optional: Goal due date

    @Column(name = "target_value")
    private Double targetValue; // Optional: A numerical target for the goal (e.g., 100% completion, 500 sales)

    @Column(name = "current_value")
    private Double currentValue; // Optional: The current numerical value of progress

    @Column(name = "unit")
    private String unit; // Optional: Unit for target/current value (e.g., "%", "sales", "USD")

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt; // Timestamp when the goal was created

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt; // Timestamp when the goal was last updated

    @PrePersist // Called before a new entity is persisted
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = GoalsStatus.NOT_STARTED; // Default status
        }
        if (this.currentValue == null) {
            this.currentValue = 0.0; // Default current value
        }
    }

    @PreUpdate // Called before an existing entity is updated
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}