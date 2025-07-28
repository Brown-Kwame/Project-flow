package com.skypeclone.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Call {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "caller_id", nullable = false)
    private User caller;

    @ManyToOne
    @JoinColumn(name = "callee_id", nullable = false)
    private User callee;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    private CallStatus status;

    @Enumerated(EnumType.STRING)
    private CallType type;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getCaller() { return caller; }
    public void setCaller(User caller) { this.caller = caller; }
    public User getCallee() { return callee; }
    public void setCallee(User callee) { this.callee = callee; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    public CallStatus getStatus() { return status; }
    public void setStatus(CallStatus status) { this.status = status; }
    public CallType getType() { return type; }
    public void setType(CallType type) { this.type = type; }
} 