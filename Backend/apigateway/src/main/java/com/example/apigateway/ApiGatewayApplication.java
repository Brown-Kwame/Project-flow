package com.example.apigateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient; // Enables service discovery client

@SpringBootApplication
@EnableDiscoveryClient // This annotation makes this application a Eureka client,
                       // allowing it to discover and register with a Eureka Server.
                       // It's crucial for routing by service ID.
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
}
