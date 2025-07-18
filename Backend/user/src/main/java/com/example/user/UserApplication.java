package com.example.user;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import java.util.Properties;

@SpringBootApplication
@EnableDiscoveryClient
public class UserApplication {
	public static void main(String[] args) {
		SpringApplication.run(UserApplication.class, args);
	}

	@Bean
	public JavaMailSender javaMailSender() {
		JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
		mailSender.setHost(System.getProperty("spring.mail.host", "smtp.example.com"));
		mailSender.setPort(Integer.parseInt(System.getProperty("spring.mail.port", "587")));
		mailSender.setUsername(System.getProperty("spring.mail.username", "your_email@example.com"));
		mailSender.setPassword(System.getProperty("spring.mail.password", "your_email_password"));

		Properties props = mailSender.getJavaMailProperties();
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		return mailSender;
	}
}
