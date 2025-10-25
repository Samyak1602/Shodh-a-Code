package com.shodhacode.service;

import com.shodhacode.model.Submission;
import com.shodhacode.model.SubmissionStatus;
import com.shodhacode.model.TestCase;
import com.shodhacode.model.Problem;
import com.shodhacode.repository.SubmissionRepository;
import com.shodhacode.repository.ProblemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Component
@RequiredArgsConstructor
@Slf4j
public class JudgeWorker {
    
    private final SubmissionService submissionService;
    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final ExecutorService executorService = Executors.newFixedThreadPool(2);
    
    @PostConstruct
    public void startWorker() {
        log.info("Starting JudgeWorker...");
        executorService.submit(this::processSubmissions);
    }
    
    private void processSubmissions() {
        BlockingQueue<Submission> queue = submissionService.getSubmissionQueue();
        
        while (true) {
            try {
                Submission submission = queue.take();
                log.info("Processing submission: {}", submission.getId());
                processSubmission(submission);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                log.error("JudgeWorker interrupted", e);
                break;
            } catch (Exception e) {
                log.error("Error processing submission", e);
            }
        }
    }
    
    @Transactional
    private void processSubmission(Submission submission) {
        try {
            // Set status to RUNNING
            submission.setStatus(SubmissionStatus.RUNNING);
            submissionRepository.save(submission);
            
            // Create temporary directory
            Path tempDir = createTempDirectory(submission.getId());
            
            try {
                // Write code to file
                String fileName = getFileName(submission.getLanguage());
                Path codeFile = tempDir.resolve(fileName);
                Files.write(codeFile, submission.getCode().getBytes());
                
                // Fetch problem with test cases to avoid lazy initialization
                Problem problem = problemRepository.findByIdWithTestCases(submission.getProblem().getId())
                        .orElseThrow(() -> new RuntimeException("Problem not found"));
                List<TestCase> testCases = problem.getTestCases();
                boolean allPassed = true;
                String result = "";
                
                for (int i = 0; i < testCases.size(); i++) {
                    TestCase testCase = testCases.get(i);
                    JudgeResult judgeResult = runTestCase(tempDir, fileName, testCase, submission.getLanguage());
                    
                    if (!judgeResult.isSuccess()) {
                        allPassed = false;
                        result = judgeResult.getError();
                        break;
                    }
                    
                    if (!judgeResult.getOutput().trim().equals(testCase.getExpectedOutput().trim())) {
                        allPassed = false;
                        result = "Wrong Answer on test case " + (i + 1);
                        break;
                    }
                }
                
                // Update submission result
                if (allPassed) {
                    submission.setStatus(SubmissionStatus.ACCEPTED);
                    submission.setResult("All test cases passed");
                } else {
                    submission.setStatus(SubmissionStatus.WRONG_ANSWER);
                    submission.setResult(result);
                }
                
            } finally {
                // Clean up temporary directory
                deleteDirectory(tempDir);
            }
            
        } catch (Exception e) {
            log.error("Error processing submission {}: {}", submission.getId(), e.getMessage());
            submission.setStatus(SubmissionStatus.RUNTIME_ERROR);
            submission.setResult("Runtime error: " + e.getMessage());
        }
        
        submissionRepository.save(submission);
        log.info("Completed processing submission: {} with status: {}", submission.getId(), submission.getStatus());
    }
    
    private Path createTempDirectory(Long submissionId) throws IOException {
        Path tempDir = Paths.get("/tmp/shodhacode/" + submissionId);
        Files.createDirectories(tempDir);
        return tempDir;
    }
    
    private String getFileName(String language) {
        return switch (language.toLowerCase()) {
            case "java" -> "Main.java";
            case "python" -> "main.py";
            case "cpp", "c++" -> "main.cpp";
            default -> "main.java";
        };
    }
    
    private JudgeResult runTestCase(Path workDir, String fileName, TestCase testCase, String language) {
        try {
            // Write input to file
            Path inputFile = workDir.resolve("input.txt");
            Files.write(inputFile, testCase.getInput().getBytes());
            
            // Build execution command
            List<String> command = buildExecutionCommand(fileName, language);
            
            // Execute command
            ProcessBuilder pb = new ProcessBuilder(command);
            pb.directory(workDir.toFile());
            
            Process process = pb.start();
            
            // Write input to process
            try (OutputStreamWriter writer = new OutputStreamWriter(process.getOutputStream())) {
                writer.write(testCase.getInput());
                writer.flush();
            }
            
            // Wait for completion with timeout
            boolean finished = process.waitFor(10, java.util.concurrent.TimeUnit.SECONDS);
            
            if (!finished) {
                process.destroyForcibly();
                return new JudgeResult(false, "", "Time limit exceeded");
            }
            
            // Read output
            String output = readStream(process.getInputStream());
            String error = readStream(process.getErrorStream());
            
            int exitCode = process.exitValue();
            
            if (exitCode != 0) {
                return new JudgeResult(false, output, "Runtime error: " + error);
            }
            
            return new JudgeResult(true, output, "");
            
        } catch (Exception e) {
            return new JudgeResult(false, "", "Execution error: " + e.getMessage());
        }
    }
    
    private List<String> buildExecutionCommand(String fileName, String language) {
        return switch (language.toLowerCase()) {
            case "java" -> List.of("bash", "-c", "javac " + fileName + " && java Main");
            case "python" -> List.of("python3", fileName);
            case "cpp", "c++" -> List.of("bash", "-c", "g++ " + fileName + " -o main && ./main");
            default -> List.of("bash", "-c", "javac " + fileName + " && java Main");
        };
    }
    
    
    private String readStream(InputStream stream) throws IOException {
        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(stream))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
        }
        return output.toString();
    }
    
    private void deleteDirectory(Path directory) {
        try {
            Files.walk(directory)
                    .sorted((a, b) -> b.compareTo(a)) // Delete files before directories
                    .forEach(path -> {
                        try {
                            Files.delete(path);
                        } catch (IOException e) {
                            log.warn("Failed to delete: {}", path, e);
                        }
                    });
        } catch (IOException e) {
            log.warn("Failed to delete directory: {}", directory, e);
        }
    }
    
    private static class JudgeResult {
        private final boolean success;
        private final String output;
        private final String error;
        
        public JudgeResult(boolean success, String output, String error) {
            this.success = success;
            this.output = output;
            this.error = error;
        }
        
        public boolean isSuccess() { return success; }
        public String getOutput() { return output; }
        public String getError() { return error; }
    }
}
