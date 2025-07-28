package com.skypeclone.backend.security.services;

import com.skypeclone.backend.model.User;
import com.skypeclone.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service // Marks this as a Spring service component
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional // Ensures operations are part of a database transaction
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Try to find the user by username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

        // Build and return Spring Security's UserDetails object
        return UserDetailsImpl.build(user);
    }
}