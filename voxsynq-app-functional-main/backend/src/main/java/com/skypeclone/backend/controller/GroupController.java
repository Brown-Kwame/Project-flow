package com.skypeclone.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.skypeclone.backend.dto.CreateGroupRequest;
import com.skypeclone.backend.dto.GroupDto;
import com.skypeclone.backend.model.Group;
import com.skypeclone.backend.model.User;
import com.skypeclone.backend.repository.GroupMemberRepository;
import com.skypeclone.backend.repository.GroupRepository;
import com.skypeclone.backend.repository.UserRepository;
import com.skypeclone.backend.security.services.UserDetailsImpl;
import com.skypeclone.backend.service.GroupService;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "*", maxAge = 3600)
public class GroupController {
    @Autowired
    private GroupService groupService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private GroupMemberRepository groupMemberRepository;
    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<GroupDto> createGroup(@RequestBody CreateGroupRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long creatorId = userDetails.getId();
        GroupDto groupDto = groupService.createGroup(request, creatorId);
        return ResponseEntity.ok(groupDto);
    }

    @GetMapping("")
    public ResponseEntity<?> getMyGroups() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getId();
        return ResponseEntity.ok(groupService.getGroupsForUser(userId));
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<GroupDto> getGroupDetails(@PathVariable Long groupId) {
        return ResponseEntity.ok(groupService.getGroupDetails(groupId));
    }

    @PostMapping("/{groupId}/add-member/{userId}")
    public ResponseEntity<?> addMember(@PathVariable Long groupId, @PathVariable Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long requesterId = userDetails.getId();
        groupService.addMember(groupId, userId, requesterId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{groupId}/remove-member/{userId}")
    public ResponseEntity<?> removeMember(@PathVariable Long groupId, @PathVariable Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long requesterId = userDetails.getId();
        groupService.removeMember(groupId, userId, requesterId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{groupId}")
    public ResponseEntity<GroupDto> updateGroup(@PathVariable Long groupId, @RequestBody GroupDto groupDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getId();
        GroupDto updated = groupService.updateGroup(groupId, groupDto.getName(), groupDto.getImageUrl(), userId);

        // Broadcast updated group info to all group members
        List<com.skypeclone.backend.model.GroupMember> members = groupMemberRepository.findAllByGroupId(groupId);
        for (com.skypeclone.backend.model.GroupMember member : members) {
            User user = member.getUser();
            String destination = "/topic/group." + user.getUsername();
            messagingTemplate.convertAndSend(destination, updated);
        }

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{groupId}")
    public ResponseEntity<?> deleteGroup(@PathVariable Long groupId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getId();
        groupService.deleteGroup(groupId, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{groupId}/members")
    public ResponseEntity<?> getGroupMembers(@PathVariable Long groupId) {
        return ResponseEntity.ok(groupService.getGroupMembers(groupId));
    }

    @PutMapping("/{groupId}/read")
    public ResponseEntity<?> updateLastRead(@PathVariable Long groupId, @RequestParam Long timestamp, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        Group group = groupRepository.findById(groupId).orElseThrow();
        groupService.updateLastReadTimestamp(user, group, timestamp);
        // Broadcast new read statuses to all group members
        java.util.Map<Long, Long> readStatuses = groupService.getGroupReadStatuses(groupId);
        java.util.List<com.skypeclone.backend.model.GroupMember> members = groupMemberRepository.findAllByGroupId(groupId);
        for (com.skypeclone.backend.model.GroupMember member : members) {
            User memberUser = member.getUser();
            String destination = "/topic/read-status.group." + groupId + ".user." + memberUser.getId();
            messagingTemplate.convertAndSend(destination, readStatuses);
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{groupId}/unread-count")
    public ResponseEntity<Long> getUnreadCount(@PathVariable Long groupId, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        Group group = groupRepository.findById(groupId).orElseThrow();
        long count = groupService.getUnreadCount(user, group);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/{groupId}/read-status")
    public ResponseEntity<java.util.Map<Long, Long>> getGroupReadStatuses(@PathVariable Long groupId) {
        return ResponseEntity.ok(groupService.getGroupReadStatuses(groupId));
    }
} 