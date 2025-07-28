package com.example.asana.dto;

import com.example.asana.model.TeamRole;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TeamMemberResponse {
    private Long id;
    private Long teamId;
    private Long userId;
    private String username;
    private TeamRole role;
    private LocalDateTime joinedAt;
    private LocalDateTime updatedAt;

    public TeamMemberResponse(Long id, Long teamId, Long userId, String username, TeamRole role, LocalDateTime joinedAt, LocalDateTime updatedAt) {
        this.id = id;
        this.teamId = teamId;
        this.userId = userId;
        this.username = username;
        this.role = role;
        this.joinedAt = joinedAt;
        this.updatedAt = updatedAt;
    }
} 