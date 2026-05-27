package com.pinterest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostResponse {

    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private String category;
    private LocalDateTime createdAt;
    private Long userId;
    private String username;
    private String userProfileImage;
    private boolean saved;
}
