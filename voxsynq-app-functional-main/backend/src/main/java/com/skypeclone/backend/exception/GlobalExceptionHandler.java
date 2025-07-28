
package com.skypeclone.backend.exception;

import com.skypeclone.backend.dto.MessageResponse;
import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice // Allows handling exceptions across the whole application
public class GlobalExceptionHandler {

    // Handles validation errors (e.g., @NotBlank, @Email in DTOs)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex, WebRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );
        // For simplicity, returning a single message. Can also return the 'errors' map.
        String errorMessage = errors.values().stream().collect(Collectors.joining(", "));
        return new ResponseEntity<>(new MessageResponse("Validation Error: " + errorMessage), HttpStatus.BAD_REQUEST);
    }

    // Handles a custom resource not found exception (example)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> resourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        MessageResponse message = new MessageResponse(ex.getMessage());
        return new ResponseEntity<>(message, HttpStatus.NOT_FOUND);
    }

    // Generic exception handler for other errors
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> globalExceptionHandler(Exception ex, WebRequest request) {
        MessageResponse message = new MessageResponse("An unexpected error occurred: " + ex.getMessage());
        ex.printStackTrace(); // Log the stack trace for debugging
        return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}