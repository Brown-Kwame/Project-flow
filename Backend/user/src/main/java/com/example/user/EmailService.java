package com.example.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendWelcomeEmail(String to, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Welcome to Asana!");
        message.setText("Hello " + name + ",\n\nWelcome to Asana! We're excited to have you on board.\n\nBest regards,\nThe Asana Team");
        mailSender.send(message);
    }
}
