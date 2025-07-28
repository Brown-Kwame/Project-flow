package com.skypeclone.backend;

import com.skypeclone.backend.model.ERole;
import com.skypeclone.backend.model.Role;
import com.skypeclone.backend.repository.RoleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SkypeCloneBackendApplication {

	private static final Logger logger = LoggerFactory.getLogger(SkypeCloneBackendApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(SkypeCloneBackendApplication.class, args);
	}

	// This bean will run after application startup to initialize roles
	@Bean
	CommandLineRunner initRoles(RoleRepository roleRepository) {
		return args -> {
			if (roleRepository.findByName(ERole.ROLE_USER).isEmpty()) {
				roleRepository.save(new Role(ERole.ROLE_USER));
				logger.info("Initialized ROLE_USER");
			}
			if (roleRepository.findByName(ERole.ROLE_ADMIN).isEmpty()) {
				roleRepository.save(new Role(ERole.ROLE_ADMIN));
				logger.info("Initialized ROLE_ADMIN");
			}
		};
	}
}