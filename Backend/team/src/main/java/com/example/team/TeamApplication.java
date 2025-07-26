package com.example.team;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.web.reactive.function.client.WebClient; // THIS IMPORT MUST BE HERE

@SpringBootApplication
@EnableDiscoveryClient // Enables this service to register with Eureka
public class TeamApplication {

    public static void main(String[] args) {
        SpringApplication.run(TeamApplication.class, args);
    }

    // Bean for WebClient.Builder to call other services (e.g., User Service, Notification Service)
    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }
}
