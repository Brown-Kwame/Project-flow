package com.skypeclone.backend.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skypeclone.backend.dto.MessageDto;
import com.skypeclone.backend.exception.ResourceNotFoundException;
import com.skypeclone.backend.model.Group;
import com.skypeclone.backend.model.Message;
import com.skypeclone.backend.model.PrivateChatReadStatus;
import com.skypeclone.backend.model.User;
import com.skypeclone.backend.repository.GroupRepository;
import com.skypeclone.backend.repository.MessageRepository;
import com.skypeclone.backend.repository.PrivateChatReadStatusRepository;
import com.skypeclone.backend.repository.UserRepository;

@Service
public class MessageService {

    @Value("${app.baseUrl:http://192.168.0.151:8080}")
    private String baseUrl;
    @Autowired
    private PrivateChatReadStatusRepository privateChatReadStatusRepository;
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupRepository groupRepository;

    public Message saveMessage(MessageDto messageDto) {
        User sender = userRepository.findById(messageDto.getSenderId())
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found with id: " + messageDto.getSenderId()));

        User recipient = userRepository.findById(messageDto.getRecipientId())
                .orElseThrow(() -> new ResourceNotFoundException("Recipient not found with id: " + messageDto.getRecipientId()));

        Message message = new Message();
        message.setSender(sender);
        message.setRecipient(recipient);
        message.setContent(messageDto.getContent());
        message.setImageUrl(messageDto.getImageUrl());
        message.setAudioUrl(messageDto.getAudioUrl());
        message.setTimestamp(Instant.now());
        message.setAudioDurationMillis(messageDto.getAudioDurationMillis());

        return messageRepository.save(message);
    }

    public List<MessageDto> getChatHistory(Long userId1, Long userId2) {
        return messageRepository.findChatHistory(userId1, userId2)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public MessageDto convertToDto(Message message) {
        MessageDto dto = new MessageDto();
        dto.setId(message.getId());
        dto.setSenderId(message.getSender().getId());
        dto.setSenderUsername(message.getSender().getUsername());
        // Always return full URL for senderProfilePictureUrl
        String senderPic = message.getSender().getProfilePictureUrl();
        if (senderPic != null && !senderPic.isEmpty() && !senderPic.startsWith("http://") && !senderPic.startsWith("https://")) {
            senderPic = baseUrl + "/uploads/" + senderPic;
        }
        dto.setSenderProfilePictureUrl(senderPic);
        if (message.getRecipient() != null) {
            dto.setRecipientId(message.getRecipient().getId());
            dto.setRecipientUsername(message.getRecipient().getUsername());
            // Always return full URL for recipientProfilePictureUrl
            String recipientPic = message.getRecipient().getProfilePictureUrl();
            if (recipientPic != null && !recipientPic.isEmpty() && !recipientPic.startsWith("http://") && !recipientPic.startsWith("https://")) {
                recipientPic = baseUrl + "/uploads/" + recipientPic;
            }
            dto.setRecipientProfilePictureUrl(recipientPic);
        } else {
            dto.setRecipientId(null);
            dto.setRecipientUsername(null);
            dto.setRecipientProfilePictureUrl(null);
        }
        if (message.getGroup() != null) {
            dto.setGroupId(message.getGroup().getId());
        } else {
            dto.setGroupId(null);
        }
        dto.setContent(message.getContent());
        dto.setImageUrl(message.getImageUrl());
        dto.setAudioUrl(message.getAudioUrl());
        dto.setTimestamp(message.getTimestamp());
        dto.setAudioDurationMillis(message.getAudioDurationMillis());
        return dto;
    }

    // ... inside the MessageService class

    public List<MessageDto> getConversations(Long userId) {
        return messageRepository.findLatestMessageForEachConversation(userId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<MessageDto> getGroupMessages(Long groupId) {
        List<Message> messages = messageRepository.findByGroupIdOrderByTimestampDesc(groupId);
        List<MessageDto> dtos = new ArrayList<>();
        for (Message m : messages) {
            dtos.add(convertToDto(m));
        }
        return dtos;
    }

    public MessageDto saveGroupMessage(Long groupId, MessageDto messageDto) {
        User sender = userRepository.findById(messageDto.getSenderId())
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found with id: " + messageDto.getSenderId()));
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + groupId));
        Message message = new Message();
        message.setSender(sender);
        message.setGroup(group);
        message.setContent(messageDto.getContent());
        message.setImageUrl(messageDto.getImageUrl());
        message.setAudioUrl(messageDto.getAudioUrl());
        message.setTimestamp(java.time.Instant.now());
        message.setAudioDurationMillis(messageDto.getAudioDurationMillis());
        Message saved = messageRepository.save(message);
        return convertToDto(saved);
    }

    @Transactional
    public void updateLastReadTimestampPrivate(User user, User otherUser, Long timestamp) {
        PrivateChatReadStatus status = privateChatReadStatusRepository.findByUserAndOtherUser(user, otherUser)
                .orElseGet(() -> {
                    PrivateChatReadStatus s = new PrivateChatReadStatus();
                    s.setUser(user);
                    s.setOtherUser(otherUser);
                    s.setLastReadTimestamp(0L);
                    return s;
                });
        status.setLastReadTimestamp(timestamp);
        privateChatReadStatusRepository.save(status);
    }

    public long getUnreadCountPrivate(User user, User otherUser) {
        PrivateChatReadStatus status = privateChatReadStatusRepository.findByUserAndOtherUser(user, otherUser).orElse(null);
        Instant lastRead = status != null ? Instant.ofEpochMilli(status.getLastReadTimestamp()) : Instant.EPOCH;
        return messageRepository.countByUsersAndTimestampGreaterThan(user, otherUser, lastRead, user);
    }

    public PrivateChatReadStatus getPrivateChatReadStatus(User user, User otherUser) {
        return privateChatReadStatusRepository.findByUserAndOtherUser(user, otherUser).orElse(null);
    }
}