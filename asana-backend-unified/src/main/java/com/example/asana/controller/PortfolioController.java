package com.example.asana.controller;

import com.example.asana.model.Portfolio;
import com.example.asana.service.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
} 