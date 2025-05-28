package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;

@RestController
public class GoalsController {
    @GetMapping("/goals")
    public List<Map<String, Object>> getGoals() {
        List<Map<String, Object>> goals = new ArrayList<>();
        Map<String, Object> goal1 = new HashMap<>();
        goal1.put("id", 1);
        goal1.put("title", "Learn Spring Boot");
        goal1.put("completed", false);
        goals.add(goal1);
        Map<String, Object> goal2 = new HashMap<>();
        goal2.put("id", 2);
        goal2.put("title", "Build React Native App");
        goal2.put("completed", true);
        goals.add(goal2);
        return goals;
    }
}
