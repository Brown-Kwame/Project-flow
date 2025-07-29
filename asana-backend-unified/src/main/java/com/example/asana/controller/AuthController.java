package com.example.asana.controller;

import com.example.asana.dto.JwtResponse;
import com.example.asana.dto.LoginRequest;
import com.example.asana.dto.MessageResponse;
import com.example.asana.dto.SignupRequest;
import com.example.asana.model.ERole;
import com.example.asana.model.Role;
import com.example.asana.model.User;
import com.example.asana.repository.RoleRepository;
import com.example.asana.repository.UserRepository;
import com.example.asana.security.jwt.JwtUtils;
import com.example.asana.security.services.UserDetailsImpl;
import com.example.asana.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    NotificationService notificationService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("Attempting to authenticate user: " + loginRequest.getUsername());
            
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            System.out.println("Authentication successful for user: " + userDetails.getUsername());
            System.out.println("User roles: " + roles);

            // Create login notification
            try {
                notificationService.createNotification(
                    userDetails.getId(),
                    "Welcome back! You have successfully logged in to your account.",
                    "LOGIN",
                    userDetails.getId(),
                    "USER"
                );
                System.out.println("Login notification created for user: " + userDetails.getUsername());
            } catch (Exception e) {
                System.err.println("Failed to create login notification for user: " + userDetails.getUsername());
                e.printStackTrace();
            }

            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    roles));
        } catch (Exception e) {
            System.err.println("Authentication failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(new MessageResponse("Authentication failed: " + e.getMessage()));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        // Combine firstName and lastName into fullName
        String fullName = signUpRequest.getFirstName() + " " + signUpRequest.getLastName();
        user.setFullName(fullName);

        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role USER is not found."));
        roles.add(userRole);

        if ("admin".equalsIgnoreCase(signUpRequest.getUsername())) {
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: Role ADMIN is not found."));
            roles.add(adminRole);
        }

        user.setRoles(roles);
        User savedUser = userRepository.save(user);

        // Create welcome notification for new user
        try {
            notificationService.createNotification(
                savedUser.getId(),
                "Sign up successful! Welcome to Project Flow. Your account has been created successfully. Start by exploring your dashboard and creating your first project.",
                "WELCOME",
                savedUser.getId(),
                "USER"
            );
            System.out.println("Welcome notification created for user: " + savedUser.getUsername());
        } catch (Exception e) {
            System.err.println("Failed to create welcome notification for user: " + savedUser.getUsername());
            e.printStackTrace();
        }

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
} 