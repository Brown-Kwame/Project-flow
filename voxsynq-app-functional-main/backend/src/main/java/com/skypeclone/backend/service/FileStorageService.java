package com.skypeclone.backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private static final Logger logger = LoggerFactory.getLogger(FileStorageService.class);
    private final Path fileStorageLocation;

    // The directory where uploaded files will be stored.
    private final String UPLOAD_DIR = "uploads";

    public FileStorageService() {
        // Create the directory for uploads if it doesn't exist.
        this.fileStorageLocation = Paths.get(UPLOAD_DIR).normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
            // Log the absolute path for debugging
            logger.info("Uploads directory: {}", this.fileStorageLocation.toAbsolutePath());
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        // Normalize file name
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        // Create a unique filename to prevent conflicts
        String uniqueFileName = UUID.randomUUID().toString() + extension;

        try {
            // Check for invalid characters in filename
            if(uniqueFileName.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + uniqueFileName);
            }

            // Copy file to the target location (Replacing existing file with the same name)
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return uniqueFileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + uniqueFileName + ". Please try again!", ex);
        }
    }
}