package com.skypeclone.backend.dto;

public class CallSignalMessage {
    private String type; // CALL_OFFER, CALL_ANSWER, CALL_ICE, CALL_END, CALL_REJECT
    private Long fromUserId;
    private Long toUserId;
    private String sdp; // For offer/answer
    private String iceCandidate; // For ICE
    private Long callId;
    private String fromUserName;

    // Getters and setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Long getFromUserId() { return fromUserId; }
    public void setFromUserId(Long fromUserId) { this.fromUserId = fromUserId; }
    public Long getToUserId() { return toUserId; }
    public void setToUserId(Long toUserId) { this.toUserId = toUserId; }
    public String getSdp() { return sdp; }
    public void setSdp(String sdp) { this.sdp = sdp; }
    public String getIceCandidate() { return iceCandidate; }
    public void setIceCandidate(String iceCandidate) { this.iceCandidate = iceCandidate; }
    public Long getCallId() { return callId; }
    public void setCallId(Long callId) { this.callId = callId; }
    public String getFromUserName() { return fromUserName; }
    public void setFromUserName(String fromUserName) { this.fromUserName = fromUserName; }
} 