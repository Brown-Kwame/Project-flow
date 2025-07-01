package com.example.task;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public Task createTask(String name, String description, TaskStatus status, TaskPriority priority,
                           LocalDate dueDate, Long assignedUserId, Long projectId, Long sectionId) {
        Task task = new Task();
        task.setName(name);
        task.setDescription(description);
        task.setStatus(status != null ? status : TaskStatus.NOT_STARTED);
        task.setPriority(priority != null ? priority : TaskPriority.MEDIUM);
        task.setDueDate(dueDate);
        task.setAssignedUserId(assignedUserId);
        task.setProjectId(projectId);
        task.setSectionId(sectionId);
        return taskRepository.save(task);
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public Optional<Task> updateTask(Long id, String name, String description, TaskStatus status, TaskPriority priority,
                                    LocalDate dueDate, Long assignedUserId, Long projectId, Long sectionId) {
        return taskRepository.findById(id).map(task -> {
            if (name != null) task.setName(name);
            if (description != null) task.setDescription(description);
            if (status != null) task.setStatus(status);
            if (priority != null) task.setPriority(priority);
            if (dueDate != null) task.setDueDate(dueDate);
            if (assignedUserId != null) task.setAssignedUserId(assignedUserId);
            if (projectId != null) task.setProjectId(projectId);
            if (sectionId != null) task.setSectionId(sectionId);
            return taskRepository.save(task);
        });
    }

    public boolean deleteTask(Long id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Task> getTasksByAssignedUserId(Long userId) {
        return taskRepository.findByAssignedUserId(userId);
    }

    public List<Task> getTasksByProjectId(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    public List<Task> getTasksByProjectIdAndSectionId(Long projectId, Long sectionId) {
        return taskRepository.findByProjectIdAndSectionId(projectId, sectionId);
    }

    public List<Task> getTasksDueBefore(LocalDate date) {
        return taskRepository.findByDueDateBefore(date);
    }
    
}