package com.example.portfolio;

import com.example.portfolio.Portfolio;
import com.example.portfolio.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Marks this class as a REST controller
@RequestMapping("/portfolios") // Base path for all endpoints in this controller
public class PortfolioController {

    @Autowired
    private PortfolioService portfolioService;

    // Create a new portfolio
    @PostMapping
    public ResponseEntity<Portfolio> createPortfolio(@RequestBody Portfolio portfolio) {
        // In a real application, userId would come from the authenticated user's JWT token
        // For now, we assume it's part of the request body or a path variable.
        // For testing, ensure portfolio.userId is set in the request.
        Portfolio createdPortfolio = portfolioService.createPortfolio(portfolio);
        return new ResponseEntity<>(createdPortfolio, HttpStatus.CREATED);
    }

    // Get all portfolios for a specific user
    // In a real app, userId would be extracted from the JWT or a path variable like /users/{userId}/portfolios
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Portfolio>> getPortfoliosByUserId(@PathVariable Long userId) {
        List<Portfolio> portfolios = portfolioService.getPortfoliosByUserId(userId);
        if (portfolios.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(portfolios, HttpStatus.OK);
    }

    // Get a single portfolio by ID and userId
    @GetMapping("/{id}/user/{userId}")
    public ResponseEntity<Portfolio> getPortfolioByIdAndUserId(@PathVariable Long id, @PathVariable Long userId) {
        return portfolioService.getPortfolioByIdAndUserId(id, userId)
                .map(portfolio -> new ResponseEntity<>(portfolio, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Update an existing portfolio
    @PutMapping("/{id}/user/{userId}")
    public ResponseEntity<Portfolio> updatePortfolio(@PathVariable Long id, @PathVariable Long userId, @RequestBody Portfolio portfolio) {
        return portfolioService.updatePortfolio(id, userId, portfolio)
                .map(updatedPortfolio -> new ResponseEntity<>(updatedPortfolio, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Delete a portfolio
    @DeleteMapping("/{id}/user/{userId}")
    public ResponseEntity<Void> deletePortfolio(@PathVariable Long id, @PathVariable Long userId) {
        if (portfolioService.deletePortfolio(id, userId)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
