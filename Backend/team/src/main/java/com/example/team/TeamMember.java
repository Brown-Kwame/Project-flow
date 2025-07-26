package com.example.team;

import jakarta.persistence.*;
// import lombok.AllArgsConstructor; // REMOVE
// import lombok.Data; // REMOVE
// import lombok.NoArgsConstructor; // REMOVE

import java.time.LocalDateTime;
import java.util.Objects; // For equals/hashCode

@Entity
@Table(name = "team_members")
// @Data // REMOVE
// @NoArgsConstructor // REMOVE
// @AllArgsConstructor // REMOVE
public class TeamMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long teamId;

    @Column(nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TeamRole role;

    @Column(nullable = false, updatable = false)
    private LocalDateTime joinedAt;

    // No-argument constructor
    public TeamMember() {
    }

    // All-argument constructor (excluding generated fields like id, joinedAt)
    public TeamMember(Long teamId, Long userId, TeamRole role) {
        this.teamId = teamId;
        this.userId = userId;
        this.role = role;
    }

    // All-argument constructor (including all fields for response/persistence)
    public TeamMember(Long id, Long teamId, Long userId, TeamRole role, LocalDateTime joinedAt) {
        this.id = id;
        this.teamId = teamId;
        this.userId = userId;
        this.role = role;
        this.joinedAt = joinedAt;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public Long getTeamId() {
        return teamId;
    }

    public Long getUserId() {
        return userId;
    }

    public TeamRole getRole() {
        return role;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setRole(TeamRole role) {
        this.role = role;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.joinedAt = LocalDateTime.now();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TeamMember that = (TeamMember) o;
        return Objects.equals(id, that.id); // Equality based on ID
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "TeamMember{" +
               "id=" + id +
               ", teamId=" + teamId +
               ", userId=" + userId +
               ", role=" + role +
               ", joinedAt=" + joinedAt +
               '}';
    }
}