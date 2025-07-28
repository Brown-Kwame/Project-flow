package com.skypeclone.backend.model;

import jakarta.persistence.*; // For JPA annotations
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data; // Lombok annotation for getters, setters, toString, etc.
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.Instant;

import java.util.HashSet;
import java.util.Set;

@Entity // Marks this class as a JPA entity (a table in the database)
@Table(name = "users", // Specifies the table name in the database
        uniqueConstraints = { // Defines unique constraints
                @UniqueConstraint(columnNames = "username"),
                @UniqueConstraint(columnNames = "email")
        })
@Data // Lombok: generates getters, setters, equals, hashCode, toString
@NoArgsConstructor // Lombok: generates a no-argument constructor
@AllArgsConstructor // Lombok: generates a constructor with all arguments
public class User {

    @Id // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increments the ID
    private Long id;

    @NotBlank // Validation: ensures the field is not null and not empty
    @Size(max = 50) // Validation: ensures the username is at most 50 characters
    private String username;

    @NotBlank
    @Size(max = 120)
    private String password; // This will store the hashed password

    @NotBlank
    @Size(max = 80)
    @Email // Validation: ensures the email is in a valid format
    private String email;

    @Column(nullable = false, updatable = false)
    private Instant createdAt; // <-- ADD THIS FIELD

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }

    @Size(max = 100)
    private String fullName;

    private String profilePictureUrl; // URL to the profile picture


    // For Spring Security roles
    @ManyToMany(fetch = FetchType.EAGER) // EAGERly fetch roles with the user
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    // Constructor for registration (without ID, roles are set by default)
    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password; // Password should be hashed before saving
    }
}