package com.skypeclone.backend.dto;

import java.time.Instant;
import java.util.List;

import lombok.Data;

@Data
public class GroupDto {
    private Long id;
    private String name;
    private String imageUrl;
    private Long createdById;
    private Instant createdAt;
    private List<UserDto> members;
} 