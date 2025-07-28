package com.example.asana.controller;

import com.example.asana.dto.CreateNotificationRequest;
import com.example.asana.model.Notification;
import com.example.asana.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Notification>> getAllNotifications() {
        try {
            List<Notification> notifications = notificationService.getAllNotifications();
            return new ResponseEntity<>(notifications, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Notification> createNotification(@RequestBody CreateNotificationRequest request) {
        Notification newNotification = notificationService.createNotification(
                request.getUserId(),
                request.getMessage(),
                request.getType(),
                request.getTargetId(),
                request.getTargetType()
        );
        return new ResponseEntity<>(newNotification, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Notification>> getNotificationsForUser(@PathVariable Long userId) {
        List<Notification> notifications = notificationService.getNotificationsByUserId(userId);
        return new ResponseEntity<>(notifications, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}/unread")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Notification>> getUnreadNotificationsForUser(@PathVariable Long userId) {
        List<Notification> notifications = notificationService.getUnreadNotificationsByUserId(userId);
        return new ResponseEntity<>(notifications, HttpStatus.OK);
    }

    @PutMapping("/{notificationId}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Notification> markNotificationAsRead(@PathVariable Long notificationId) {
        Optional<Notification> updatedNotification = notificationService.markNotificationAsRead(notificationId);
        return updatedNotification.map(notification -> new ResponseEntity<>(notification, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/user/{userId}/read-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> markAllNotificationsAsRead(@PathVariable Long userId) {
        notificationService.markAllNotificationsAsRead(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/{notificationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long notificationId) {
        boolean deleted = notificationService.deleteNotification(notificationId);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
} 