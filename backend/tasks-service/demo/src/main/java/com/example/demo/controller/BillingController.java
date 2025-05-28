package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class BillingController {
    @GetMapping("/billing")
    public List<Map<String, Object>> getBilling() {
        List<Map<String, Object>> billing = new ArrayList<>();
        Map<String, Object> bill1 = new HashMap<>();
        bill1.put("id", 1);
        bill1.put("item", "Subscription");
        bill1.put("amount", 29.99);
        billing.add(bill1);
        Map<String, Object> bill2 = new HashMap<>();
        bill2.put("id", 2);
        bill2.put("item", "Add-on");
        bill2.put("amount", 9.99);
        billing.add(bill2);
        return billing;
    }
}
