package com.skypeclone.backend.controller;

import com.skypeclone.backend.dto.JwtResponse;
import com.skypeclone.backend.dto.LoginRequest;
import com.skypeclone.backend.dto.MessageResponse;
import com.skypeclone.backend.dto.SignupRequest;
import com.skypeclone.backend.model.ERole;
import com.skypeclone.backend.model.Role;
import com.skypeclone.backend.model.User;
import com.skypeclone.backend.repository.RoleRepository;
import com.skypeclone.backend.repository.UserRepository;
import com.skypeclone.backend.security.jwt.JwtUtils;
import com.skypeclone.backend.security.services.UserDetailsImpl;

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

@CrossOrigin(origins = "*", maxAge = 3600) // Allow cross-origin requests (useful for development)
@RestController // Marks this as a REST controller
@RequestMapping("/api/auth") // Base path for all endpoints in this controller
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder; // For hashing passwords

    @Autowired
    JwtUtils jwtUtils; // For generating JWTs

    @PostMapping("/signin") // Handles POST requests to /api/auth/signin
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        // Authenticate user with username and password
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        // Set authentication in security context
        SecurityContextHolder.getContext().setAuthentication(authentication);
        // Generate JWT token
        String jwt = jwtUtils.generateJwtToken(authentication);

        // Get user details from authentication principal
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        // Return JWT and user info in response
        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    @PostMapping("/signup") // Handles POST requests to /api/auth/signup
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        // Check if username is already taken
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        // Check if email is already taken
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword())); // Hash the password!

        if (signUpRequest.getFullName() != null && !signUpRequest.getFullName().isEmpty()) {
            user.setFullName(signUpRequest.getFullName());
        }

        Set<Role> roles = new HashSet<>();
        // Assign default role (ROLE_USER)
        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role USER is not found."));
        roles.add(userRole);

        // For testing, if username is 'admin', give ROLE_ADMIN too
        // In a real app, admin creation would be a separate, secured process.
        if ("admin".equalsIgnoreCase(signUpRequest.getUsername())) {
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: Role ADMIN is not found."));
            roles.add(adminRole);
        }


        user.setRoles(roles);
        userRepository.save(user); // Save user to database

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}