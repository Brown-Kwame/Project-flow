package com.example.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users") // Base URL for user-related endpoints
public class UserController {

    @Autowired
    private UserService userService;

    // DTO for user registration request
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        private String firstName;
        private String lastName;
        private String email;
        private String password; // Plain password for registration
    }

    // DTO for user login request
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String email;
        private String password; // Plain password for login
    }

    // DTO for user profile update request
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserUpdateRequest {
        private String firstName;
        private String lastName;
        private String email;
    }

    // DTO for password update request
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PasswordUpdateRequest {
        private String oldPassword;
        private String newPassword;
    }


    // Endpoint for user registration
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody RegisterRequest request) {
        if (request.getFirstName() == null || request.getLastName() == null ||
            request.getEmail() == null || request.getPassword() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Optional<User> newUser = userService.registerUser(
            request.getFirstName(), request.getLastName(), request.getEmail(), request.getPassword()
        );

        return newUser.map(user -> new ResponseEntity<>(user, HttpStatus.CREATED))
                      .orElseGet(() -> new ResponseEntity<>(HttpStatus.CONFLICT)); // Email already exists
    }

    // Endpoint for user login (authentication)
    @PostMapping("/login")
    public ResponseEntity<User> loginUser(@RequestBody LoginRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Optional<User> user = userService.authenticateUser(request.getEmail(), request.getPassword());

        return user.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                   .orElseGet(() -> new ResponseEntity<>(HttpStatus.UNAUTHORIZED)); // Invalid credentials
    }

    // Endpoint to get a user by ID (e.g., for profile viewing)
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                   .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Endpoint to get all users (for admin purposes, or internal service calls)
    @GetMapping("/")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    // Endpoint to update user profile
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody UserUpdateRequest request) {
        try {
            Optional<User> updatedUser = userService.updateUser(
                id, request.getFirstName(), request.getLastName(), request.getEmail()
            );
            return updatedUser.map(user -> new ResponseEntity<>(user, HttpStatus.OK))
                              .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (IllegalArgumentException e) {
            // Handle case where email is already taken
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
    }

    // Endpoint to update user's password
    @PutMapping("/{id}/password")
    public ResponseEntity<Void> updatePassword(@PathVariable Long id, @RequestBody PasswordUpdateRequest request) {
        if (request.getOldPassword() == null || request.getNewPassword() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        boolean updated = userService.updatePassword(id, request.getOldPassword(), request.getNewPassword());
        if (updated) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Success
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); // Old password mismatch or user not found
        }
    }

    // Endpoint to delete a user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        boolean deleted = userService.deleteUser(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
