package com.example.portfolio;

import com.example.portfolio.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository // Marks this interface as a Spring Data JPA repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {

    // Custom query method: Find portfolios by userId
    List<Portfolio> findByUserId(Long userId);

    // Custom query method: Find a portfolio by userId and id
    Optional<Portfolio> findByUserIdAndId(Long userId, Long id);
}