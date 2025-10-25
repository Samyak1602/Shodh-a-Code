package com.shodhacode.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryDTO {
    private String userName;
    private Long acceptedCount;
    private Long bestTimeMillis;
}
