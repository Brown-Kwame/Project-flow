package com.skypeclone.backend.model;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "messages")
@Data
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The user who sent the message
    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    // The user who should receive the message
    @ManyToOne
    @JoinColumn(name = "recipient_id", nullable = true)
    private User recipient;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = true)
    private Group group;

    @Column(columnDefinition = "TEXT", nullable = true)
    private String content;

    @Column(name = "image_url", columnDefinition = "TEXT", nullable = true)
    private String imageUrl;

    @Column(name = "audio_url", columnDefinition = "TEXT", nullable = true)
    private String audioUrl;

    @Column(name = "audio_duration_millis", nullable = true)
    private Long audioDurationMillis;

    @Column(nullable = false)
    private Instant timestamp;

    // You could add a 'status' field later (e.g., SENT, DELIVERED, READ)
}