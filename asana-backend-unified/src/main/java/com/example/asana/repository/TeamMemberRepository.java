package com.example.asana.repository;

import com.example.asana.model.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
    
    List<TeamMember> findByTeam_Id(Long teamId);
    
    List<TeamMember> findByUser_Id(Long userId);
    
    Optional<TeamMember> findByTeam_IdAndUser_Id(Long teamId, Long userId);
    
    boolean existsByTeam_IdAndUser_Id(Long teamId, Long userId);
} 