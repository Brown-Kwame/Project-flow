// Package declaration
package com.example.notification;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "message", nullable = false, length = 500)
    private String message;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "read_status", nullable = false)
    private boolean readStatus;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "target_id")
    private Long targetId;

    @Column(name = "target_type")
    private String targetType;
}