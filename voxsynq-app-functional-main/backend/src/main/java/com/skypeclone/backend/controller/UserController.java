package com.skypeclone.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skypeclone.backend.dto.ChangePasswordRequest;
import com.skypeclone.backend.dto.UpdateUserRequest;
import com.skypeclone.backend.dto.UserDto;
import com.skypeclone.backend.service.UserService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('USER')") // Ensures only logged-in users can access this
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UserDto> getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        UserDto userDto = userService.getCurrentUser(username);
        return ResponseEntity.ok(userDto);
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UserDto> updateCurrentUser(@RequestBody UpdateUserRequest req, Authentication authentication) {
        String username = authentication.getName();
        UserDto updated = userService.updateCurrentUser(username, req);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/me/password")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest req, Authentication authentication) {
        String username = authentication.getName();
        userService.changePassword(username, req);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        userService.deleteCurrentUser(username);
        return ResponseEntity.noContent().build();
    }
}