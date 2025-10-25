package com.shodhacode.service;

import com.shodhacode.dto.ContestDTO;
import com.shodhacode.dto.LeaderboardEntryDTO;
import com.shodhacode.dto.ProblemDTO;
import com.shodhacode.model.Contest;
import com.shodhacode.repository.ContestRepository;
import com.shodhacode.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContestService {
    
    private final ContestRepository contestRepository;
    private final SubmissionRepository submissionRepository;
    
    public ContestDTO getContest(Long contestId) {
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new RuntimeException("Contest not found"));
        
        ContestDTO dto = new ContestDTO();
        dto.setId(contest.getId());
        dto.setTitle(contest.getTitle());
        dto.setDescription(contest.getDescription());
        dto.setStartTime(contest.getStartTime());
        dto.setEndTime(contest.getEndTime());
        
        // Convert problems to DTOs (without test cases)
        List<ProblemDTO> problemDTOs = contest.getProblems().stream()
                .map(problem -> {
                    ProblemDTO problemDTO = new ProblemDTO();
                    problemDTO.setId(problem.getId());
                    problemDTO.setTitle(problem.getTitle());
                    problemDTO.setStatement(problem.getStatement());
                    return problemDTO;
                })
                .collect(Collectors.toList());
        
        dto.setProblems(problemDTOs);
        return dto;
    }
    
    public List<LeaderboardEntryDTO> getLeaderboard(Long contestId) {
        List<Object[]> results = submissionRepository.findLeaderboardByContestId(contestId);
        
        return results.stream()
                .map(result -> {
                    LeaderboardEntryDTO entry = new LeaderboardEntryDTO();
                    entry.setUserName((String) result[0]);
                    entry.setAcceptedCount((Long) result[1]);
                    entry.setBestTimeMillis((Long) result[2]);
                    return entry;
                })
                .collect(Collectors.toList());
    }
}
