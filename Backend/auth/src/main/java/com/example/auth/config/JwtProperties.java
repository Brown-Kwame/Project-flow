
    package com.example.auth.config;

    import lombok.Data;
    import org.springframework.boot.context.properties.ConfigurationProperties;
    import org.springframework.stereotype.Component; // Or use @Configuration

    @Data // Lombok to generate getters/setters
    @Component // Make it a Spring bean so it can be picked up
    @ConfigurationProperties(prefix = "jwt") // Binds properties prefixed with "jwt"
    public class JwtProperties {
        private String secret;
        private long expiration; // Matches jwt.expiration in application.yml
        // You can add other JWT-related properties here if needed
    }
    