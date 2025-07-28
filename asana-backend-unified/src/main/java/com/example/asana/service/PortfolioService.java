package com.example.asana.service;

import com.example.asana.exception.ResourceNotFoundException;
import com.example.asana.model.Portfolio;
import com.example.asana.repository.PortfolioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PortfolioService {

    @Autowired
    private PortfolioRepository portfolioRepository;

    public List<Portfolio> getAllPortfolios() {
        return portfolioRepository.findAll();
    }

    @Transactional
    public Portfolio createPortfolio(Portfolio portfolio) {
        portfolio.setCreationDate(LocalDateTime.now());
        portfolio.setLastUpdatedDate(LocalDateTime.now());
        return portfolioRepository.save(portfolio);
    }

    public List<Portfolio> getPortfoliosByUserId(Long userId) {
        return portfolioRepository.findByUserId(userId);
    }

    public Optional<Portfolio> getPortfolioByIdAndUserId(Long id, Long userId) {
        return portfolioRepository.findByUserIdAndId(userId, id);
    }

    @Transactional
    public Optional<Portfolio> updatePortfolio(Long id, Long userId, Portfolio updatedPortfolio) {
        return portfolioRepository.findByUserIdAndId(userId, id).map(existingPortfolio -> {
            existingPortfolio.setName(updatedPortfolio.getName());
            existingPortfolio.setDescription(updatedPortfolio.getDescription());
            existingPortfolio.setLastUpdatedDate(LocalDateTime.now());
            return portfolioRepository.save(existingPortfolio);
        });
    }

    @Transactional
    public boolean deletePortfolio(Long id, Long userId) {
        return portfolioRepository.findByUserIdAndId(userId, id).map(portfolio -> {
            portfolioRepository.delete(portfolio);
            return true;
        }).orElse(false);
    }
} 