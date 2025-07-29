package com.example.asana.controller;

import com.example.asana.dto.TeamMemberRequest;
import com.example.asana.dto.TeamMemberResponse;
import com.example.asana.dto.TeamRequest;
import com.example.asana.dto.TeamResponse;
import com.example.asana.dto.TeamDetailResponse;
import com.example.asana.service.TeamService;
import com.example.asana.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "*")
public class TeamController {

    @Autowired
    private TeamService teamService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TeamResponse>> getAllTeams() {
        try {
            Long authenticatedUserId = getAuthenticatedUserId();
            // Get teams where user is owner or member
            List<TeamResponse> ownedTeams = teamService.getTeamsByOwner(authenticatedUserId);
            List<TeamResponse> memberTeams = teamService.getTeamsByMember(authenticatedUserId);
            
            // Combine and remove duplicates
            Set<Long> teamIds = new HashSet<>();
            List<TeamResponse> allUserTeams = new ArrayList<>();
            
            for (TeamResponse team : ownedTeams) {
                if (!teamIds.contains(team.getId())) {
                    teamIds.add(team.getId());
                    allUserTeams.add(team);
                }
            }
            
            for (TeamResponse team : memberTeams) {
                if (!teamIds.contains(team.getId())) {
                    teamIds.add(team.getId());
                    allUserTeams.add(team);
                }
            }
            
            return new ResponseEntity<>(allUserTeams, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() instanceof UserDetailsImpl) {
            return ((UserDetailsImpl) authentication.getPrincipal()).getId();
        }
        throw new SecurityException("User not authenticated or user ID not found in security context.");
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TeamResponse> createTeam(@Valid @RequestBody TeamRequest teamRequest) {
        try {
            System.out.println("createTeam endpoint called");
            System.out.println("TeamRequest received: " + teamRequest);
            System.out.println("Team name: " + teamRequest.getName());
            System.out.println("Team description: " + teamRequest.getDescription());
            System.out.println("OwnerUserId from request: " + teamRequest.getOwnerUserId());
            
            Long authenticatedUserId = getAuthenticatedUserId();
            System.out.println("Authenticated user ID: " + authenticatedUserId);
            
            teamRequest.setOwnerUserId(authenticatedUserId);
            System.out.println("Setting ownerUserId to: " + authenticatedUserId);
            
            TeamResponse team = teamService.createTeam(teamRequest, authenticatedUserId);
            System.out.println("Team created successfully: " + team.getId());
            return new ResponseEntity<>(team, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error in createTeam: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/owner/{ownerId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TeamResponse>> getTeamsByOwner(@PathVariable Long ownerId) {
        List<TeamResponse> teams = teamService.getTeamsByOwner(ownerId);
        return new ResponseEntity<>(teams, HttpStatus.OK);
    }

    @GetMapping("/member/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TeamResponse>> getTeamsByMember(@PathVariable Long userId) {
        List<TeamResponse> teams = teamService.getTeamsByMember(userId);
        return new ResponseEntity<>(teams, HttpStatus.OK);
    }

    @GetMapping("/{teamId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TeamResponse> getTeamById(@PathVariable Long teamId) {
        return teamService.getTeamById(teamId)
                .map(team -> new ResponseEntity<>(team, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/{teamId}/details")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TeamDetailResponse> getTeamDetails(@PathVariable Long teamId) {
        try {
            System.out.println("getTeamDetails endpoint called for team ID: " + teamId);
            TeamDetailResponse teamDetails = teamService.getTeamDetails(teamId);
            return new ResponseEntity<>(teamDetails, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error in getTeamDetails: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{teamId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TeamResponse> updateTeam(@PathVariable Long teamId, @RequestBody TeamRequest teamRequest) {
        try {
            Long authenticatedUserId = getAuthenticatedUserId();
            TeamResponse updatedTeam = teamService.updateTeam(teamId, teamRequest, authenticatedUserId);
            return new ResponseEntity<>(updatedTeam, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{teamId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long teamId) {
        try {
            Long authenticatedUserId = getAuthenticatedUserId();
            teamService.deleteTeam(teamId, authenticatedUserId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{teamId}/members")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TeamMemberResponse> addTeamMember(@PathVariable Long teamId, @RequestBody TeamMemberRequest memberRequest) {
        try {
            System.out.println("addTeamMember endpoint called");
            System.out.println("Team ID: " + teamId);
            System.out.println("Member Request: " + memberRequest);
            System.out.println("User ID: " + memberRequest.getUserId());
            System.out.println("Role: " + memberRequest.getRole());
            
            Long authenticatedUserId = getAuthenticatedUserId();
            System.out.println("Authenticated user ID: " + authenticatedUserId);
            
            TeamMemberResponse member = teamService.addTeamMember(teamId, memberRequest, authenticatedUserId);
            System.out.println("Team member added successfully: " + member.getId());
            return new ResponseEntity<>(member, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error in addTeamMember: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{teamId}/members/{userIdToRemove}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> removeTeamMember(@PathVariable Long teamId, @PathVariable Long userIdToRemove) {
        try {
            Long authenticatedUserId = getAuthenticatedUserId();
            teamService.removeTeamMember(teamId, userIdToRemove, authenticatedUserId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{teamId}/members")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TeamMemberResponse>> getTeamMembers(@PathVariable Long teamId) {
        List<TeamMemberResponse> members = teamService.getTeamMembers(teamId);
        return new ResponseEntity<>(members, HttpStatus.OK);
    }

    @GetMapping("/{teamId}/members/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TeamMemberResponse> getTeamMember(@PathVariable Long teamId, @PathVariable Long userId) {
        return teamService.getTeamMember(teamId, userId)
                .map(member -> new ResponseEntity<>(member, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
} 