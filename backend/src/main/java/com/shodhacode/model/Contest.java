package com.shodhacode.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "contests")
@Data
@EqualsAndHashCode(exclude = {"problems"})
@NoArgsConstructor
@AllArgsConstructor
public class Contest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private LocalDateTime startTime;
    
    @Column(nullable = false)
    private LocalDateTime endTime;
    
    @OneToMany(mappedBy = "contest", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<Problem> problems = new HashSet<>();
}
