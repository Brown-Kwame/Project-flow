package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;

@RestController
public class ReportingController {
    @GetMapping("/reporting")
    public List<Map<String, Object>> getReporting() {
        List<Map<String, Object>> reports = new ArrayList<>();
        Map<String, Object> report1 = new HashMap<>();
        report1.put("id", 1);
        report1.put("type", "Summary");
        report1.put("status", "Complete");
        reports.add(report1);
        Map<String, Object> report2 = new HashMap<>();
        report2.put("id", 2);
        report2.put("type", "Detail");
        report2.put("status", "Pending");
        reports.add(report2);
        return reports;
    }
}
