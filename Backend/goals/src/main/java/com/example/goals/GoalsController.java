
package com.example.goals;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/goals") // Base URL for goal-related endpoints
public class GoalsController {

    @Autowired
    private GoalsService goalService;

    // DTO for creating/updating a goal (request body)
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GoalRequest {
        private String name;
        private String description;
        private GoalsStatus status;
        private Long ownerUserId; // Required for creation
        private Long workspaceId; // Required for creation
        private LocalDate startDate;
        private LocalDate dueDate;
        private Double targetValue;
        private Double currentValue;
        private String unit;
    }

    // Endpoint to create a new goal
    @PostMapping("/")
    public ResponseEntity<Goals> createGoal(@RequestBody GoalRequest request) {
        // Basic validation: ensure required fields are not null for creation
        if (request.getName() == null || request.getOwnerUserId() == null || request.getWorkspaceId() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Or more detailed error message
        }

        // Optional: Check for duplicate goal name within the workspace
        if (goalService.goalExistsInWorkspace(request.getName(), request.getWorkspaceId())) {
            return new ResponseEntity<>(HttpStatus.CONFLICT); // 409 Conflict
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
        return new ResponseEntity<>(newGoal, HttpStatus.CREATED); // Return 201 Created status
    }

    // Endpoint to get a goal by ID
    @GetMapping("/{id}")
    public ResponseEntity<Goals> getGoalById(@PathVariable Long id) {
        Optional<Goals> goal = goalService.getGoalById(id);
        return goal.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Endpoint to update an existing goal
    @PutMapping("/{id}")
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

    // Endpoint to delete a goal
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        boolean deleted = goalService.deleteGoal(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint to get all goals for a specific workspace
    @GetMapping("/workspace/{workspaceId}")
    public ResponseEntity<List<Goals>> getGoalsByWorkspaceId(@PathVariable Long workspaceId) {
        List<Goals> goals = goalService.getGoalsByWorkspaceId(workspaceId);
        return new ResponseEntity<>(goals, HttpStatus.OK);
    }

    // Endpoint to get all goals owned by a specific user
    @GetMapping("/owner/{ownerUserId}")
    public ResponseEntity<List<Goals>> getGoalsByOwnerUserId(@PathVariable Long ownerUserId) {
        List<Goals> goals = goalService.getGoalsByOwnerUserId(ownerUserId);
        return new ResponseEntity<>(goals, HttpStatus.OK);
    }

    // Endpoint to get goals by status
    @GetMapping("/status/{statusString}")
    public ResponseEntity<List<Goals>> getGoalsByStatus(@PathVariable String statusString) {
        try {
            GoalsStatus status = GoalsStatus.valueOf(statusString.toUpperCase());
            List<Goals> goals = goalService.getGoalsByStatus(status);
            return new ResponseEntity<>(goals, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Invalid status string
        }
    }
}
