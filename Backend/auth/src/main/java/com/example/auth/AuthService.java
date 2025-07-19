
package com.example.auth;

import com.example.auth.dto.AuthResponse;
import com.example.auth.dto.LoginRequest;
import com.example.auth.dto.RegisterRequest;
import com.example.auth.dto.UserAuthDetails;
import com.example.auth.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.http.HttpStatus; // Keep this import
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
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

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private DiscoveryClient discoveryClient;

    private static final String USER_SERVICE_ID = "USER-SERVICE";
    private static final String NOTIFICATION_SERVICE_ID = "NOTIFICATION-SERVICE";
    private static final String USER_REGISTER_PATH = "/users/register";
    private static final String USER_LOGIN_PATH = "/users/login";
    private static final String NOTIFICATION_CREATE_PATH = "/notifications";


    public AuthResponse loginUser(LoginRequest loginRequest) throws Exception {
        logger.info("Attempting to authenticate user: {}", loginRequest.getEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserAuthDetails userAuthDetails = fetchUserDetailsFromUserService(loginRequest.getEmail());
        if (userAuthDetails == null) {
            throw new Exception("Could not retrieve user details for JWT generation after successful authentication.");
        }

        String jwt = jwtUtil.generateToken(userAuthDetails);

        logger.info("User {} logged in successfully. Sending login notification.", loginRequest.getEmail());
        sendNotification(userAuthDetails.getId(), "You have successfully logged in!", "LOGIN_SUCCESS");

        return new AuthResponse(jwt, userAuthDetails.getId(), userAuthDetails.getEmail(),
                                userAuthDetails.getFirstName(), userAuthDetails.getLastName(), "User logged in successfully.");
    }


    public AuthResponse registerUser(RegisterRequest registerRequest) throws Exception {
        logger.info("Attempting to register user: {}", registerRequest.getEmail());

        String hashedPassword = passwordEncoder.encode(registerRequest.getPassword());

        Map<String, Object> userCreationData = new HashMap<>();
        userCreationData.put("firstName", registerRequest.getFirstName());
        userCreationData.put("lastName", registerRequest.getLastName());
        userCreationData.put("email", registerRequest.getEmail());
        userCreationData.put("password", hashedPassword);

        String userServiceBaseUrl = resolveServiceUrl(USER_SERVICE_ID);
        if (userServiceBaseUrl == null) {
            throw new RuntimeException("User Service is not available via Eureka for registration.");
        }

        UserAuthDetails newUserDetails;
        try {
            newUserDetails = webClientBuilder.baseUrl(userServiceBaseUrl)
                    .build()
                    .post()
                    .uri(USER_REGISTER_PATH)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(userCreationData)
                    .retrieve()
                    // FIX: Corrected onStatus predicate to use 'status' directly
                    .onStatus(status -> status.is4xxClientError(), clientResponse -> {
                        logger.error("User registration failed with 4xx status: {}", clientResponse.statusCode());
                        return Mono.error(new RuntimeException("User registration failed: " + clientResponse.statusCode()));
                    })
                    // FIX: Corrected onStatus predicate to use 'status' directly
                    .onStatus(status -> status.is5xxServerError(), clientResponse -> {
                        logger.error("User registration failed with 5xx status: {}", clientResponse.statusCode());
                        return Mono.error(new RuntimeException("User registration failed due to server error: " + clientResponse.statusCode()));
                    })
                    .bodyToMono(UserAuthDetails.class)
                    .block();
        } catch (Exception e) {
            logger.error("Error during user registration WebClient call: {}", e.getMessage());
            throw new RuntimeException("User registration failed: " + e.getMessage(), e);
        }

        if (newUserDetails == null || newUserDetails.getId() == null) {
            throw new RuntimeException("User registration failed: No user details returned from User Service.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(registerRequest.getEmail(), registerRequest.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtil.generateToken(newUserDetails);

        logger.info("User {} registered successfully. Sending welcome notification.", registerRequest.getEmail());
        sendNotification(newUserDetails.getId(), "Welcome to ProjectFlow! Your journey begins now.", "WELCOME");

        return new AuthResponse(jwt, newUserDetails.getId(), newUserDetails.getEmail(),
                                newUserDetails.getFirstName(), newUserDetails.getLastName(), "Login successful");
    }

    private UserAuthDetails fetchUserDetailsFromUserService(String email) throws Exception {
        String userServiceBaseUrl = resolveServiceUrl(USER_SERVICE_ID);
        if (userServiceBaseUrl == null) {
            throw new Exception("User Service is not available via Eureka.");
        }
        try {
            Map<String, String> loginRequestBody = new HashMap<>();
            loginRequestBody.put("email", email);

            return webClientBuilder.baseUrl(userServiceBaseUrl)
                    .build()
                    .post()
                    .uri(USER_LOGIN_PATH)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(loginRequestBody)
                    .retrieve()
                    .bodyToMono(UserAuthDetails.class)
                    .block();
        } catch (Exception e) {
            logger.error("Failed to fetch user details from User Service for {}: {}", email, e.getMessage());
            throw new Exception("Failed to retrieve user details from User Service.", e);
        }
    }

    private String resolveServiceUrl(String serviceId) {
        List<ServiceInstance> instances = discoveryClient.getInstances(serviceId);
        if (instances.isEmpty()) {
            logger.error("No instances found for service: {} in Eureka.", serviceId);
            return null;
        }
        ServiceInstance instance = instances.get(0);
        String baseUrl = instance.getUri().toString();
        logger.info("Resolved service {} to URL: {}", serviceId, baseUrl);
        return baseUrl;
    }

    private void sendNotification(Long userId, String message, String type) {
        try {
            String notificationServiceBaseUrl = resolveServiceUrl(NOTIFICATION_SERVICE_ID);
            if (notificationServiceBaseUrl == null) {
                System.err.println("Notification Service is not available via Eureka. Cannot send notification.");
                return;
            }

            Map<String, Object> notificationRequest = new HashMap<>();
            notificationRequest.put("userId", userId);
            notificationRequest.put("message", message);
            notificationRequest.put("type", type);

            webClientBuilder.baseUrl(notificationServiceBaseUrl)
                    .build()
                    .post()
                    .uri(NOTIFICATION_CREATE_PATH)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(notificationRequest)
                    .retrieve()
                    // FIX: Corrected onStatus predicate to use 'status' directly
                    .onStatus(status -> status.isError(), clientResponse -> {
                        logger.error("Notification send failed with status: {}", clientResponse.statusCode());
                        return Mono.error(new RuntimeException("Notification send failed."));
                    })
                    .bodyToMono(String.class)
                    .block();

            System.out.println("Notification sent successfully for user " + userId + ": " + message);
        } catch (Exception e) {
            System.err.println("Error sending notification for user " + userId + ": " + e.getMessage());
        }
    }

    public Boolean validateToken(String token) {
        return jwtUtil.validateToken(token);
    }
}