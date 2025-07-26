package com.example.task;

import com.example.task.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    // Custom query method to find tasks by user ID
    List<Task> findByUserId(Long userId);
}
