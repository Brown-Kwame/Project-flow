package com.example.auth;

import com.example.auth.dto.LoginRequest;
import com.example.auth.dto.RegisterRequest; // Import RegisterRequest
import com.example.auth.dto.AuthResponse;
import com.example.auth.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // Endpoint for user login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse authResponse = authService.loginUser(loginRequest); // Call loginUser
            return ResponseEntity.ok(authResponse); // Return JWT token on success
        } catch (Exception e) {
            // Catch generic exceptions for invalid credentials or other auth issues
            return new ResponseEntity<>(new AuthResponse(null, null, null, null, null, "Invalid credentials or authentication error: " + e.getMessage()), HttpStatus.UNAUTHORIZED);
        }
    }

    // Endpoint for user registration
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            AuthResponse authResponse = authService.registerUser(registerRequest); // Call registerUser
            return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(new AuthResponse(null, null, null, null, null, e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(new AuthResponse(null, null, null, null, null, "Registration failed: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // You might add endpoints for token validation, refresh, etc., later if needed
    // Example: A simple endpoint to test token validity (for internal use/testing)
    @GetMapping("/validate")
    public ResponseEntity<String> validateToken(@RequestHeader("Authorization") String tokenHeader) {
        if (tokenHeader != null && tokenHeader.startsWith("Bearer ")) {
            String token = tokenHeader.substring(7);
            if (authService.validateToken(token)) {
                return ResponseEntity.ok("Token is valid!");
            }
        }
        return new ResponseEntity<>("Token is invalid or missing.", HttpStatus.UNAUTHORIZED);
    }
}