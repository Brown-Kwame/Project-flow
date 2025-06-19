package com.example.task;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedUserId(Long assignedUserId);
    List<Task> findByProjectId(Long projectId);
    List<Task> findByProjectIdAndSectionId(Long projectId, Long sectionId);
    List<Task> findByAssignedUserIdAndProjectId(Long assignedUserId, Long projectId);
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByDueDateBefore(LocalDate date);
}
