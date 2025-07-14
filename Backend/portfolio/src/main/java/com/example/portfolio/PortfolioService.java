package com.example.portfolio;

import com.example.portfolio.Portfolio;
import com.example.portfolio.PortfolioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service // Marks this class as a Spring service component
public class PortfolioService {

    @Autowired
    private PortfolioRepository portfolioRepository;

    // Create a new portfolio
    public Portfolio createPortfolio(Portfolio portfolio) {
        portfolio.setCreationDate(LocalDateTime.now());
        portfolio.setLastUpdatedDate(LocalDateTime.now());
        return portfolioRepository.save(portfolio);
    }

    // Get all portfolios for a specific user
    public List<Portfolio> getPortfoliosByUserId(Long userId) {
        return portfolioRepository.findByUserId(userId);
    }

    // Get a single portfolio by its ID and userId (for ownership check)
    public Optional<Portfolio> getPortfolioByIdAndUserId(Long id, Long userId) {
        return portfolioRepository.findByUserIdAndId(userId, id);
    }

    // Update an existing portfolio
    public Optional<Portfolio> updatePortfolio(Long id, Long userId, Portfolio updatedPortfolio) {
        return portfolioRepository.findByUserIdAndId(userId, id).map(existingPortfolio -> {
            existingPortfolio.setName(updatedPortfolio.getName());
            existingPortfolio.setDescription(updatedPortfolio.getDescription());
            existingPortfolio.setLastUpdatedDate(LocalDateTime.now());
            return portfolioRepository.save(existingPortfolio);
        });
    }

    // Delete a portfolio
    public boolean deletePortfolio(Long id, Long userId) {
        return portfolioRepository.findByUserIdAndId(userId, id).map(portfolio -> {
            portfolioRepository.delete(portfolio);
            return true;
        }).orElse(false);
    }
}