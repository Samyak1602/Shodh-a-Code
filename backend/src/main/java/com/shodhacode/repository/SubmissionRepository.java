package com.shodhacode.repository;

import com.shodhacode.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    
    List<Submission> findTop100ByProblemContestIdOrderByCreatedAtDesc(Long contestId);
    
    @Query("SELECT s FROM Submission s WHERE s.problem.contest.id = :contestId AND s.status = 'ACCEPTED'")
    List<Submission> findAcceptedSubmissionsByContestId(Long contestId);
    
    @Query("SELECT s.userName, COUNT(s) as acceptedCount, MIN(s.runTime) as bestTime " +
           "FROM Submission s WHERE s.problem.contest.id = :contestId AND s.status = 'ACCEPTED' " +
           "GROUP BY s.userName ORDER BY acceptedCount DESC, bestTime ASC")
    List<Object[]> findLeaderboardByContestId(Long contestId);
}
