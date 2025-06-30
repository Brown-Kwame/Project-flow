// File: SecurityConfig.java
// Path: your-user-service-project/src/main/java/com/example/user/SecurityConfig.java

package com.example.user;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity; // Add this import
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain; // Add this import

@Configuration
@EnableWebSecurity // Enable Spring Security's web security features
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Configure security rules for HTTP requests
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for API endpoints (common for REST APIs)
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/users/register", "/users/login").permitAll() // Allow these endpoints without authentication
                .anyRequest().authenticated() // All other requests require authentication
            );
        // Note: For a proper production setup, you would typically add
        // .httpBasic(Customizer.withDefaults()); for basic auth or
        // .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS) for JWTs
        // But for getting past 401 on register/login, this is enough.
        return http.build();
    }
}