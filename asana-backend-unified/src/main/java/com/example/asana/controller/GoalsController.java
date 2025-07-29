package com.example.asana.controller;

import com.example.asana.dto.GoalRequest;
import com.example.asana.model.Goals;
import com.example.asana.model.GoalsStatus;
import com.example.asana.service.GoalsService;
import com.example.asana.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import com.example.asana.exception.ResourceNotFoundException;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "*")
public class GoalsController {

    @Autowired
    private GoalsService goalService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Goals>> getAllGoals() {
        try {
            // Get the authenticated user ID from security context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() instanceof UserDetailsImpl) {
                Long authenticatedUserId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
                List<Goals> goals = goalService.getGoalsByOwnerUserId(authenticatedUserId);
                return new ResponseEntity<>(goals, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Goals> createGoal(@RequestBody GoalRequest request) {
        if (request.getName() == null || request.getOwnerUserId() == null || request.getWorkspaceId() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (goalService.goalExistsInWorkspace(request.getName(), request.getWorkspaceId())) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        Goals newGoal = goalService.createGoal(
                request.getName(),
                request.getDescription(),
                request.getStatus(),
                request.getOwnerUserId(),
                request.getWorkspaceId(),
                request.getStartDate(),
                request.getDueDate(),
                request.getTargetValue(),
                request.getCurrentValue(),
                request.getUnit()
        );
        return new ResponseEntity<>(newGoal, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Goals> getGoalById(@PathVariable Long id) {
        try {
            Optional<Goals> goal = goalService.getGoalById(id);
            return goal.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                    .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Goals> updateGoal(@PathVariable Long id, @RequestBody GoalRequest request) {
        Optional<Goals> updatedGoal = goalService.updateGoal(
                id,
                request.getName(),
                request.getDescription(),
                request.getStatus(),
                request.getStartDate(),
                request.getDueDate(),
                request.getTargetValue(),
                request.getCurrentValue(),
                request.getUnit()
        );
        return updatedGoal.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}/progress")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Goals> updateGoalProgress(@PathVariable Long id) {
        try {
            Goals updatedGoal = goalService.updateGoalProgress(id);
            return new ResponseEntity<>(updatedGoal, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}/progress-data")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<GoalsService.GoalProgressData>> getGoalProgressData(@PathVariable Long id) {
        try {
            List<GoalsService.GoalProgressData> progressData = goalService.getGoalProgressData(id);
            return new ResponseEntity<>(progressData, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception for debugging
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        boolean deleted = goalService.deleteGoal(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/workspace/{workspaceId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Goals>> getGoalsByWorkspaceId(@PathVariable Long workspaceId) {
        List<Goals> goals = goalService.getGoalsByWorkspaceId(workspaceId);
        return new ResponseEntity<>(goals, HttpStatus.OK);
    }

    @GetMapping("/owner/{ownerUserId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Goals>> getGoalsByOwnerUserId(@PathVariable Long ownerUserId) {
        List<Goals> goals = goalService.getGoalsByOwnerUserId(ownerUserId);
        return new ResponseEntity<>(goals, HttpStatus.OK);
    }

    @GetMapping("/status/{statusString}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Goals>> getGoalsByStatus(@PathVariable String statusString) {
        try {
            GoalsStatus status = GoalsStatus.valueOf(statusString.toUpperCase());
            List<Goals> goals = goalService.getGoalsByStatus(status);
            return new ResponseEntity<>(goals, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
} 