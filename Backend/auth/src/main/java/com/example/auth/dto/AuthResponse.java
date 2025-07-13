package com.example.auth.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token; // The JWT
    // You might add user details here as well, e.g., user ID, email, roles
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
}