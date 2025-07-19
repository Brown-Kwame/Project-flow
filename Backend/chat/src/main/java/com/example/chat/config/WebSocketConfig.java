
package com.example.chat.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // Enables WebSocket message handling, backed by a message broker.
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // These are destinations for messages from the server to the client.
        // Clients can subscribe to topics (e.g., /topic/public for public chat)
        // or user-specific queues (e.g., /user/{userId}/queue/messages for private chat).
        config.enableSimpleBroker("/topic", "/queue", "/user");

        // This prefix is for messages from the client to the server.
        // Messages sent to /app/chat.sendMessage will be routed to @MessageMapping methods.
        config.setApplicationDestinationPrefixes("/app");

        // This prefix is for user-specific destinations.
        // It ensures that messages sent to /user/{userId}/queue/messages are routed correctly.
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // This is the WebSocket endpoint clients will connect to.
        // For example, ws://localhost:8087/ws
        // .withSockJS() provides fallback options for browsers that don't support WebSockets.
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // Allow all origins for development. Restrict in production.
                .withSockJS();
    }
}