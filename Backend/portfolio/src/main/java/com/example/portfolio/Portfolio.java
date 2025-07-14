package com.example.portfolio;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity // Marks this class as a JPA entity
@Table(name = "portfolios") // Specifies the table name in the database
@Data // Lombok: Generates getters, setters, equals, hashCode, and toString
@NoArgsConstructor // Lombok: Generates a no-argument constructor
@AllArgsConstructor // Lombok: Generates a constructor with all fields
public class Portfolio {

    @Id // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increments ID for new entities
    private Long id;

    @Column(nullable = false) // Column cannot be null
    private String name;

    @Column(columnDefinition = "TEXT") // Use TEXT type for potentially long descriptions
    private String description;

    @Column(nullable = false)
    private Long userId; // ID of the user who owns this portfolio

    @Column(nullable = false)
    private LocalDateTime creationDate;

    @Column(nullable = false)
    private LocalDateTime lastUpdatedDate;

    // You might add relationships to other entities here later, e.g.,
    // @OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL, orphanRemoval = true)
    // private List<Project> projects;
    // @OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL, orphanRemoval = true)
    // private List<Goal> goals;
}