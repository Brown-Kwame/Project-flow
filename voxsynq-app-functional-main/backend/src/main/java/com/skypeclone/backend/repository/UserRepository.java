package com.skypeclone.backend.repository;

import com.skypeclone.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository; // Spring Data JPA base repository
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository // Marks this as a Spring Data repository
public interface UserRepository extends JpaRepository<User, Long> { // <EntityType, PrimaryKeyType>

    // Custom query methods (Spring Data JPA creates implementations automatically)
    Optional<User> findByUsername(String username); // Find a user by their username

    Boolean existsByUsername(String username); // Check if a username already exists

    Boolean existsByEmail(String email); // Check if an email already exists
}