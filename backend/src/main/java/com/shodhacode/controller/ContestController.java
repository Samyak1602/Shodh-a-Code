package com.shodhacode.controller;

import com.shodhacode.dto.ContestDTO;
import com.shodhacode.dto.LeaderboardEntryDTO;
import com.shodhacode.service.ContestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contests")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ContestController {
    
    private final ContestService contestService;
    
    @GetMapping("/{contestId}")
    public ResponseEntity<ContestDTO> getContest(@PathVariable Long contestId) {
        ContestDTO contest = contestService.getContest(contestId);
        return ResponseEntity.ok(contest);
    }
    
    @GetMapping("/{contestId}/leaderboard")
    public ResponseEntity<List<LeaderboardEntryDTO>> getLeaderboard(@PathVariable Long contestId) {
        List<LeaderboardEntryDTO> leaderboard = contestService.getLeaderboard(contestId);
        return ResponseEntity.ok(leaderboard);
    }
}
