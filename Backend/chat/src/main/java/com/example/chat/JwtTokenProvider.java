package com.example.chat;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}") // Injected from application.yml
    private String jwtSecret;

    private Key key;

    @PostConstruct
    public void init() {
        // Generate a secure key from the secret string
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    // Validate the JWT token
    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(authToken);
            return true;
        } catch (MalformedJwtException ex) {
            System.err.println("Invalid JWT token: " + ex.getMessage());
        } catch (ExpiredJwtException ex) {
            System.err.println("Expired JWT token: " + ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            System.err.println("Unsupported JWT token: " + ex.getMessage());
        } catch (IllegalArgumentException ex) {
            System.err.println("JWT claims string is empty: " + ex.getMessage());
        } catch (io.jsonwebtoken.security.SignatureException ex) { // Specific for signature validation
            System.err.println("Invalid JWT signature: " + ex.getMessage());
        }
        return false;
    }

    // Get user ID from token
    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        // Assuming you put 'userId' as a claim in your Auth Service
        return Long.parseLong(claims.getSubject()); // Or claims.get("userId", Long.class) if you used a custom claim
    }

    // Get username from token (assuming it's the subject)
    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject(); // Assuming username is stored in the subject claim
    }
}
