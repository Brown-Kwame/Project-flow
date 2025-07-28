package com.example.asana.service;

import com.example.asana.exception.ResourceNotFoundException;
import com.example.asana.model.Notification;
import com.example.asana.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    @Transactional
    public Notification createNotification(Long userId, String message, String type, Long targetId, String targetType) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setMessage(message);
        notification.setType(type);
        notification.setTargetId(targetId);
        notification.setTargetType(targetType);
        notification.setIsRead(false);
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    public List<Notification> getUnreadNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public Optional<Notification> markNotificationAsRead(Long notificationId) {
        return notificationRepository.findById(notificationId).map(notification -> {
            notification.setIsRead(true);
            return notificationRepository.save(notification);
        });
    }

    @Transactional
    public void markAllNotificationsAsRead(Long userId) {
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndIsReadFalse(userId);
        for (Notification notification : unreadNotifications) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        }
    }

    @Transactional
    public boolean deleteNotification(Long notificationId) {
        if (notificationRepository.existsById(notificationId)) {
            notificationRepository.deleteById(notificationId);
            return true;
        }
        return false;
    }
} 