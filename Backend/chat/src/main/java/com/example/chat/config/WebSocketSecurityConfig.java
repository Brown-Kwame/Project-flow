
package com.example.chat.config;

import com.example.chat.JwtTokenProvider; // Will create this soon
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
// import org.springframework.messaging.simp.config.ChannelSecurityConfigurer; // Removed, not available in Spring
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User; // Spring Security User
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.security.config.annotation.web.socket.EnableWebSocketSecurity; // NEW annotation

import java.util.Collections;

@Configuration
@EnableWebSocketSecurity // Enables Spring Security for WebSockets
@EnableWebSocketMessageBroker // Needed here too, as it's part of the WebSocket setup
@Order(Ordered.HIGHEST_PRECEDENCE + 99) // Ensures this security config runs early
public class WebSocketSecurityConfig implements org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer {

    @Autowired
    private JwtTokenProvider jwtTokenProvider; // Our JWT utility class

    @Override
    public void configureClientInboundChannel(org.springframework.messaging.simp.config.ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor =
                        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (accessor != null) {
                    // Check for CONNECT command (WebSocket handshake)
                    if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                        String token = accessor.getFirstNativeHeader("Authorization"); // Get token from Authorization header
                        if (token != null && token.startsWith("Bearer ")) {
                            token = token.substring(7); // Remove "Bearer " prefix

                            // Validate JWT token
                            if (jwtTokenProvider.validateToken(token)) {
                                Long userId = jwtTokenProvider.getUserIdFromToken(token);
                                String username = jwtTokenProvider.getUsernameFromToken(token); // Get username from token

                                User principal = new User(username, "", Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
                                Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

                                accessor.setUser(authentication);
                                SecurityContextHolder.getContext().setAuthentication(authentication);
                            } else {
                                System.err.println("Invalid JWT token for WebSocket connection.");
                            }
                        } else {
                            System.err.println("No JWT token found in WebSocket CONNECT header.");
                        }
                    } else if (StompCommand.SUBSCRIBE.equals(accessor.getCommand()) || StompCommand.SEND.equals(accessor.getCommand())) {
                        if (accessor.getUser() == null || !(accessor.getUser() instanceof Authentication) || !((Authentication) accessor.getUser()).isAuthenticated()) {
                            System.err.println("Unauthenticated user attempting to subscribe or send message.");
                            return null;
                        }
                    }
                }
                return message;
            }
        });
    }

    // You can configure message broker and application destination prefixes here if needed
    // For example:
    // @Override
    // public void configureMessageBroker(MessageBrokerRegistry config) {
    //     config.enableSimpleBroker("/topic", "/queue", "/user");
    //     config.setApplicationDestinationPrefixes("/app");
    //     config.setUserDestinationPrefix("/user");
    // }
}
