
package com.example.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder; // For password hashing

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Injected for hashing passwords

    // Register a new user
    public Optional<User> registerUser(String firstName, String lastName, String email, String plainPassword) {
        if (userRepository.existsByEmail(email)) {
            return Optional.empty(); // User with this email already exists
        }

        User newUser = new User();
        newUser.setFirstName(firstName);
        newUser.setLastName(lastName);
        newUser.setEmail(email);
        newUser.setPasswordHash(passwordEncoder.encode(plainPassword)); // Hash the password
        return Optional.of(userRepository.save(newUser));
    }

    // Authenticate a user
    public Optional<User> authenticateUser(String email, String plainPassword) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Compare provided plain password with stored hashed password
            if (passwordEncoder.matches(plainPassword, user.getPasswordHash())) {
                return Optional.of(user);
            }
        }
        return Optional.empty(); // Authentication failed
    }

    // Get a user by ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Update user profile
    public Optional<User> updateUser(Long id, String firstName, String lastName, String email) {
        return userRepository.findById(id).map(user -> {
            if (firstName != null) user.setFirstName(firstName);
            if (lastName != null) user.setLastName(lastName);
            // Email update should be handled carefully, often requiring verification
            if (email != null && !user.getEmail().equals(email)) {
                if (userRepository.existsByEmail(email)) {
                    // Handle duplicate email case (e.g., throw a custom exception or return specific status)
                    throw new IllegalArgumentException("Email already taken.");
                }
                user.setEmail(email);
            }
            return userRepository.save(user);
        });
    }

    // Update user password
    public boolean updatePassword(Long id, String oldPlainPassword, String newPlainPassword) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(oldPlainPassword, user.getPasswordHash())) {
                user.setPasswordHash(passwordEncoder.encode(newPlainPassword));
                userRepository.save(user);
                return true;
            }
        }
        return false; // User not found or old password mismatch
    }

    // Delete a user
    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
}