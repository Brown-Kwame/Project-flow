package com.example.asana.service;

import com.example.asana.exception.ResourceNotFoundException;
import com.example.asana.model.Portfolio;
import com.example.asana.model.Project;
import com.example.asana.repository.PortfolioRepository;
import com.example.asana.repository.ProjectRepository;
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

    @Autowired
    private ProjectRepository projectRepository;

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
        System.out.println("PortfolioService.deletePortfolio called with id: " + id + ", userId: " + userId);
        
        try {
            // First check if portfolio exists
            Optional<Portfolio> portfolioOpt = portfolioRepository.findByUserIdAndId(userId, id);
            if (portfolioOpt.isPresent()) {
                Portfolio portfolio = portfolioOpt.get();
                System.out.println("Found portfolio: " + portfolio.getName() + " (ID: " + portfolio.getId() + ")");
                
                try {
                    // First, delete all projects associated with this portfolio
                    List<Project> associatedProjects = projectRepository.findByPortfolioId(id);
                    System.out.println("Found " + associatedProjects.size() + " projects associated with portfolio " + id);
                    
                    if (!associatedProjects.isEmpty()) {
                        projectRepository.deleteAll(associatedProjects);
                        System.out.println("Deleted " + associatedProjects.size() + " associated projects");
                    }
                } catch (Exception e) {
                    System.err.println("Error deleting associated projects: " + e.getMessage());
                    e.printStackTrace();
                    // Continue with portfolio deletion even if project deletion fails
                }
                
                try {
                    // Then delete the portfolio
                    portfolioRepository.delete(portfolio);
                    System.out.println("Portfolio deleted successfully");
                    return true;
                } catch (Exception e) {
                    System.err.println("Error deleting portfolio: " + e.getMessage());
                    e.printStackTrace();
                    throw e;
                }
            } else {
                System.err.println("Portfolio not found for id: " + id + ", userId: " + userId);
                return false;
            }
        } catch (Exception e) {
            System.err.println("Error in deletePortfolio: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
} 