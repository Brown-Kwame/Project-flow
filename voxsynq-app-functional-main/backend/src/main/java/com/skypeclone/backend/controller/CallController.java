package com.skypeclone.backend.controller;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.skypeclone.backend.dto.UserDto;
import com.skypeclone.backend.model.Call;
import com.skypeclone.backend.model.CallStatus;
import com.skypeclone.backend.model.CallType;
import com.skypeclone.backend.service.CallService;

@RestController
@RequestMapping("/api/calls")
public class CallController {
    @Autowired
    private CallService callService;

    @Value("${app.baseUrl:http://192.168.0.151:8080}")
    private String baseUrl;

    @PostMapping("/start")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Call> startCall(@RequestBody Map<String, Object> payload, Principal principal) {
        Long callerId = Long.valueOf(payload.get("callerId").toString());
        Long calleeId = Long.valueOf(payload.get("calleeId").toString());
        CallType type = CallType.valueOf(payload.get("type").toString());
        Call call = callService.startCall(callerId, calleeId, type);
        return ResponseEntity.ok(call);
    }

    @PostMapping("/end")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Call> endCall(@RequestBody Map<String, Object> payload) {
        Long callId = Long.valueOf(payload.get("callId").toString());
        CallStatus status = CallStatus.valueOf(payload.get("status").toString());
        Call call = callService.endCall(callId, status);
        return ResponseEntity.ok(call);
    }

    @GetMapping("/history")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CallDto>> getCallHistory(Principal principal, @RequestParam Long userId) {
        List<Call> calls = callService.getCallHistoryForUser(userId);
        List<CallDto> dtos = new java.util.ArrayList<>();
        for (Call call : calls) {
            dtos.add(new CallDto(call, baseUrl));
        }
        return ResponseEntity.ok(dtos);
    }
}

class CallDto {
    public Long id;
    public UserDto caller;
    public UserDto callee;
    public String status;
    public String type;
    public String startTime;
    public String endTime;
    public CallDto(Call call, String baseUrl) {
        this.id = call.getId();
        this.caller = new UserDto(call.getCaller(), baseUrl);
        this.callee = new UserDto(call.getCallee(), baseUrl);
        this.status = call.getStatus() != null ? call.getStatus().name() : null;
        this.type = call.getType() != null ? call.getType().name() : null;
        this.startTime = call.getStartTime() != null ? call.getStartTime().toString() : null;
        this.endTime = call.getEndTime() != null ? call.getEndTime().toString() : null;
    }
} 