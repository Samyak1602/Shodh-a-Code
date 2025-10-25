package com.shodhacode.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "problems")
@Data
@EqualsAndHashCode(exclude = {"contest"})
@NoArgsConstructor
@AllArgsConstructor
public class Problem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String statement;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contest_id", nullable = false)
    private Contest contest;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "test_cases", joinColumns = @JoinColumn(name = "problem_id"))
    private List<TestCase> testCases = new ArrayList<>();
}
