package com.example.asana.service;

import com.example.asana.exception.ResourceNotFoundException;
import com.example.asana.model.User;
import com.example.asana.repository.UserRepository;
import com.example.asana.dto.UserUpdateRequest;
import com.example.asana.dto.PasswordUpdateRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;

import java.util.List;
import java.util.Optional;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<com.example.asana.dto.UserResponse> getAllUsersResponse() {
        try {
            System.out.println("Getting all users from repository...");
            List<User> users = userRepository.findAll();
            System.out.println("Found " + users.size() + " users");
            
            List<com.example.asana.dto.UserResponse> responses = users.stream()
                    .map(this::convertToUserResponse)
                    .collect(java.util.stream.Collectors.toList());
            
            System.out.println("Converted to " + responses.size() + " user responses");
            return responses;
        } catch (Exception e) {
            System.err.println("Error in getAllUsersResponse: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    private com.example.asana.dto.UserResponse convertToUserResponse(User user) {
        return new com.example.asana.dto.UserResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getFullName(),
            user.getProfilePictureUrl(),
            user.getCreatedAt()
        );
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Transactional
    public Optional<User> updateUser(Long id, UserUpdateRequest request) {
        return userRepository.findById(id).map(user -> {
            if (request.getFirstName() != null) {
                user.setFullName(request.getFirstName() + " " + (request.getLastName() != null ? request.getLastName() : ""));
            }
            if (request.getEmail() != null) {
                // Check if email is already taken by another user
                if (userRepository.existsByEmail(request.getEmail()) && !request.getEmail().equals(user.getEmail())) {
                    throw new IllegalArgumentException("Email is already taken");
                }
                user.setEmail(request.getEmail());
            }
            return userRepository.save(user);
        });
    }

    @Transactional
    public boolean updatePassword(Long id, String oldPassword, String newPassword) {
        return userRepository.findById(id).map(user -> {
            if (passwordEncoder.matches(oldPassword, user.getPassword())) {
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(user);
                return true;
            }
            return false;
        }).orElse(false);
    }

    @Transactional
    public User saveProfilePicture(Long id, MultipartFile file) throws IOException, ResourceNotFoundException {
        try {
            System.out.println("Starting profile picture upload for user ID: " + id);
            System.out.println("File name: " + file.getOriginalFilename());
            System.out.println("File size: " + file.getSize());
            System.out.println("File content type: " + file.getContentType());
            
            User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
            System.out.println("User found: " + user.getUsername());
            
            String uploadDir = "/app/uploads/profile-pictures";
            Path uploadPath = Paths.get(uploadDir);
            
            // Create directory if it doesn't exist
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                System.out.println("Created upload directory: " + uploadDir);
            }
            
            String fileName = "user-" + id + "-" + System.currentTimeMillis() + ".jpg";
            Path filePath = uploadPath.resolve(fileName);
            
            System.out.println("Saving file to: " + filePath.toString());
            
            // Copy the file content to the destination
            try (var inputStream = file.getInputStream()) {
                Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
            }
            
            System.out.println("File saved successfully");
            
            // Update user's profile picture URL
            String profilePictureUrl = "http://192.168.0.133:8080/uploads/profile-pictures/" + fileName;
            user.setProfilePictureUrl(profilePictureUrl);
            User savedUser = userRepository.save(user);
            
            System.out.println("User profile picture URL updated: " + profilePictureUrl);
            
            return savedUser;
            
        } catch (Exception e) {
            System.out.println("Error in saveProfilePicture: " + e.getMessage());
            e.printStackTrace();
            throw new IOException("Failed to save profile picture: " + e.getMessage(), e);
        }
    }

    @Transactional
    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
} 