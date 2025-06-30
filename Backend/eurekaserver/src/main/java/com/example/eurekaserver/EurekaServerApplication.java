package com.example.eurekaserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer; // Crucial annotation

@SpringBootApplication
@EnableEurekaServer // This annotation turns this Spring Boot application into a Eureka Server.
                    // It enables the functionality to act as a service registry.
public class EurekaServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}
