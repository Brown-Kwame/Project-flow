package com.skypeclone.backend.dto;

import java.time.Instant;

import com.skypeclone.backend.model.User;

import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String profilePictureUrl;
    private Instant createdAt;
    private Boolean isAdmin;

    public UserDto(User user, String baseUrl) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.fullName = user.getFullName();
        String pic = user.getProfilePictureUrl();
        if (pic != null && !pic.isEmpty() && !pic.startsWith("http://") && !pic.startsWith("https://")) {
            pic = baseUrl + "/uploads/" + pic;
        }
        this.profilePictureUrl = pic;
        this.createdAt = user.getCreatedAt();
        this.isAdmin = false;
    }

    public boolean isAdmin() {
        return isAdmin;
    }
    public void setIsAdmin(boolean isAdmin) {
        this.isAdmin = isAdmin;
    }
}