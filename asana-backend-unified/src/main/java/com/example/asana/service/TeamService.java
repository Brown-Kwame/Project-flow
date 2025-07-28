package com.example.asana.service;

import com.example.asana.dto.TeamMemberRequest;
import com.example.asana.dto.TeamMemberResponse;
import com.example.asana.dto.TeamRequest;
import com.example.asana.dto.TeamResponse;
import com.example.asana.exception.ResourceNotFoundException;
import com.example.asana.model.Team;
import com.example.asana.model.TeamMember;
import com.example.asana.model.TeamRole;
import com.example.asana.model.User;
import com.example.asana.repository.TeamMemberRepository;
import com.example.asana.repository.TeamRepository;
import com.example.asana.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TeamMemberRepository teamMemberRepository;

    @Autowired
    private UserRepository userRepository;

    public List<TeamResponse> getAllTeams() {
        List<Team> teams = teamRepository.findAll();
        return teams.stream()
                .map(this::convertToTeamResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TeamResponse createTeam(TeamRequest teamRequest, Long authenticatedUserId) {
        User ownerUser = userRepository.findById(authenticatedUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + authenticatedUserId));

        Team team = new Team();
        team.setName(teamRequest.getName());
        team.setDescription(teamRequest.getDescription());
        team.setOwnerUser(ownerUser);

        Team savedTeam = teamRepository.save(team);

        // Add the owner as an ADMIN member
        TeamMember ownerMember = new TeamMember();
        ownerMember.setTeam(savedTeam);
        ownerMember.setUser(ownerUser);
        ownerMember.setRole(TeamRole.ADMIN);
        teamMemberRepository.save(ownerMember);

        return convertToTeamResponse(savedTeam);
    }

    public List<TeamResponse> getTeamsByOwner(Long ownerId) {
        List<Team> teams = teamRepository.findByOwnerUser_Id(ownerId);
        return teams.stream()
                .map(this::convertToTeamResponse)
                .collect(Collectors.toList());
    }

    public List<TeamResponse> getTeamsByMember(Long userId) {
        List<TeamMember> memberships = teamMemberRepository.findByUser_Id(userId);
        return memberships.stream()
                .map(member -> convertToTeamResponse(member.getTeam()))
                .collect(Collectors.toList());
    }

    public Optional<TeamResponse> getTeamById(Long teamId) {
        return teamRepository.findById(teamId).map(this::convertToTeamResponse);
    }

    @Transactional
    public TeamResponse updateTeam(Long teamId, TeamRequest teamRequest, Long authenticatedUserId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + teamId));

        if (teamRequest.getName() != null) team.setName(teamRequest.getName());
        if (teamRequest.getDescription() != null) team.setDescription(teamRequest.getDescription());

        Team updatedTeam = teamRepository.save(team);
        return convertToTeamResponse(updatedTeam);
    }

    @Transactional
    public void deleteTeam(Long teamId, Long authenticatedUserId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + teamId));

        // Delete all team members first
        List<TeamMember> members = teamMemberRepository.findByTeam_Id(teamId);
        teamMemberRepository.deleteAll(members);

        // Delete the team
        teamRepository.delete(team);
    }

    @Transactional
    public TeamMemberResponse addTeamMember(Long teamId, TeamMemberRequest memberRequest, Long authenticatedUserId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + teamId));

        User user = userRepository.findById(memberRequest.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + memberRequest.getUserId()));

        if (teamMemberRepository.existsByTeam_IdAndUser_Id(teamId, memberRequest.getUserId())) {
            throw new IllegalArgumentException("User is already a member of this team");
        }

        TeamMember member = new TeamMember();
        member.setTeam(team);
        member.setUser(user);
        member.setRole(memberRequest.getRole() != null ? memberRequest.getRole() : TeamRole.MEMBER);

        TeamMember savedMember = teamMemberRepository.save(member);
        return convertToTeamMemberResponse(savedMember);
    }

    @Transactional
    public void removeTeamMember(Long teamId, Long userIdToRemove, Long authenticatedUserId) {
        TeamMember member = teamMemberRepository.findByTeam_IdAndUser_Id(teamId, userIdToRemove)
                .orElseThrow(() -> new ResourceNotFoundException("Team member not found"));

        teamMemberRepository.delete(member);
    }

    public List<TeamMemberResponse> getTeamMembers(Long teamId) {
        List<TeamMember> members = teamMemberRepository.findByTeam_Id(teamId);
        return members.stream()
                .map(this::convertToTeamMemberResponse)
                .collect(Collectors.toList());
    }

    public Optional<TeamMemberResponse> getTeamMember(Long teamId, Long userId) {
        return teamMemberRepository.findByTeam_IdAndUser_Id(teamId, userId)
                .map(this::convertToTeamMemberResponse);
    }

    public boolean isTeamAdmin(Long teamId, Long userId) {
        return teamMemberRepository.findByTeam_IdAndUser_Id(teamId, userId)
                .map(member -> member.getRole() == TeamRole.ADMIN)
                .orElse(false);
    }

    private TeamResponse convertToTeamResponse(Team team) {
        if (team.getOwnerUser() == null) {
            throw new ResourceNotFoundException("Team with id: " + team.getId() + " has no owner user. Data integrity error.");
        }
        return new TeamResponse(
                team.getId(),
                team.getName(),
                team.getDescription(),
                team.getOwnerUser().getId(),
                team.getOwnerUser().getUsername(),
                team.getCreatedAt(),
                team.getUpdatedAt()
        );
    }

    private TeamMemberResponse convertToTeamMemberResponse(TeamMember member) {
        return new TeamMemberResponse(
                member.getId(),
                member.getTeam().getId(),
                member.getUser().getId(),
                member.getUser().getUsername(),
                member.getRole(),
                member.getJoinedAt(),
                member.getUpdatedAt()
        );
    }
} 