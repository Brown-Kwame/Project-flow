package com.skypeclone.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skypeclone.backend.model.Call;
import com.skypeclone.backend.model.User;

public interface CallRepository extends JpaRepository<Call, Long> {
    List<Call> findByCaller(User caller);
    List<Call> findByCallee(User callee);
    List<Call> findByCallerOrCallee(User caller, User callee);
} 