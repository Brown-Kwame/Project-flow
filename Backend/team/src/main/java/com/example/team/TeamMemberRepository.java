package com.example.team;

import com.example.team.TeamMember;
import com.example.team.TeamRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
    List<TeamMember> findByTeamId(Long teamId);
    Optional<TeamMember> findByTeamIdAndUserId(Long teamId, Long userId);
    List<TeamMember> findByUserId(Long userId); // Find all teams a user belongs to
    long countByTeamIdAndRole(Long teamId, TeamRole role); // Count admins for a team
}
