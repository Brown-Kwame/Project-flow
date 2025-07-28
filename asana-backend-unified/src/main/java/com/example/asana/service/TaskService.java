package com.example.asana.service;

import com.example.asana.dto.CreateTaskRequest;
import com.example.asana.dto.TaskResponse;
import com.example.asana.dto.UpdateTaskRequest;
import com.example.asana.exception.ResourceNotFoundException;
import com.example.asana.model.Task;
import com.example.asana.model.User;
import com.example.asana.model.Project;
import com.example.asana.repository.TaskRepository;
import com.example.asana.repository.UserRepository;
import com.example.asana.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public List<TaskResponse> getAllTasks() {
        List<Task> tasks = taskRepository.findAll();
        return tasks.stream()
                .map(this::convertToTaskResponse)
                .collect(Collectors.toList());
    }

    public List<TaskResponse> getTasksByUserId(Long userId) {
        List<Task> tasks = taskRepository.findByAssignedUser_Id(userId);
        return tasks.stream()
                .map(this::convertToTaskResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskResponse createTask(CreateTaskRequest request) {
        User assignedUser = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus() != null ? request.getStatus() : com.example.asana.model.TaskStatus.NOT_STARTED);
        task.setPriority(request.getPriority() != null ? request.getPriority() : com.example.asana.model.TaskPriority.MEDIUM);
        task.setDueDate(request.getDueDate());
        task.setAssignedUser(assignedUser);

        // Set project if projectId is provided
        if (request.getProjectId() != null) {
            Project project = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + request.getProjectId()));
            task.setProject(project);
        }

        Task savedTask = taskRepository.save(task);
        return convertToTaskResponse(savedTask);
    }

    @Transactional
    public TaskResponse updateTask(Long taskId, UpdateTaskRequest request) {
        Task existingTask = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));

        if (request.getTitle() != null) existingTask.setTitle(request.getTitle());
        if (request.getDescription() != null) existingTask.setDescription(request.getDescription());
        if (request.getStatus() != null) existingTask.setStatus(request.getStatus());
        if (request.getPriority() != null) existingTask.setPriority(request.getPriority());
        if (request.getDueDate() != null) existingTask.setDueDate(request.getDueDate());

        Task updatedTask = taskRepository.save(existingTask);
        return convertToTaskResponse(updatedTask);
    }

    @Transactional
    public void deleteTask(Long taskId) {
        if (!taskRepository.existsById(taskId)) {
            throw new ResourceNotFoundException("Task not found with ID: " + taskId);
        }
        taskRepository.deleteById(taskId);
    }

    public Optional<TaskResponse> getTaskById(Long taskId) {
        return taskRepository.findById(taskId).map(this::convertToTaskResponse);
    }

    private TaskResponse convertToTaskResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus().name(),
                task.getPriority().name(),
                task.getDueDate(),
                task.getCreatedAt(),
                task.getUpdatedAt(),
                task.getAssignedUser().getId(),
                task.getProject() != null ? task.getProject().getId() : null
        );
    }
} 