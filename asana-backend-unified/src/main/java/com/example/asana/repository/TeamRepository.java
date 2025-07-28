package com.example.asana.repository;

import com.example.asana.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    
    List<Team> findByOwnerUser_Id(Long ownerUserId);
} 