package com.shodhacode.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionCreateRequest {
    private Long contestId;
    private Long problemId;
    private String userName;
    private String language;
    private String code;
}
