 package com.example.auth.util;

    import com.example.auth.config.JwtProperties; // Import the new JwtProperties class
    import com.example.auth.dto.UserAuthDetails;
    import io.jsonwebtoken.Claims;
    import io.jsonwebtoken.Jwts;
    import io.jsonwebtoken.SignatureAlgorithm;
    import io.jsonwebtoken.io.Decoders;
    import io.jsonwebtoken.security.Keys;
    import org.springframework.beans.factory.annotation.Autowired; // Add Autowired
    import org.springframework.stereotype.Component;

    import java.security.Key;
    import java.util.Date;
    import java.util.HashMap;
    import java.util.Map;
    import java.util.function.Function;

    @Component
    public class JwtUtil {

        @Autowired // Inject the JwtProperties bean
        private JwtProperties jwtProperties;

        // Remove @Value annotations, as properties are now from JwtProperties
        // @Value("${jwt.secret}")
        // private String SECRET_KEY;

        // @Value("${jwt.expiration}")
        // private long EXPIRATION_TIME;

        // Generate token from UserAuthDetails
        public String generateToken(UserAuthDetails userDetails) {
            Map<String, Object> claims = new HashMap<>();
            claims.put("userId", userDetails.getId());
            claims.put("email", userDetails.getEmail());
            claims.put("firstName", userDetails.getFirstName());
            claims.put("lastName", userDetails.getLastName());

            return createToken(claims, userDetails.getEmail());
        }

        private String createToken(Map<String, Object> claims, String subject) {
            return Jwts.builder()
                    .setClaims(claims)
                    .setSubject(subject)
                    .setIssuedAt(new Date(System.currentTimeMillis()))
                    .setExpiration(new Date(System.currentTimeMillis() + jwtProperties.getExpiration())) // Use from JwtProperties
                    .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                    .compact();
        }

        private Claims extractAllClaims(String token) {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        }

        public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
            final Claims claims = extractAllClaims(token);
            return claimsResolver.apply(claims);
        }

        public String extractUsername(String token) {
            return extractClaim(token, Claims::getSubject);
        }

        public Date extractExpiration(String token) {
            return extractClaim(token, Claims::getExpiration);
        }

        private Boolean isTokenExpired(String token) {
            return extractExpiration(token).before(new Date());
        }

        public Boolean validateToken(String token) {
            try {
                final String username = extractUsername(token);
                return (username != null && !isTokenExpired(token));
            } catch (Exception e) {
                System.err.println("JWT Validation Error: " + e.getMessage());
                return false;
            }
        }

        private Key getSigningKey() {
            byte[] keyBytes = Decoders.BASE64.decode(jwtProperties.getSecret()); // Use from JwtProperties
            return Keys.hmacShaKeyFor(keyBytes);
        }
    }
    