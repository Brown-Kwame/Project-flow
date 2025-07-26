package com.example.team;


import com.example.team.dto.TeamMemberRequest;
import com.example.team.dto.TeamMemberResponse;
import com.example.team.dto.TeamRequest;
import com.example.team.dto.TeamResponse;
import com.example.team.dto.UserAuthDetails; // DTO for inter-service communication with User Service
import com.example.team.Team;
import com.example.team.TeamMember;
import com.example.team.TeamRole;
import com.example.team.TeamMemberRepository;
import com.example.team.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class TeamService {

    private static final Logger logger = LoggerFactory.getLogger(TeamService.class);

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TeamMemberRepository teamMemberRepository;

    @Autowired
    private WebClient.Builder webClientBuilder;

    @Autowired
    private DiscoveryClient discoveryClient;

    private static final String USER_SERVICE_ID = "USER-SERVICE";
    private static final String NOTIFICATION_SERVICE_ID = "NOTIFICATION-SERVICE";
    private static final String USER_FETCH_PATH = "/users/"; // e.g., /users/{id}
    private static final String NOTIFICATION_CREATE_PATH = "/notifications";


    // --- Team Operations ---

    /**
     * Creates a new team and automatically assigns the authenticated user as its owner and an ADMIN member.
     *
     * @param teamRequest The DTO containing the team's name and description.
     * @param authenticatedUserId The ID of the currently authenticated user.
     * @return The created TeamResponse DTO.
     * @throws IllegalArgumentException if the ownerUserId in the request does not match the authenticated user,
     * or if a team with the given name already exists.
     */
    @Transactional
    public TeamResponse createTeam(TeamRequest teamRequest, Long authenticatedUserId) {
        // Validate if authenticated user is trying to set themselves as owner
        if (teamRequest.getOwnerUserId() == null || !teamRequest.getOwnerUserId().equals(authenticatedUserId)) {
            throw new IllegalArgumentException("Team owner must be the authenticated user.");
        }
        if (teamRepository.findByName(teamRequest.getName()).isPresent()) {
            throw new IllegalArgumentException("Team with name '" + teamRequest.getName() + "' already exists.");
        }

        Team team = new Team();
        team.setName(teamRequest.getName());
        team.setDescription(teamRequest.getDescription());
        team.setOwnerUserId(authenticatedUserId); // Ensure owner is the authenticated user

        Team savedTeam = teamRepository.save(team);

        // Add the owner as an ADMIN member of the team
        TeamMember ownerMember = new TeamMember();
        ownerMember.setTeamId(savedTeam.getId());
        ownerMember.setUserId(authenticatedUserId);
        ownerMember.setRole(TeamRole.ADMIN);
        teamMemberRepository.save(ownerMember);

        // Send notification to owner
        sendNotification(authenticatedUserId, "Your team '" + savedTeam.getName() + "' has been created!", "TEAM_CREATED");

        return convertToTeamResponse(savedTeam);
    }

    /**
     * Retrieves a list of all teams owned by a specific user.
     *
     * @param ownerUserId The ID of the user whose owned teams are to be retrieved.
     * @return A list of TeamResponse DTOs.
     */
    public List<TeamResponse> getTeamsByOwner(Long ownerUserId) {
        return teamRepository.findByOwnerUserId(ownerUserId)
                .stream()
                .map(this::convertToTeamResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a list of all teams a specific user is a member of.
     *
     * @param userId The ID of the user whose team memberships are to be retrieved.
     * @return A list of TeamResponse DTOs.
     */
    public List<TeamResponse> getTeamsByMember(Long userId) {
        List<Long> teamIds = teamMemberRepository.findByUserId(userId)
                .stream()
                .map(TeamMember::getTeamId)
                .collect(Collectors.toList());
        return teamRepository.findAllById(teamIds)
                .stream()
                .map(this::convertToTeamResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves details of a specific team by its ID.
     *
     * @param teamId The ID of the team to retrieve.
     * @return An Optional containing the TeamResponse DTO if found, otherwise empty.
     */
    public Optional<TeamResponse> getTeamById(Long teamId) {
        return teamRepository.findById(teamId).map(this::convertToTeamResponse);
    }

    /**
     * Updates an existing team's details (name, description). Only the team owner can perform this.
     *
     * @param teamId The ID of the team to update.
     * @param teamRequest The DTO containing updated team details.
     * @param authenticatedUserId The ID of the currently authenticated user.
     * @return The updated TeamResponse DTO.
     * @throws IllegalArgumentException if the team is not found or if the new name conflicts with an existing team.
     * @throws SecurityException if the authenticated user is not the owner of the team.
     */
    @Transactional
    public TeamResponse updateTeam(Long teamId, TeamRequest teamRequest, Long authenticatedUserId) {
        Team existingTeam = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found with ID: " + teamId));

        // Only owner can update team details
        if (!existingTeam.getOwnerUserId().equals(authenticatedUserId)) {
            throw new SecurityException("Only the team owner can update team details.");
        }

        // Prevent changing name to an existing one (excluding itself)
        if (!existingTeam.getName().equals(teamRequest.getName()) && teamRepository.findByName(teamRequest.getName()).isPresent()) {
            throw new IllegalArgumentException("Team with name '" + teamRequest.getName() + "' already exists.");
        }

        existingTeam.setName(teamRequest.getName());
        existingTeam.setDescription(teamRequest.getDescription());
        // OwnerUserId cannot be changed via updateTeam

        Team updatedTeam = teamRepository.save(existingTeam);
        return convertToTeamResponse(updatedTeam);
    }

    /**
     * Deletes a team and all its associated members. Only the team owner can perform this.
     *
     * @param teamId The ID of the team to delete.
     * @param authenticatedUserId The ID of the currently authenticated user.
     * @throws IllegalArgumentException if the team is not found.
     * @throws SecurityException if the authenticated user is not the owner of the team.
     */
    @Transactional
    public void deleteTeam(Long teamId, Long authenticatedUserId) {
        Team existingTeam = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found with ID: " + teamId));

        // Only owner can delete team
        if (!existingTeam.getOwnerUserId().equals(authenticatedUserId)) {
            throw new SecurityException("Only the team owner can delete a team.");
        }

        // Delete all team members first (assuming cascade is not configured or prefer explicit deletion)
        teamMemberRepository.deleteAll(teamMemberRepository.findByTeamId(teamId));
        teamRepository.delete(existingTeam);

        // Send notification to owner
        sendNotification(authenticatedUserId, "Your team '" + existingTeam.getName() + "' has been deleted.", "TEAM_DELETED");
    }


    // --- Team Member Operations ---

    /**
     * Adds a new member to a specific team. Only team admins can perform this.
     *
     * @param teamId The ID of the team to which the member will be added.
     * @param memberRequest The DTO containing the userId and role of the new member.
     * @param authenticatedUserId The ID of the currently authenticated user.
     * @return The created TeamMemberResponse DTO.
     * @throws IllegalArgumentException if the team or user to add is not found, or if the user is already a member.
     * @throws SecurityException if the authenticated user is not an ADMIN of the team.
     */
    @Transactional
    public TeamMemberResponse addTeamMember(Long teamId, TeamMemberRequest memberRequest, Long authenticatedUserId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found with ID: " + teamId));

        // Check if authenticated user is an ADMIN of this team
        if (!isTeamAdmin(teamId, authenticatedUserId)) {
            throw new SecurityException("Only a team admin can add members.");
        }

        // Check if user to add exists in User Service
        UserAuthDetails userDetailsToAdd = fetchUserDetailsFromUserService(memberRequest.getUserId());
        if (userDetailsToAdd == null) {
            throw new IllegalArgumentException("User with ID " + memberRequest.getUserId() + " not found.");
        }

        if (teamMemberRepository.findByTeamIdAndUserId(teamId, memberRequest.getUserId()).isPresent()) {
            throw new IllegalArgumentException("User " + userDetailsToAdd.getEmail() + " is already a member of team " + team.getName());
        }

        TeamMember newMember = new TeamMember();
        newMember.setTeamId(teamId);
        newMember.setUserId(memberRequest.getUserId());
        newMember.setRole(memberRequest.getRole());

        TeamMember savedMember = teamMemberRepository.save(newMember);

        // Send notification to the added user
        sendNotification(memberRequest.getUserId(), "You have been added to team '" + team.getName() + "' as a " + memberRequest.getRole() + ".", "TEAM_JOINED");
        // Send notification to admin who added
        sendNotification(authenticatedUserId, userDetailsToAdd.getEmail() + " was added to team '" + team.getName() + "'.", "TEAM_MEMBER_ADDED");


        return convertToTeamMemberResponse(savedMember, userDetailsToAdd.getEmail(), userDetailsToAdd.getFirstName() + " " + userDetailsToAdd.getLastName());
    }

    /**
     * Removes a member from a specific team. Only team admins can perform this.
     *
     * @param teamId The ID of the team from which the member will be removed.
     * @param userIdToRemove The ID of the user (team member) to remove.
     * @param authenticatedUserId The ID of the currently authenticated user.
     * @throws IllegalArgumentException if the team or member is not found, or if trying to remove the last admin.
     * @throws SecurityException if the authenticated user is not an ADMIN of the team.
     */
    @Transactional
    public void removeTeamMember(Long teamId, Long userIdToRemove, Long authenticatedUserId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found with ID: " + teamId));

        // Check if authenticated user is an ADMIN of this team
        if (!isTeamAdmin(teamId, authenticatedUserId)) {
            throw new SecurityException("Only a team admin can remove members.");
        }

        // Prevent admin from removing themselves if they are the last admin
        if (userIdToRemove.equals(authenticatedUserId) && teamMemberRepository.countByTeamIdAndRole(teamId, TeamRole.ADMIN) == 1) {
            throw new IllegalArgumentException("Cannot remove the last admin from the team.");
        }

        TeamMember memberToRemove = teamMemberRepository.findByTeamIdAndUserId(teamId, userIdToRemove)
                .orElseThrow(() -> new IllegalArgumentException("User " + userIdToRemove + " is not a member of team " + teamId));

        teamMemberRepository.delete(memberToRemove);

        // Send notification to the removed user
        sendNotification(userIdToRemove, "You have been removed from team '" + team.getName() + "'.", "TEAM_LEFT");
        // Send notification to admin who removed
        sendNotification(authenticatedUserId, "User " + userIdToRemove + " was removed from team '" + team.getName() + "'.", "TEAM_MEMBER_REMOVED");
    }

    /**
     * Retrieves a list of all members belonging to a specific team.
     *
     * @param teamId The ID of the team whose members are to be retrieved.
     * @return A list of TeamMemberResponse DTOs.
     */
    public List<TeamMemberResponse> getTeamMembers(Long teamId) {
        List<TeamMember> members = teamMemberRepository.findByTeamId(teamId);
        return members.stream()
                .map(member -> {
                    UserAuthDetails userDetails = fetchUserDetailsFromUserService(member.getUserId());
                    String userEmail = (userDetails != null) ? userDetails.getEmail() : "Unknown User";
                    String userName = (userDetails != null) ? userDetails.getFirstName() + " " + userDetails.getLastName() : "Unknown User";
                    return convertToTeamMemberResponse(member, userEmail, userName);
                })
                .collect(Collectors.toList());
    }

    /**
     * Retrieves details of a specific team member within a team.
     *
     * @param teamId The ID of the team.
     * @param userId The ID of the user (team member) to retrieve.
     * @return An Optional containing the TeamMemberResponse DTO if found, otherwise empty.
     */
    public Optional<TeamMemberResponse> getTeamMember(Long teamId, Long userId) {
        return teamMemberRepository.findByTeamIdAndUserId(teamId, userId)
                .map(member -> {
                    UserAuthDetails userDetails = fetchUserDetailsFromUserService(member.getUserId());
                    String userEmail = (userDetails != null) ? userDetails.getEmail() : "Unknown User";
                    String userName = (userDetails != null) ? userDetails.getFirstName() + " " + userDetails.getLastName() : "Unknown User";
                    return convertToTeamMemberResponse(member, userEmail, userName);
                });
    }

    // --- Helper Methods ---

    /**
     * Converts a Team entity to a TeamResponse DTO.
     * @param team The Team entity.
     * @return The corresponding TeamResponse DTO.
     */
    private TeamResponse convertToTeamResponse(Team team) {
        return new TeamResponse(
                team.getId(),
                team.getName(),
                team.getDescription(),
                team.getOwnerUserId(),
                team.getCreatedAt(),
                team.getUpdatedAt()
        );
    }

    /**
     * Converts a TeamMember entity to a TeamMemberResponse DTO, enriching with user details.
     * @param member The TeamMember entity.
     * @param userEmail The email of the user (fetched from User Service).
     * @param userName The full name of the user (fetched from User Service).
     * @return The corresponding TeamMemberResponse DTO.
     */
    private TeamMemberResponse convertToTeamMemberResponse(TeamMember member, String userEmail, String userName) {
        return new TeamMemberResponse(
                member.getId(),
                member.getTeamId(),
                member.getUserId(),
                userEmail,
                userName,
                member.getRole(),
                member.getJoinedAt()
        );
    }

    /**
     * Checks if a given user is an ADMIN of a specific team.
     * @param teamId The ID of the team.
     * @param userId The ID of the user to check.
     * @return true if the user is an ADMIN of the team, false otherwise.
     */
    public boolean isTeamAdmin(Long teamId, Long userId) {
        return teamMemberRepository.findByTeamIdAndUserId(teamId, userId)
                .map(member -> member.getRole() == TeamRole.ADMIN)
                .orElse(false);
    }

    // --- Inter-service communication ---

    /**
     * Resolves the base URL for a given service ID using Eureka DiscoveryClient.
     * @param serviceId The Eureka service ID (e.g., "USER-SERVICE").
     * @return The base URL of the service, or null if no instances are found.
     */
    private String resolveServiceUrl(String serviceId) {
        List<ServiceInstance> instances = discoveryClient.getInstances(serviceId);
        if (instances.isEmpty()) {
            logger.error("No instances found for service: {} in Eureka.", serviceId);
            return null;
        }
        // For simplicity, take the first available instance.
        // In a production environment with @LoadBalanced WebClient, you might not need this manual resolution.
        ServiceInstance instance = instances.get(0);
        String baseUrl = instance.getUri().toString();
        logger.info("Resolved service {} to URL: {}", serviceId, baseUrl);
        return baseUrl;
    }

    /**
     * Fetches user details from the User Service by user ID.
     * @param userId The ID of the user to fetch.
     * @return The UserAuthDetails DTO, or null if the user is not found or an error occurs.
     */
    private UserAuthDetails fetchUserDetailsFromUserService(Long userId) {
        String userServiceBaseUrl = resolveServiceUrl(USER_SERVICE_ID);
        if (userServiceBaseUrl == null) {
            logger.error("User Service is not available via Eureka. Cannot fetch user details for ID: {}", userId);
            return null;
        }
        try {
            // Assumes User Service has a GET /users/{id} endpoint that returns UserAuthDetails
            return webClientBuilder.baseUrl(userServiceBaseUrl)
                    .build()
                    .get()
                    .uri(USER_FETCH_PATH + userId)
                    .retrieve()
                    // Handle 4xx/5xx errors from User Service
                    .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        clientResponse -> {
                            logger.error("Failed to fetch user details for ID {} from User Service. Status: {}", userId, clientResponse.statusCode());
                            return Mono.error(new RuntimeException("Failed to fetch user details from User Service."));
                        }
                    )
                    .bodyToMono(UserAuthDetails.class)
                    .block(); // Block to get the result synchronously
        } catch (Exception e) {
            logger.error("Error fetching user details for ID {} from User Service: {}", userId, e.getMessage());
            return null; // Return null on error so calling method can handle it
        }
    }

    /**
     * Sends a notification to a specific user via the Notification Service.
     * @param userId The ID of the user to notify.
     * @param message The content of the notification message.
     * @param type The type of notification (e.g., "TEAM_CREATED", "TEAM_JOINED").
     */
    private void sendNotification(Long userId, String message, String type) {
        try {
            String notificationServiceBaseUrl = resolveServiceUrl(NOTIFICATION_SERVICE_ID);
            if (notificationServiceBaseUrl == null) {
                System.err.println("Notification Service is not available via Eureka. Cannot send notification for user " + userId);
                return;
            }

            Map<String, Object> notificationRequest = new HashMap<>();
            notificationRequest.put("userId", userId);
            notificationRequest.put("message", message);
            notificationRequest.put("type", type);

            webClientBuilder.baseUrl(notificationServiceBaseUrl)
                    .build()
                    .post()
                    .uri(NOTIFICATION_CREATE_PATH)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(notificationRequest)
                    .retrieve()
                    .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        clientResponse -> {
                            logger.error("Notification send failed with status: {}", clientResponse.statusCode());
                            return Mono.error(new RuntimeException("Notification send failed."));
                        }
                    )
                    .bodyToMono(String.class) // Expect a String response (or void)
                    .block(); // Block to make it synchronous for this example

            System.out.println("Notification sent successfully for user " + userId + ": " + message);
        } catch (Exception e) {
            System.err.println("Error sending notification for user " + userId + ": " + e.getMessage());
            // Log the error but don't rethrow, as notification failure shouldn't block core operation
        }
    }
}