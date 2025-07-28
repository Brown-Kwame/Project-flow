package com.skypeclone.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.skypeclone.backend.dto.ChangePasswordRequest;
import com.skypeclone.backend.dto.UpdateUserRequest;
import com.skypeclone.backend.dto.UserDto;
import com.skypeclone.backend.model.User;
import com.skypeclone.backend.repository.UserRepository;

@Service
public class UserService {

    @Value("${app.baseUrl:http://192.168.0.151:8080}")
    private String baseUrl;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        // Convert User entities to UserDto to avoid sending sensitive data like passwords
        return users.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public UserDto getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDto(user);
    }

    public UserDto updateCurrentUser(String username, UpdateUserRequest req) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (req.getUsername() != null && !req.getUsername().isEmpty()) {
            user.setUsername(req.getUsername());
        }
        if (req.getEmail() != null && !req.getEmail().isEmpty()) {
            user.setEmail(req.getEmail());
        }
        if (req.getProfilePictureUrl() != null) {
            // Store only the file name if a full URL is provided
            String url = req.getProfilePictureUrl();
            if (url != null && (url.startsWith("http://") || url.startsWith("https://"))) {
                int lastSlash = url.lastIndexOf("/");
                if (lastSlash != -1) {
                    url = url.substring(lastSlash + 1);
                }
            }
            user.setProfilePictureUrl(url);
        }
        if (req.getFullName() != null) {
            user.setFullName(req.getFullName());
        }
        userRepository.save(user);
        return convertToDto(user);
    }

    public void changePassword(String username, ChangePasswordRequest req) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
    }

    public void deleteCurrentUser(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        userOpt.ifPresent(userRepository::delete);
    }

    public UserDto convertToDto(User user) {
        return new UserDto(user, baseUrl);
    }
}