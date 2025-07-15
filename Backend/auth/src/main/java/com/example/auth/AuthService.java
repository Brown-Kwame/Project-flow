    package com.example.auth;

    import com.example.auth.dto.AuthResponse;
    import com.example.auth.dto.UserAuthDetails;
    import com.example.auth.util.JwtUtil;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.cloud.client.ServiceInstance; // NEW IMPORT
    import org.springframework.cloud.client.discovery.DiscoveryClient; // NEW IMPORT
    import org.springframework.http.HttpStatus;
    import org.springframework.stereotype.Service;
    import org.springframework.web.reactive.function.client.WebClient;
    import reactor.core.publisher.Mono;
    import java.util.HashMap;
    import java.util.List; // NEW IMPORT
    import java.util.Map;
    import org.slf4j.Logger;
    import org.slf4j.LoggerFactory;

    @Service
    public class AuthService {

        private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

        @Autowired
        private WebClient.Builder webClientBuilder;

        @Autowired
        private JwtUtil jwtUtil;

        // We will no longer directly use this for WebClient base URL, but keep it for reference/logging
        @Value("${user-service.url}")
        private String userServiceId; // Renamed to userServiceId as it's just the ID now

        @Autowired // NEW: Inject DiscoveryClient
        private DiscoveryClient discoveryClient;

        public AuthResponse authenticate(String email, String password) throws Exception {
            logger.info("Attempting to authenticate user: {}", email);
            logger.info("User Service ID configured: {}", userServiceId);

            // --- NEW LOGIC TO RESOLVE USER SERVICE URL ---
            List<ServiceInstance> instances = discoveryClient.getInstances("USER-SERVICE"); // Get instances by ID
            if (instances.isEmpty()) {
                logger.error("No instances found for USER-SERVICE in Eureka.");
                throw new Exception("User Service is not available via Eureka.");
            }

            // For simplicity, take the first available instance.
            // In a real scenario, you might want more sophisticated load balancing logic here.
            ServiceInstance userServiceInstance = instances.get(0);
            String userServiceBaseUrl = userServiceInstance.getUri().toString();
            logger.info("Resolved USER-SERVICE to URL: {}", userServiceBaseUrl);
            // --- END NEW LOGIC ---

            WebClient webClient = webClientBuilder.baseUrl(userServiceBaseUrl).build(); // Use the resolved URL

            Map<String, String> loginRequestBody = new HashMap<>();
            loginRequestBody.put("email", email);
            loginRequestBody.put("password", password);

            Mono<UserAuthDetails> userDetailsMono = webClient.post()
                .uri("/users/login") // The URI is now relative to the resolved base URL
                .bodyValue(loginRequestBody)
                .retrieve()
                .onStatus(status -> status.is4xxClientError(), clientResponse -> {
                    logger.error("User Service returned 4xx error: {}", clientResponse.statusCode());
                    return Mono.error(new Exception("Invalid credentials or user not found from User Service. Status: " + clientResponse.statusCode()));
                })
                .onStatus(status -> status.is5xxServerError(), clientResponse -> {
                    logger.error("User Service returned 5xx error: {}", clientResponse.statusCode());
                    return Mono.error(new Exception("User Service internal server error. Status: " + clientResponse.statusCode()));
                })
                .bodyToMono(UserAuthDetails.class)
                .doOnError(e -> logger.error("Error during WebClient call to User Service: {}", e.getMessage(), e));

            UserAuthDetails userAuthDetails;
            try {
                userAuthDetails = userDetailsMono.block();
                logger.info("Successfully received response from User Service for user: {}", email);
            } catch (Exception e) {
                logger.error("Failed to authenticate with User Service for user {}: {}", email, e.getMessage());
                throw new Exception("Authentication failed with User Service: " + e.getMessage(), e);
            }

            if (userAuthDetails != null) {
                String token = jwtUtil.generateToken(userAuthDetails);
                logger.info("JWT token generated for user: {}", email);
                return new AuthResponse(
                    token,
                    userAuthDetails.getId(),
                    userAuthDetails.getEmail(),
                    userAuthDetails.getFirstName(),
                    userAuthDetails.getLastName()
                );
            } else {
                throw new Exception("Authentication failed with User Service: User details are null.");
            }
        }

        public boolean validateToken(String token) {
            return jwtUtil.validateToken(token);
        }
    }