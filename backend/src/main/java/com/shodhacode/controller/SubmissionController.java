package com.shodhacode.controller;

import com.shodhacode.dto.SubmissionCreateRequest;
import com.shodhacode.dto.SubmissionDTO;
import com.shodhacode.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SubmissionController {
    
    private final SubmissionService submissionService;
    
    @PostMapping
    public ResponseEntity<Map<String, Long>> createSubmission(@RequestBody SubmissionCreateRequest request) {
        SubmissionDTO submission = submissionService.createSubmission(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("submissionId", submission.getId()));
    }
    
    @GetMapping("/{submissionId}")
    public ResponseEntity<SubmissionDTO> getSubmission(@PathVariable Long submissionId) {
        SubmissionDTO submission = submissionService.getSubmission(submissionId);
        return ResponseEntity.ok(submission);
    }
}
