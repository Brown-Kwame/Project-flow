package com.example.asana.controller;

import com.example.asana.model.Portfolio;
import com.example.asana.service.PortfolioService;
import com.example.asana.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolios")
@CrossOrigin(origins = "*")
public class PortfolioController {

    @Autowired
    private PortfolioService portfolioService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Portfolio>> getAllPortfolios() {
        try {
            List<Portfolio> portfolios = portfolioService.getAllPortfolios();
            return new ResponseEntity<>(portfolios, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Portfolio> createPortfolio(@RequestBody Portfolio portfolio) {
        Portfolio createdPortfolio = portfolioService.createPortfolio(portfolio);
        return new ResponseEntity<>(createdPortfolio, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Portfolio>> getPortfoliosByUserId(@PathVariable Long userId) {
        List<Portfolio> portfolios = portfolioService.getPortfoliosByUserId(userId);
        if (portfolios.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(portfolios, HttpStatus.OK);
    }

    @GetMapping("/{id}/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Portfolio> getPortfolioByIdAndUserId(@PathVariable Long id, @PathVariable Long userId) {
        return portfolioService.getPortfolioByIdAndUserId(id, userId)
                .map(portfolio -> new ResponseEntity<>(portfolio, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Portfolio> updatePortfolio(@PathVariable Long id, @PathVariable Long userId, @RequestBody Portfolio portfolio) {
        return portfolioService.updatePortfolio(id, userId, portfolio)
                .map(updatedPortfolio -> new ResponseEntity<>(updatedPortfolio, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deletePortfolio(@PathVariable Long id, @PathVariable Long userId) {
        if (portfolioService.deletePortfolio(id, userId)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deletePortfolioById(@PathVariable Long id) {
        try {
            // Get current authenticated user
            Long currentUserId = getAuthenticatedUserId();
            if (currentUserId == null) {
                System.err.println("No authenticated user found");
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
            
            System.out.println("Attempting to delete portfolio " + id + " for user " + currentUserId);
            
            if (portfolioService.deletePortfolio(id, currentUserId)) {
                System.out.println("Portfolio " + id + " deleted successfully");
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                System.err.println("Portfolio " + id + " not found or user not authorized");
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            System.err.println("Error deleting portfolio: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/test-auth")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> testAuthentication() {
        try {
            Long currentUserId = getAuthenticatedUserId();
            if (currentUserId == null) {
                return new ResponseEntity<>("No authenticated user found", HttpStatus.UNAUTHORIZED);
            }
            return new ResponseEntity<>("Authenticated user ID: " + currentUserId, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private Long getAuthenticatedUserId() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()) {
                Object principal = authentication.getPrincipal();
                System.out.println("Principal type: " + principal.getClass().getName());
                
                if (principal instanceof UserDetailsImpl) {
                    UserDetailsImpl userDetails = (UserDetailsImpl) principal;
                    System.out.println("Authenticated user ID: " + userDetails.getId());
                    return userDetails.getId();
                } else {
                    System.err.println("Principal is not UserDetailsImpl: " + principal);
                }
            } else {
                System.err.println("No authentication found or not authenticated");
            }
        } catch (Exception e) {
            System.err.println("Error getting authenticated user: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }
} 