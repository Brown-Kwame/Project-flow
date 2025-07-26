package com.example.task;

import com.example.task.dto.CreateTaskRequest; // Import the DTO for creating tasks
import com.example.task.dto.TaskResponse;
import com.example.task.dto.UpdateTaskRequest; // Import the DTO for updating tasks
import com.example.task.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/tasks")
// @Data // REMOVE THIS LOMBOK ANNOTATION
// @NoArgsConstructor // REMOVE THIS LOMBOK ANNOTATION
// @AllArgsConstructor // REMOVE THIS LOMBOK ANNOTATION
public class TaskController {

    private static final Logger logger = LoggerFactory.getLogger(TaskController.class);

    @Autowired
    private TaskService taskService;

    // Helper to get authenticated user ID
    private Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && authentication.getDetails() instanceof Long) {
            return (Long) authentication.getDetails();
        }
        throw new SecurityException("User not authenticated or user ID not found in security context.");
    }

    /**
     * Retrieves tasks assigned to a specific user.
     * Requires authentication, and the requested userId must match the authenticated user's ID.
     * @param userId The ID of the user whose tasks are to be retrieved.
     * @return ResponseEntity with a list of TaskResponse.
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated() and #userId == authentication.details")
    public ResponseEntity<List<TaskResponse>> getTasksByUserId(@PathVariable Long userId) {
        try {
            logger.info("Received request to get tasks for user ID: {}", userId);
            List<TaskResponse> tasks = taskService.getTasksByUserId(userId);
            logger.info("Successfully retrieved {} tasks for user ID: {}", tasks.size(), userId);
            return new ResponseEntity<>(tasks, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error fetching tasks for user ID {}: {}", userId, e.getMessage(), e);
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Creates a new task.
     * Requires authentication. The authenticated user ID will be assigned to the task.
     * @param request The DTO containing the task details.
     * @return ResponseEntity with the created TaskResponse.
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TaskResponse> createTask(@RequestBody CreateTaskRequest request) { // Corrected: Use CreateTaskRequest DTO
        try {
            logger.info("Received request to create task: {}", request.getTitle());
            // Ensure the userId in the request matches the authenticated user
            if (!request.getUserId().equals(getAuthenticatedUserId())) {
                throw new SecurityException("Task must be assigned to the authenticated user.");
            }
            TaskResponse createdTask = taskService.createTask(request);
            logger.info("Task created successfully with ID: {}", createdTask.getId());
            return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
        } catch (SecurityException e) {
            logger.warn("Security error creating task: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            logger.error("Error creating task: {}", e.getMessage(), e);
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Updates an existing task.
     * Requires authentication, and the authenticated user must be the task's assignee.
     * @param taskId The ID of the task to update.
     * @param request The DTO containing updated task details.
     * @return ResponseEntity with the updated TaskResponse.
     */
    @PutMapping("/{taskId}")
    @PreAuthorize("isAuthenticated() and @taskService.getTaskById(#taskId).orElse(null)?.userId == authentication.details")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable Long taskId, @RequestBody UpdateTaskRequest request) {
        try {
            logger.info("Received request to update task with ID: {}", taskId);
            TaskResponse updatedTask = taskService.updateTask(taskId, request);
            logger.info("Task with ID {} updated successfully.", updatedTask.getId());
            return new ResponseEntity<>(updatedTask, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            logger.warn("Task update failed for ID {}: {}", taskId, e.getMessage());
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            logger.error("Error updating task with ID {}: {}", taskId, e.getMessage(), e);
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Deletes a task by its ID.
     * Requires authentication, and the authenticated user must be the task's assignee.
     * @param taskId The ID of the task to delete.
     * @return ResponseEntity with no content.
     */
    @DeleteMapping("/{taskId}")
    @PreAuthorize("isAuthenticated() and @taskService.getTaskById(#taskId).orElse(null)?.userId == authentication.details")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        try {
            logger.info("Received request to delete task with ID: {}", taskId);
            taskService.deleteTask(taskId);
            logger.info("Task with ID {} deleted successfully.", taskId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            logger.warn("Task deletion failed for ID {}: {}", taskId, e.getMessage());
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            logger.error("Error deleting task with ID {}: {}", taskId, e.getMessage(), e);
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Retrieves a task by its ID.
     * Requires authentication, and the authenticated user must be the task's assignee.
     * @param taskId The ID of the task to retrieve.
     * @return ResponseEntity with the TaskResponse.
     */
    @GetMapping("/{taskId}")
    @PreAuthorize("isAuthenticated() and @taskService.getTaskById(#taskId).orElse(null)?.userId == authentication.details")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long taskId) {
        try {
            logger.info("Received request to get task by ID: {}", taskId);
            return taskService.getTaskById(taskId)
                    .map(task -> {
                        logger.info("Task with ID {} retrieved successfully.", taskId);
                        return new ResponseEntity<>(task, HttpStatus.OK);
                    })
                    .orElseGet(() -> {
                        logger.warn("Task with ID {} not found.", taskId);
                        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                    });
        } catch (Exception e) {
            logger.error("Error retrieving task with ID {}: {}", taskId, e.getMessage(), e);
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
