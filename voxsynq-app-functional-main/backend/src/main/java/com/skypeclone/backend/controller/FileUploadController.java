package com.skypeclone.backend.controller;

import com.skypeclone.backend.dto.FileUploadResponse;
import com.skypeclone.backend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/upload")
    public FileUploadResponse uploadFile(@RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.storeFile(file);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/files/download/")
                .path(fileName)
                .toUriString();

        return new FileUploadResponse(fileName, fileDownloadUri, file.getContentType(), file.getSize());
    }

    // Note: For serving files, we'll configure Spring to serve static resources directly,
    // which is more efficient than a dedicated controller endpoint. We'll do this next.
}