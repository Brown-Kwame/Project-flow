package com.example.team.dto;

import com.example.team.TeamRole;
// import lombok.AllArgsConstructor; // REMOVE
// import lombok.Data; // REMOVE
// import lombok.NoArgsConstructor; // REMOVE

import java.time.LocalDateTime;

public class TeamMemberResponse {
    private Long id;
    private Long teamId;
    private Long userId;
    private String userEmail;
    private String userName;
    private TeamRole role;
    private LocalDateTime joinedAt;

    public TeamMemberResponse() {
    }

    public TeamMemberResponse(Long id, Long teamId, Long userId, String userEmail, String userName, TeamRole role, LocalDateTime joinedAt) {
        this.id = id;
        this.teamId = teamId;
        this.userId = userId;
        this.userEmail = userEmail;
        this.userName = userName;
        this.role = role;
        this.joinedAt = joinedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public TeamRole getRole() {
        return role;
    }

    public void setRole(TeamRole role) {
        this.role = role;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
}
