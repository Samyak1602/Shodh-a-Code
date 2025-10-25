package com.shodhacode.dto;

import com.shodhacode.model.SubmissionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionDTO {
    private Long id;
    private String userName;
    private Long problemId;
    private String language;
    private SubmissionStatus status;
    private String result;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long runTime;
    private Long memoryUsed;
}
