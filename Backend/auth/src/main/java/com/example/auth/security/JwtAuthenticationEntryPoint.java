package com.example.auth.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.Serializable;

// This class will be used to return a 401 Unauthorized error to clients
// that try to access a protected resource without proper authentication.
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint, Serializable {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        // Send a 401 Unauthorized response to the client
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
    }
}