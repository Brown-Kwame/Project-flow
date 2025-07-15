package com.example.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.web.reactive.function.client.WebClient; // For inter-service communication

@SpringBootApplication
@EnableDiscoveryClient // Enable Eureka client for service discovery
public class AuthApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthApplication.class, args);
    }

    // Bean to create a WebClient instance for making HTTP requests to other services
    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }
}