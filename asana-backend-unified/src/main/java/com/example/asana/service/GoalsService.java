package com.example.asana.service;

import com.example.asana.dto.GoalRequest;
import com.example.asana.exception.ResourceNotFoundException;
import com.example.asana.model.Goals;
import com.example.asana.model.GoalsStatus;
import com.example.asana.model.Task;
import com.example.asana.model.Project;
import com.example.asana.repository.GoalsRepository;
import com.example.asana.repository.TaskRepository;
import com.example.asana.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@Service
public class GoalsService {

    @Autowired
    private GoalsRepository goalRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public List<Goals> getAllGoals() {
        return goalRepository.findAll();
    }

    @Transactional
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
        goal.setCurrentValue(currentValue != null ? currentValue : 0.0);
        goal.setUnit(unit);
        return goalRepository.save(goal);
    }

    public Optional<Goals> getGoalById(Long id) {
        return goalRepository.findById(id);
    }

    @Transactional
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
            return goalRepository.save(goal);
        });
    }

    @Transactional
    public boolean deleteGoal(Long id) {
        if (goalRepository.existsById(id)) {
            goalRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Goals> getGoalsByWorkspaceId(Long workspaceId) {
        return goalRepository.findByWorkspaceId(workspaceId);
    }

    public List<Goals> getGoalsByOwnerUserId(Long ownerUserId) {
        return goalRepository.findByOwnerUserId(ownerUserId);
    }

    public List<Goals> getGoalsByStatus(GoalsStatus status) {
        return goalRepository.findByStatus(status);
    }

    public boolean goalExistsInWorkspace(String name, Long workspaceId) {
        return goalRepository.findByNameAndWorkspaceId(name, workspaceId).isPresent();
    }

    /**
     * Calculate and update goal progress based on completed tasks and projects
     */
    @Transactional
    public Goals updateGoalProgress(Long goalId) {
        Goals goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + goalId));

        // Get completed tasks for the goal owner
        List<Task> completedTasks = taskRepository.findByAssignedUser_IdAndStatus(goal.getOwnerUserId(), "COMPLETED");
        
        // Get completed projects for the goal owner
        List<Project> completedProjects = projectRepository.findByOwnerUser_IdAndStatus(goal.getOwnerUserId(), "COMPLETED");

        // Calculate progress based on completed items
        double taskProgress = completedTasks.size() * 1.0; // Each task = 1 point
        double projectProgress = completedProjects.size() * 5.0; // Each project = 5 points
        double totalProgress = taskProgress + projectProgress;

        // Update goal current value
        goal.setCurrentValue(Math.min(totalProgress, goal.getTargetValue() != null ? goal.getTargetValue() : 0));
        
        // Update goal status based on progress
        if (goal.getTargetValue() != null && goal.getTargetValue() > 0) {
            double progressPercentage = (goal.getCurrentValue() / goal.getTargetValue()) * 100;
            if (progressPercentage >= 100) {
                goal.setStatus(GoalsStatus.COMPLETED);
            } else if (progressPercentage > 0) {
                goal.setStatus(GoalsStatus.IN_PROGRESS);
            } else {
                goal.setStatus(GoalsStatus.NOT_STARTED);
            }
        } else {
            goal.setStatus(GoalsStatus.NOT_STARTED);
        }

        return goalRepository.save(goal);
    }

    /**
     * Get goal progress data for the last 7 days (simplified version)
     */
    public List<GoalProgressData> getGoalProgressData(Long goalId) {
        Goals goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + goalId));

        List<GoalProgressData> progressData = new ArrayList<>();
        LocalDate today = LocalDate.now();

        // For now, return simplified data without complex date filtering
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            
            // Calculate a simple daily progress based on total completions
            // This is a simplified approach to avoid complex date queries
            double dailyProgress = 0;
            if (goal.getTargetValue() != null && goal.getTargetValue() > 0) {
                dailyProgress = Math.min(100, (goal.getCurrentValue() / goal.getTargetValue()) * 100 / 7);
            }
            
            progressData.add(new GoalProgressData(date, dailyProgress, 0));
        }

        return progressData;
    }

    // Helper class for progress data
    public static class GoalProgressData {
        private LocalDate date;
        private double progress;
        private int completedItems;

        public GoalProgressData(LocalDate date, double progress, int completedItems) {
            this.date = date;
            this.progress = progress;
            this.completedItems = completedItems;
        }

        // Getters and setters
        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }
        public double getProgress() { return progress; }
        public void setProgress(double progress) { this.progress = progress; }
        public int getCompletedItems() { return completedItems; }
        public void setCompletedItems(int completedItems) { this.completedItems = completedItems; }
    }
} 