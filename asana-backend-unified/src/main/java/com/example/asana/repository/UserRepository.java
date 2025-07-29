package com.example.asana.repository;

import com.example.asana.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    // Custom query to fetch users without roles to avoid serialization issues
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles")
    List<User> findAllUsersWithRoles();

    // Alternative: fetch only basic user data without roles
    @Query("SELECT u.id, u.username, u.email, u.fullName, u.profilePictureUrl, u.createdAt FROM User u")
    List<Object[]> findAllUsersBasic();
} 