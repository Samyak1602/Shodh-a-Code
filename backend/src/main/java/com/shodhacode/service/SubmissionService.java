package com.shodhacode.service;

import com.shodhacode.dto.SubmissionCreateRequest;
import com.shodhacode.dto.SubmissionDTO;
import com.shodhacode.model.Problem;
import com.shodhacode.model.Submission;
import com.shodhacode.model.SubmissionStatus;
import com.shodhacode.repository.ProblemRepository;
import com.shodhacode.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubmissionService {
    
    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    
    private final BlockingQueue<Submission> submissionQueue = new LinkedBlockingQueue<>();
    
    public SubmissionDTO createSubmission(SubmissionCreateRequest request) {
        log.info("Creating submission for user: {}, problem: {}", request.getUserName(), request.getProblemId());
        
        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new RuntimeException("Problem not found"));
        
        Submission submission = new Submission();
        submission.setUserName(request.getUserName());
        submission.setProblem(problem);
        submission.setCode(request.getCode());
        submission.setLanguage(request.getLanguage());
        submission.setStatus(SubmissionStatus.PENDING);
        
        submission = submissionRepository.save(submission);
        
        // Add to processing queue
        try {
            submissionQueue.put(submission);
            log.info("Added submission {} to processing queue", submission.getId());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Failed to add submission to queue", e);
        }
        
        return convertToDTO(submission);
    }
    
    public SubmissionDTO getSubmission(Long id) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
        return convertToDTO(submission);
    }
    
    public BlockingQueue<Submission> getSubmissionQueue() {
        return submissionQueue;
    }
    
    private SubmissionDTO convertToDTO(Submission submission) {
        SubmissionDTO dto = new SubmissionDTO();
        dto.setId(submission.getId());
        dto.setUserName(submission.getUserName());
        dto.setProblemId(submission.getProblem().getId());
        dto.setLanguage(submission.getLanguage());
        dto.setStatus(submission.getStatus());
        dto.setResult(submission.getResult());
        dto.setCreatedAt(submission.getCreatedAt());
        dto.setUpdatedAt(submission.getUpdatedAt());
        dto.setRunTime(submission.getRunTime());
        dto.setMemoryUsed(submission.getMemoryUsed());
        return dto;
    }
}
