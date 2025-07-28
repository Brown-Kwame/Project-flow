package com.skypeclone.backend.security.jwt;

import com.skypeclone.backend.security.services.UserDetailsImpl;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.security.Key;
import java.util.Date;

@Component // Marks this as a Spring component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${app.jwtSecret}") // Injects value from application.properties
    private String jwtSecretString;

    @Value("${app.jwtExpirationMs}") // Injects value from application.properties
    private int jwtExpirationMs;

    private Key key; // Key for signing the JWT

    @PostConstruct // Executed after dependency injection is done to perform any initialization
    public void init() {
        // Ensure the secret key is strong enough for HMAC-SHA256 (at least 256 bits)
        // If your jwtSecretString is shorter, this might throw an error or result in weak keys.
        // A good practice is to use a securely generated random string of appropriate length.
        byte[] keyBytes = jwtSecretString.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        if (keyBytes.length < 64) {
            logger.warn("Configured 'app.jwtSecret' is too short for HS512 (requires at least 64 bytes, found {} bytes). " +
                    "Generating a new, secure key for HS512. " +
                    "IT IS STRONGLY RECOMMENDED to set a persistent, strong, random key in application.properties.", keyBytes.length);
            this.key = Keys.secretKeyFor(SignatureAlgorithm.HS512); // Generates a strong key for HS512
        } else {
            this.key = Keys.hmacShaKeyFor(keyBytes);
        }
    }

    // Generates a JWT token from an Authentication object
    public String generateJwtToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject((userPrincipal.getUsername())) // Set username as subject
                .setIssuedAt(new Date()) // Set issued time
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs)) // Set expiration time
                .signWith(key, SignatureAlgorithm.HS512) // Sign with HS512 algorithm and the key
                .compact(); // Build the token
    }

    // Extracts the username from a JWT token
    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().getSubject();
    }

    // Validates a JWT token
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(authToken);
            return true; // Token is valid
        } catch (SignatureException e) {
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false; // Token is invalid
    }
}