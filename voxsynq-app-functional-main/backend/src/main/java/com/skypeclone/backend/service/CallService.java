package com.skypeclone.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skypeclone.backend.model.Call;
import com.skypeclone.backend.model.CallStatus;
import com.skypeclone.backend.model.CallType;
import com.skypeclone.backend.model.User;
import com.skypeclone.backend.repository.CallRepository;
import com.skypeclone.backend.repository.UserRepository;

@Service
public class CallService {
    @Autowired
    private CallRepository callRepository;
    @Autowired
    private UserRepository userRepository;

    public Call startCall(Long callerId, Long calleeId, CallType type) {
        Optional<User> callerOpt = userRepository.findById(callerId);
        Optional<User> calleeOpt = userRepository.findById(calleeId);
        if (callerOpt.isEmpty() || calleeOpt.isEmpty()) {
            throw new IllegalArgumentException("Caller or callee not found");
        }
        Call call = new Call();
        call.setCaller(callerOpt.get());
        call.setCallee(calleeOpt.get());
        call.setStartTime(LocalDateTime.now());
        call.setStatus(CallStatus.ONGOING);
        call.setType(type);
        return callRepository.save(call);
    }

    public Call endCall(Long callId, CallStatus status) {
        Optional<Call> callOpt = callRepository.findById(callId);
        if (callOpt.isEmpty()) {
            throw new IllegalArgumentException("Call not found");
        }
        Call call = callOpt.get();
        call.setEndTime(LocalDateTime.now());
        call.setStatus(status);
        return callRepository.save(call);
    }

    public List<Call> getCallHistoryForUser(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }
        User user = userOpt.get();
        return callRepository.findByCallerOrCallee(user, user);
    }
} 