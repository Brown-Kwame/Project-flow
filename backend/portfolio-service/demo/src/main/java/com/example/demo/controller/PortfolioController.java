package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;

@RestController
public class PortfolioController {
    @GetMapping("/portfolio")
    public List<Map<String, Object>> getPortfolio() {
        List<Map<String, Object>> portfolio = new ArrayList<>();
        Map<String, Object> asset1 = new HashMap<>();
        asset1.put("id", 1);
        asset1.put("name", "Stock A");
        asset1.put("value", 1000);
        portfolio.add(asset1);
        Map<String, Object> asset2 = new HashMap<>();
        asset2.put("id", 2);
        asset2.put("name", "Bond B");
        asset2.put("value", 500);
        portfolio.add(asset2);
        return portfolio;
    }
}
