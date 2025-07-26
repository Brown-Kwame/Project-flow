package com.example.team;

import com.example.team.dto.TeamMemberRequest;
import com.example.team.dto.TeamMemberResponse;
import com.example.team.dto.TeamRequest;
import com.example.team.dto.TeamResponse;
import com.example.team.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // For method-level security
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
 // Import LoggerFactory

@RestController
@RequestMapping("/teams") // Base path for all team-related endpoints
public class TeamController {

    @Autowired
    private TeamService teamService;

    /**
     * Helper method to retrieve the authenticated user's ID from the Spring Security context.
     * This relies on the JwtAuthenticationFilter (in SecurityConfig) having stored the userId
     * in the Authentication.details field.
     *
     * @return The ID of the authenticated user.
     * @throws SecurityException if the user is not authenticated or their ID cannot be found.
     */
    private Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // --- ADD THESE DEBUG LOGS ---
        System.out.println("DEBUG: In getAuthenticatedUserId() - Authentication: " + authentication);
        if (authentication != null && authentication.isAuthenticated()) {
            System.out.println("DEBUG: Principal: " + authentication.getPrincipal());
            System.out.println("DEBUG: Details: " + authentication.getDetails());
            System.out.println("DEBUG: Authorities: " + authentication.getAuthorities());
        }
        // --- END DEBUG LOGS ---

        if (authentication != null && authentication.isAuthenticated() && authentication.getDetails() instanceof Long) {
            return (Long) authentication.getDetails();
        }
        throw new SecurityException("User not authenticated or user ID not found in security context.");
    }
    
    // --- Team Endpoints ---

    /**
     * Creates a new team. The authenticated user will be automatically set as the owner
     * and added as an ADMIN member of the new team.
     *
     * Requires the user to be authenticated.
     *
     * @param teamRequest DTO containing the desired name and description for the new team.
     * @return ResponseEntity with the created TeamResponse (including generated ID) and HTTP status 201 Created.
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()") // Only authenticated users are allowed to create teams
    public ResponseEntity<TeamResponse> createTeam(@RequestBody TeamRequest teamRequest) {
        try {
            Long authenticatedUserId = getAuthenticatedUserId();
            // IMPORTANT: Override ownerUserId from request with authenticatedUserId to prevent spoofing
            teamRequest.setOwnerUserId(authenticatedUserId);
            TeamResponse team = teamService.createTeam(teamRequest, authenticatedUserId);
            return new ResponseEntity<>(team, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            // Catch specific business logic errors (e.g., team name already exists, invalid owner)
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (SecurityException e) {
            // Catch security-related errors (e.g., user not authenticated, or ID not found)
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED); // Or FORBIDDEN if authenticated but not authorized
        } catch (Exception e) {
            // Catch any other unexpected errors
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Retrieves a list of all teams owned by a specific user.
     *
     * Requires authentication. The `ownerId` in the path must match the authenticated user's ID
     * to prevent users from viewing teams owned by others.
     *
     * @param ownerId The ID of the user whose owned teams are to be retrieved.
     * @return ResponseEntity with a list of TeamResponse objects and HTTP status 200 OK.
     */
    @GetMapping("/owner/{ownerId}")
    @PreAuthorize("isAuthenticated() and #ownerId == authentication.details") // #ownerId refers to path variable, authentication.details is our stored userId
    public ResponseEntity<List<TeamResponse>> getTeamsByOwner(@PathVariable Long ownerId) {
        List<TeamResponse> teams = teamService.getTeamsByOwner(ownerId);
        return new ResponseEntity<>(teams, HttpStatus.OK);
    }

    /**
     * Retrieves a list of all teams a specific user is a member of.
     *
     * Requires authentication. The `userId` in the path must match the authenticated user's ID.
     *
     * @param userId The ID of the user whose team memberships are to be retrieved.
     * @return ResponseEntity with a list of TeamResponse objects and HTTP status 200 OK.
     */
    @GetMapping("/member/{userId}")
    @PreAuthorize("isAuthenticated() and #userId == authentication.details")
    public ResponseEntity<List<TeamResponse>> getTeamsByMember(@PathVariable Long userId) {
        List<TeamResponse> teams = teamService.getTeamsByMember(userId);
        return new ResponseEntity<>(teams, HttpStatus.OK);
    }

    /**
     * Retrieves the details of a specific team by its ID.
     *
     * Requires authentication. The authenticated user must be a member of the team
     * to view its details.
     *
     * @param teamId The ID of the team to retrieve.
     * @return ResponseEntity with the TeamResponse object and HTTP status 200 OK, or 404 Not Found.
     */
    @GetMapping("/{teamId}")
    // SpEL: Check if authenticated user is a member of this team by calling teamService.getTeamMember
    @PreAuthorize("isAuthenticated() and @teamService.getTeamMember(#teamId, authentication.details).isPresent()")
    public ResponseEntity<TeamResponse> getTeamById(@PathVariable Long teamId) {
        return teamService.getTeamById(teamId)
                .map(team -> new ResponseEntity<>(team, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Updates an existing team's details (name, description).
     *
     * Requires authentication. Only users with the ADMIN role within that specific team
     * are authorized to update its details.
     *
     * @param teamId The ID of the team to update.
     * @param teamRequest DTO containing the updated team details.
     * @return ResponseEntity with the updated TeamResponse and HTTP status 200 OK.
     */
    @PutMapping("/{teamId}")
    // SpEL: Check if authenticated user is an ADMIN of this team
    @PreAuthorize("isAuthenticated() and @teamService.isTeamAdmin(#teamId, authentication.details)")
    public ResponseEntity<TeamResponse> updateTeam(@PathVariable Long teamId, @RequestBody TeamRequest teamRequest) {
        try {
            Long authenticatedUserId = getAuthenticatedUserId();
            TeamResponse updatedTeam = teamService.updateTeam(teamId, teamRequest, authenticatedUserId);
            return new ResponseEntity<>(updatedTeam, HttpStatus.OK);
        } catch (IllegalArgumentException | SecurityException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Deletes a team and all its associated members.
     *
     * Requires authentication. Only users with the ADMIN role within that specific team
     * are authorized to delete it.
     *
     * @param teamId The ID of the team to delete.
     * @return ResponseEntity with no content and HTTP status 204 No Content.
     */
    @DeleteMapping("/{teamId}")
    @PreAuthorize("isAuthenticated() and @teamService.isTeamAdmin(#teamId, authentication.details)")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long teamId) {
        try {
            Long authenticatedUserId = getAuthenticatedUserId();
            teamService.deleteTeam(teamId, authenticatedUserId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException | SecurityException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // --- Team Member Endpoints ---

    /**
     * Adds a new member to a specific team.
     *
     * Requires authentication. Only users with the ADMIN role within that team
     * are authorized to add new members.
     *
     * @param teamId The ID of the team to which the member will be added.
     * @param memberRequest DTO containing the userId and desired role for the new member.
     * @return ResponseEntity with the created TeamMemberResponse and HTTP status 201 Created.
     */
    @PostMapping("/{teamId}/members")
    @PreAuthorize("isAuthenticated() and @teamService.isTeamAdmin(#teamId, authentication.details)")
    public ResponseEntity<TeamMemberResponse> addTeamMember(@PathVariable Long teamId, @RequestBody TeamMemberRequest memberRequest) {
        try {
            Long authenticatedUserId = getAuthenticatedUserId();
            TeamMemberResponse member = teamService.addTeamMember(teamId, memberRequest, authenticatedUserId);
            return new ResponseEntity<>(member, HttpStatus.CREATED);
        } catch (IllegalArgumentException | SecurityException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Removes a member from a specific team.
     *
     * Requires authentication. Only users with the ADMIN role within that team
     * are authorized to remove members.
     *
     * @param teamId The ID of the team from which the member will be removed.
     * @param userIdToRemove The ID of the user (team member) to remove.
     * @return ResponseEntity with no content and HTTP status 204 No Content.
     */
    @DeleteMapping("/{teamId}/members/{userIdToRemove}")
    @PreAuthorize("isAuthenticated() and @teamService.isTeamAdmin(#teamId, authentication.details)")
    public ResponseEntity<Void> removeTeamMember(@PathVariable Long teamId, @PathVariable Long userIdToRemove) {
        try {
            Long authenticatedUserId = getAuthenticatedUserId();
            teamService.removeTeamMember(teamId, userIdToRemove, authenticatedUserId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException | SecurityException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Retrieves a list of all members belonging to a specific team.
     *
     * Requires authentication. The authenticated user must be a member of the team
     * to view its member list.
     *
     * @param teamId The ID of the team whose members are to be retrieved.
     * @return ResponseEntity with a list of TeamMemberResponse objects and HTTP status 200 OK.
     */
    @GetMapping("/{teamId}/members")
    @PreAuthorize("isAuthenticated() and @teamService.getTeamMember(#teamId, authentication.details).isPresent()")
    public ResponseEntity<List<TeamMemberResponse>> getTeamMembers(@PathVariable Long teamId) {
        List<TeamMemberResponse> members = teamService.getTeamMembers(teamId);
        return new ResponseEntity<>(members, HttpStatus.OK);
    }

    /**
     * Retrieves details of a specific team member within a team.
     *
     * Requires authentication. The authenticated user can view their own member details
     * or an ADMIN of the team can view any member's details.
     *
     * @param teamId The ID of the team.
     * @param userId The ID of the user (team member) to retrieve.
     * @return ResponseEntity with the TeamMemberResponse object and HTTP status 200 OK, or 404 Not Found.
     */
    @GetMapping("/{teamId}/members/{userId}")
    @PreAuthorize("isAuthenticated() and (#userId == authentication.details or @teamService.isTeamAdmin(#teamId, authentication.details))")
    public ResponseEntity<TeamMemberResponse> getTeamMember(@PathVariable Long teamId, @PathVariable Long userId) {
        return teamService.getTeamMember(teamId, userId)
                .map(member -> new ResponseEntity<>(member, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
