package com.shodhacode.service;

import com.shodhacode.model.Contest;
import com.shodhacode.model.Problem;
import com.shodhacode.model.TestCase;
import com.shodhacode.repository.ContestRepository;
import com.shodhacode.repository.ProblemRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataInitializationService {

    private final ContestRepository contestRepository;
    private final ProblemRepository problemRepository;

    @PostConstruct
    public void initializeData() {
        log.info("Initializing sample data...");
        
        // Check if data already exists
        if (contestRepository.count() > 0) {
            log.info("Data already exists, skipping initialization");
            return;
        }

        // Create sample contest
        Contest contest = new Contest();
        contest.setTitle("Shodh Sample Contest");
        contest.setDescription("A sample coding contest to test the platform");
        contest.setStartTime(LocalDateTime.now().minusHours(1));
        contest.setEndTime(LocalDateTime.now().plusHours(2));
        
        Contest savedContest = contestRepository.save(contest);
        log.info("Created contest: {}", savedContest.getTitle());

        // Create sample problems
        Problem problem1 = new Problem();
        problem1.setTitle("Sum Two Numbers");
        problem1.setStatement("Given two integers a and b, output their sum.");
        problem1.setContest(savedContest);
        problem1.setTestCases(List.of(
            new TestCase("2 3", "5"),
            new TestCase("10 20", "30"),
            new TestCase("-5 3", "-2")
        ));
        
        Problem problem2 = new Problem();
        problem2.setTitle("Echo Input");
        problem2.setStatement("Read a line of input and output it exactly as given.");
        problem2.setContest(savedContest);
        problem2.setTestCases(List.of(
            new TestCase("Hello World", "Hello World"),
            new TestCase("Shodh-a-Code", "Shodh-a-Code"),
            new TestCase("123", "123")
        ));

        problemRepository.save(problem1);
        problemRepository.save(problem2);
        
        // Add problems to contest's problems collection
        savedContest.getProblems().add(problem1);
        savedContest.getProblems().add(problem2);
        contestRepository.save(savedContest);
        
        log.info("Created {} problems for contest", 2);
        log.info("Data initialization completed");
    }
}
