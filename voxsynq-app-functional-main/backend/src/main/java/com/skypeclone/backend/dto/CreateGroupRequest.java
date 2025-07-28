package com.skypeclone.backend.dto;

import java.util.List;

import lombok.Data;

@Data
public class CreateGroupRequest {
    private String name;
    private String imageUrl;
    private List<Long> memberIds;
} 