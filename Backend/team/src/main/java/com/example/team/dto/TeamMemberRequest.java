package com.example.team.dto;
import com.example.team.TeamRole;
// import lombok.AllArgsConstructor; // REMOVE
// import lombok.Data; // REMOVE
// import lombok.NoArgsConstructor; // REMOVE

public class TeamMemberRequest {
    private Long userId;
    private TeamRole role;

    public TeamMemberRequest() {
    }

    public TeamMemberRequest(Long userId, TeamRole role) {
        this.userId = userId;
        this.role = role;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public TeamRole getRole() {
        return role;
    }

    public void setRole(TeamRole role) {
        this.role = role;
    }
}
