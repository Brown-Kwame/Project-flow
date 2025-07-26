package com.example.task;

import com.example.task.dto.TaskResponse;
import com.example.task.dto.CreateTaskRequest; // Assuming you'll have this DTO for createTask
import com.example.task.dto.UpdateTaskRequest; // Assuming you'll have this DTO for updateTask
import com.example.task.Task;
import com.example.task.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional; // For updateTask, getTaskById
import java.util.stream.Collectors; // For .collect(Collectors.toList())

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service // Marks this class as a Spring Service component
public class TaskService { // <-- Missing 'public class TaskService' in your screenshot

    private static final Logger logger = LoggerFactory.getLogger(TaskService.class);

    @Autowired
    private TaskRepository taskRepository;

    // --- Task Operations ---

    /**
     * Retrieves tasks assigned to a specific user.
     * @param userId The ID of the user whose tasks are to be retrieved.
     * @return A list of TaskResponse DTOs.
     */
    public List<TaskResponse> getTasksByUserId(Long userId) {
        logger.info("TaskService: Fetching tasks for userId: {}", userId);
        // Corrected: taskRepository.findByUserId is a standard JPA method if you define it in TaskRepository
        List<Task> tasks = taskRepository.findByUserId(userId); // This should be defined in TaskRepository
        logger.info("TaskService: Found {} tasks for userId: {}", tasks.size(), userId);
        // Corrected: Use .stream().map().collect() correctly
        return tasks.stream()
                .map(this::convertToTaskResponse) // Reference to the private helper method
                .collect(Collectors.toList()); // Correct import for Collectors
    }

    /**
     * Creates a new task.
     * @param request The DTO containing the task details.
     * @return The created TaskResponse DTO.
     */
    @Transactional
    public TaskResponse createTask(CreateTaskRequest request) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        task.setUserId(request.getUserId());
        task.setProjectId(request.getProjectId());

        Task savedTask = taskRepository.save(task);
        logger.info("Task created with ID: {}", savedTask.getId());
        return convertToTaskResponse(savedTask);
    }

    /**
     * Updates an existing task.
     * @param taskId The ID of the task to update.
     * @param request The DTO containing updated task details.
     * @return The updated TaskResponse DTO.
     * @throws IllegalArgumentException if the task is not found.
     */
    @Transactional
    public TaskResponse updateTask(Long taskId, UpdateTaskRequest request) {
        Task existingTask = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + taskId));

        // Apply updates only if provided in the request
        Optional.ofNullable(request.getTitle()).ifPresent(existingTask::setTitle);
        Optional.ofNullable(request.getDescription()).ifPresent(existingTask::setDescription);
        Optional.ofNullable(request.getStatus()).ifPresent(existingTask::setStatus);
        Optional.ofNullable(request.getPriority()).ifPresent(existingTask::setPriority);
        Optional.ofNullable(request.getDueDate()).ifPresent(existingTask::setDueDate);
        Optional.ofNullable(request.getProjectId()).ifPresent(existingTask::setProjectId);

        Task updatedTask = taskRepository.save(existingTask);
        logger.info("Task with ID {} updated.", updatedTask.getId());
        return convertToTaskResponse(updatedTask);
    }

    /**
     * Deletes a task by its ID.
     * @param taskId The ID of the task to delete.
     * @throws IllegalArgumentException if the task is not found.
     */
    @Transactional
    public void deleteTask(Long taskId) {
        if (!taskRepository.existsById(taskId)) {
            throw new IllegalArgumentException("Task not found with ID: " + taskId);
        }
        taskRepository.deleteById(taskId);
        logger.info("Task with ID {} deleted.", taskId);
    }

    /**
     * Retrieves a task by its ID.
     * @param taskId The ID of the task to retrieve.
     * @return An Optional containing the TaskResponse DTO if found, otherwise empty.
     */
    public Optional<TaskResponse> getTaskById(Long taskId) {
        return taskRepository.findById(taskId).map(this::convertToTaskResponse);
    }


    // --- Helper Methods ---

    /**
     * Converts a Task entity to a TaskResponse DTO.
     * @param task The Task entity.
     * @return The corresponding TaskResponse DTO.
     */
    private TaskResponse convertToTaskResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus().name(), // Convert enum to String
                task.getPriority().name(), // Convert enum to String
                task.getDueDate(),
                task.getCreatedAt(),
                task.getUpdatedAt(),
                task.getUserId(),
                task.getProjectId()
        );
    }
}