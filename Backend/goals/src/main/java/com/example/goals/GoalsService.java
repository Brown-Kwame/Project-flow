package com.example.goals;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class GoalsService {

    @Autowired
    private GoalsRepository goalRepository;

    // Create a new goal
    public Goals createGoal(String name, String description, GoalsStatus status,
                           Long ownerUserId, Long workspaceId, LocalDate startDate, LocalDate dueDate,
                           Double targetValue, Double currentValue, String unit) {
        Goals goal = new Goals();
        goal.setName(name);
        goal.setDescription(description);
        goal.setStatus(status != null ? status : GoalsStatus.NOT_STARTED);
        goal.setOwnerUserId(ownerUserId);
        goal.setWorkspaceId(workspaceId);
        goal.setStartDate(startDate);
        goal.setDueDate(dueDate);
        goal.setTargetValue(targetValue);
        goal.setCurrentValue(currentValue != null ? currentValue : 0.0); // Default to 0.0 if null
        goal.setUnit(unit);
        return goalRepository.save(goal);
    }

    // Get a goal by ID
    public Optional<Goals> getGoalById(Long id) {
        return goalRepository.findById(id);
    }

    // Update an existing goal
    public Optional<Goals> updateGoal(Long id, String name, String description, GoalsStatus status,
                                    LocalDate startDate, LocalDate dueDate,
                                    Double targetValue, Double currentValue, String unit) {
        return goalRepository.findById(id).map(goal -> {
            if (name != null) goal.setName(name);
            if (description != null) goal.setDescription(description);
            if (status != null) goal.setStatus(status);
            if (startDate != null) goal.setStartDate(startDate);
            if (dueDate != null) goal.setDueDate(dueDate);
            if (targetValue != null) goal.setTargetValue(targetValue);
            if (currentValue != null) goal.setCurrentValue(currentValue);
            if (unit != null) goal.setUnit(unit);
            // ownerUserId and workspaceId are typically not updated directly via this method
            return goalRepository.save(goal);
        });
    }

    // Delete a goal
    public boolean deleteGoal(Long id) {
        if (goalRepository.existsById(id)) {
            goalRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Get all goals for a specific workspace
    public List<Goals> getGoalsByWorkspaceId(Long workspaceId) {
        return goalRepository.findByWorkspaceId(workspaceId);
    }

    // Get all goals owned by a specific user
    public List<Goals> getGoalsByOwnerUserId(Long ownerUserId) {
        return goalRepository.findByOwnerUserId(ownerUserId);
    }

    // Get goals by status
    public List<Goals> getGoalsByStatus(GoalsStatus status) {
        return goalRepository.findByStatus(status);
    }

    // Check if a goal name already exists within a workspace
    public boolean goalExistsInWorkspace(String name, Long workspaceId) {
        return goalRepository.findByNameAndWorkspaceId(name, workspaceId).isPresent();
    }
}