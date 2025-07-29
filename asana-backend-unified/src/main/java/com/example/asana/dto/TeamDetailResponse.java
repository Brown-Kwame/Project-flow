package com.example.asana.dto;

import com.example.asana.model.Project;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamDetailResponse {
    private Long id;
    private String name;
    private String description;
    private Long ownerUserId;
    private String ownerUsername;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<TeamMemberResponse> members;
    private List<Project> projects;
    private int totalMembers;
    private int totalProjects;
} 