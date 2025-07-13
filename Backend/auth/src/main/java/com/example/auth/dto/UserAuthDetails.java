package com.example.auth.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

// This DTO represents the simplified User object returned by the User Service's /users/login endpoint
// It should match the structure of the User entity returned by your User Service on successful login.
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAuthDetails {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    // Do NOT include passwordHash here for security reasons, it's not sent back by User Service login.
}