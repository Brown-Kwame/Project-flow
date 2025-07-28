package com.example.asana.dto;

import com.example.asana.model.TeamRole;
import lombok.Data;

@Data
public class TeamMemberRequest {
    private Long userId;
    private TeamRole role;
} 