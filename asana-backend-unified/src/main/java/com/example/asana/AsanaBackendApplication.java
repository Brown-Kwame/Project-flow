package com.example.asana;

import com.example.asana.model.ERole;
import com.example.asana.model.Role;
import com.example.asana.repository.RoleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class AsanaBackendApplication {

    private static final Logger logger = LoggerFactory.getLogger(AsanaBackendApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(AsanaBackendApplication.class, args);
    }

    // This bean will run after application startup to initialize roles
    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.findByName(ERole.ROLE_USER).isEmpty()) {
                Role userRole = new Role();
                userRole.setName(ERole.ROLE_USER);
                roleRepository.save(userRole);
                logger.info("Initialized ROLE_USER");
            }
            if (roleRepository.findByName(ERole.ROLE_ADMIN).isEmpty()) {
                Role adminRole = new Role();
                adminRole.setName(ERole.ROLE_ADMIN);
                roleRepository.save(adminRole);
                logger.info("Initialized ROLE_ADMIN");
            }
        };
    }
} 