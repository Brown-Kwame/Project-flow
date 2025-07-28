package com.skypeclone.backend.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skypeclone.backend.dto.CreateGroupRequest;
import com.skypeclone.backend.dto.GroupDto;
import com.skypeclone.backend.dto.UserDto;
import com.skypeclone.backend.model.Group;
import com.skypeclone.backend.model.GroupMember;
import com.skypeclone.backend.model.GroupReadStatus;
import com.skypeclone.backend.model.User;
import com.skypeclone.backend.repository.GroupMemberRepository;
import com.skypeclone.backend.repository.GroupReadStatusRepository;
import com.skypeclone.backend.repository.GroupRepository;
import com.skypeclone.backend.repository.MessageRepository;
import com.skypeclone.backend.repository.UserRepository;

@Service
public class GroupService {
    @Value("${app.baseUrl:http://192.168.0.151:8080}")
    private String baseUrl;
    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private GroupMemberRepository groupMemberRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private GroupReadStatusRepository groupReadStatusRepository;

    @Autowired
    private MessageRepository messageRepository;

    public GroupDto createGroup(CreateGroupRequest request, Long creatorId) {
        Group group = new Group();
        group.setName(request.getName());
        group.setImageUrl(request.getImageUrl());
        User creator = userRepository.findById(creatorId).orElseThrow();
        group.setCreatedBy(creator);
        group = groupRepository.save(group);

        // Use a Set to ensure unique user IDs, always include creator
        Set<Long> uniqueMemberIds = new java.util.HashSet<>(request.getMemberIds());
        uniqueMemberIds.add(creatorId);
        List<Long> memberIds = new ArrayList<>();
        List<UserDto> members = new ArrayList<>();
        for (Long userId : uniqueMemberIds) {
            User user = userRepository.findById(userId).orElseThrow();
            GroupMember member = new GroupMember();
            member.setGroup(group);
            member.setUser(user);
            groupMemberRepository.save(member);
            memberIds.add(userId);
            UserDto userDto = new UserDto(user, baseUrl);
            members.add(userDto);
        }
        GroupDto dto = new GroupDto();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setImageUrl(group.getImageUrl());
        dto.setCreatedById(creatorId);
        dto.setCreatedAt(group.getCreatedAt());
        dto.setMembers(members);
        return dto;
    }

    public List<GroupDto> getGroupsForUser(Long userId) {
        List<GroupMember> memberships = groupMemberRepository.findAll();
        List<GroupDto> groups = new ArrayList<>();
        for (GroupMember member : memberships) {
            if (member.getUser().getId().equals(userId)) {
                Group group = member.getGroup();
                GroupDto dto = new GroupDto();
                dto.setId(group.getId());
                dto.setName(group.getName());
                dto.setImageUrl(group.getImageUrl());
                dto.setCreatedById(group.getCreatedBy().getId());
                dto.setCreatedAt(group.getCreatedAt());
                List<GroupMember> groupMembers = groupMemberRepository.findAllByGroupId(group.getId());
                List<UserDto> members = new ArrayList<>();
                for (GroupMember m : groupMembers) {
                    User user = m.getUser();
                    UserDto userDto = new UserDto(user, baseUrl);
                    members.add(userDto);
                }
                dto.setMembers(members);
                groups.add(dto);
            }
        }
        return groups;
    }

    public GroupDto getGroupDetails(Long groupId) {
        Group group = groupRepository.findById(groupId).orElseThrow();
        GroupDto dto = new GroupDto();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setImageUrl(group.getImageUrl());
        dto.setCreatedById(group.getCreatedBy().getId());
        dto.setCreatedAt(group.getCreatedAt());
        List<GroupMember> members = groupMemberRepository.findAllByGroupId(groupId);
        List<UserDto> memberDtos = new ArrayList<>();
        for (GroupMember m : members) {
            User user = m.getUser();
            UserDto userDto = new UserDto(user, baseUrl);
            memberDtos.add(userDto);
        }
        dto.setMembers(memberDtos);
        return dto;
    }

    public GroupDto updateGroup(Long groupId, String name, String imageUrl, Long userId) {
        if (!isAdmin(groupId, userId)) {
            throw new RuntimeException("Only the group admin can update group info.");
        }
        Group group = groupRepository.findById(groupId).orElseThrow();
        if (name != null && !name.isBlank()) {
            group.setName(name);
        }
        if (imageUrl != null && !imageUrl.isBlank()) {
            group.setImageUrl(imageUrl);
        }
        group = groupRepository.save(group);
        return getGroupDetails(groupId);
    }

    public void deleteGroup(Long groupId, Long userId) {
        if (!isAdmin(groupId, userId)) {
            throw new RuntimeException("Only the group admin can delete the group.");
        }
        groupMemberRepository.deleteAllByGroupId(groupId);
        groupRepository.deleteById(groupId);
    }

    public void addMember(Long groupId, Long userId, Long requesterId) {
        if (!isAdmin(groupId, requesterId)) {
            throw new RuntimeException("Only the group admin can add members.");
        }
        Group group = groupRepository.findById(groupId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();
        // Use repository to check membership
        List<GroupMember> groupMembers = groupMemberRepository.findAllByGroupId(groupId);
        for (GroupMember m : groupMembers) {
            if (m.getUser().getId().equals(userId)) return;
        }
        GroupMember member = new GroupMember();
        member.setGroup(group);
        member.setUser(user);
        groupMemberRepository.save(member);
    }

    public void removeMember(Long groupId, Long userId, Long requesterId) {
        if (!isAdmin(groupId, requesterId)) {
            throw new RuntimeException("Only the group admin can remove members.");
        }
        groupMemberRepository.deleteByGroupIdAndUserId(groupId, userId);
    }

    public List<com.skypeclone.backend.dto.UserDto> getGroupMembers(Long groupId) {
        Group group = groupRepository.findById(groupId).orElseThrow();
        Long adminId = group.getCreatedBy().getId();
        List<com.skypeclone.backend.dto.UserDto> members = new ArrayList<>();
        List<GroupMember> groupMembers = groupMemberRepository.findAllByGroupId(groupId);
        for (GroupMember m : groupMembers) {
            User user = m.getUser();
            com.skypeclone.backend.dto.UserDto dto = new com.skypeclone.backend.dto.UserDto(user, baseUrl);
            dto.setIsAdmin(user.getId().equals(adminId));
            members.add(dto);
        }
        return members;
    }

    @Transactional
    public void updateLastReadTimestamp(User user, Group group, Long timestamp) {
        GroupReadStatus status = groupReadStatusRepository.findByUserAndGroup(user, group)
                .orElseGet(() -> {
                    GroupReadStatus s = new GroupReadStatus();
                    s.setUser(user);
                    s.setGroup(group);
                    s.setLastReadTimestamp(0L);
                    return s;
                });
        // Only update if the new timestamp is greater
        if (timestamp > status.getLastReadTimestamp()) {
            status.setLastReadTimestamp(timestamp);
            groupReadStatusRepository.save(status);
        }
    }

    public long getUnreadCount(User user, Group group) {
        GroupReadStatus status = groupReadStatusRepository.findByUserAndGroup(user, group).orElse(null);
        Instant lastRead = status != null ? Instant.ofEpochMilli(status.getLastReadTimestamp()) : Instant.EPOCH;
        return messageRepository.countByGroupAndTimestampGreaterThan(group, lastRead, user);
    }

    public java.util.Map<Long, Long> getGroupReadStatuses(Long groupId) {
        Group group = groupRepository.findById(groupId).orElseThrow();
        java.util.List<GroupReadStatus> statuses = groupReadStatusRepository.findAllByGroup(group);
        java.util.Map<Long, Long> result = new java.util.HashMap<>();
        for (GroupReadStatus status : statuses) {
            result.put(status.getUser().getId(), status.getLastReadTimestamp());
        }
        return result;
    }

    private boolean isAdmin(Long groupId, Long userId) {
        Group group = groupRepository.findById(groupId).orElseThrow();
        return group.getCreatedBy().getId().equals(userId);
    }
} 