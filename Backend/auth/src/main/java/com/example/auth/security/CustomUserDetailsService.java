package com.example.auth.security;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

// This is a simple UserDetailsService implementation.
// For the Authentication Service, it primarily ensures a username (email) exists
// for Spring Security's internal flow, but the *actual* password verification
// happens by calling the User Service.
@Service
public class CustomUserDetailsService implements UserDetailsService {

    // Note: This UserDetailsService does NOT perform password validation itself.
    // Password validation happens in AuthService by calling the remote User Service.
    // This implementation is mainly to satisfy Spring Security's UserDetailsService contract
    // for the JWT filter, assuming a user with this email exists for token generation.
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // In a real scenario for a security service, you might check if the email
        // is even a valid format or exists in a local cache of users.
        // For this simplified version, we just create a dummy UserDetails object
        // since the actual authentication (password check) is delegated to the User Service.
        // The password "" is a placeholder here because it's not used for validation in this service.
        return new User(email, "", new ArrayList<>()); // No roles for now
    }
}
