package com.example.task;

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
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TaskRequest {
        private String name;
        private String description;
        private TaskStatus status;
        private TaskPriority priority;
        private LocalDate dueDate;
        private Long assignedUserId;
        private Long projectId;
        private Long sectionId;
    }

    @PostMapping("/")
    public ResponseEntity<Task> createTask(@RequestBody TaskRequest request) {
        Task newTask = taskService.createTask(
                request.getName(),
                request.getDescription(),
                request.getStatus(),
                request.getPriority(),
                request.getDueDate(),
                request.getAssignedUserId(),
                request.getProjectId(),
                request.getSectionId()
        );
        return new ResponseEntity<>(newTask, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Optional<Task> task = taskService.getTaskById(id);
        return task.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody TaskRequest request) {
        Optional<Task> updatedTask = taskService.updateTask(
                id,
                request.getName(),
                request.getDescription(),
                request.getStatus(),
                request.getPriority(),
                request.getDueDate(),
                request.getAssignedUserId(),
                request.getProjectId(),
                request.getSectionId()
        );
        return updatedTask.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        boolean deleted = taskService.deleteTask(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Task>> getTasksByAssignedUserId(@PathVariable Long userId) {
        List<Task> tasks = taskService.getTasksByAssignedUserId(userId);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Task>> getTasksByProjectId(@PathVariable Long projectId) {
        List<Task> tasks = taskService.getTasksByProjectId(projectId);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @GetMapping("/project/{projectId}/section/{sectionId}")
    public ResponseEntity<List<Task>> getTasksByProjectIdAndSectionId(@PathVariable Long projectId, @PathVariable Long sectionId) {
        List<Task> tasks = taskService.getTasksByProjectIdAndSectionId(projectId, sectionId);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @GetMapping("/dueBefore/{dateString}")
    public ResponseEntity<List<Task>> getTasksDueBefore(@PathVariable String dateString) {
        try {
            LocalDate date = LocalDate.parse(dateString);
            List<Task> tasks = taskService.getTasksDueBefore(date);
            return new ResponseEntity<>(tasks, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
