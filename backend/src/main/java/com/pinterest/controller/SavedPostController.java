package com.pinterest.controller;

import com.pinterest.dto.PostResponse;
import com.pinterest.service.SavedPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/saved")
@RequiredArgsConstructor
public class SavedPostController {

    private final SavedPostService savedPostService;

    @PostMapping("/{postId}")
    public ResponseEntity<Map<String, String>> savePost(@PathVariable Long postId,
                                                         Authentication authentication) {
        savedPostService.savePost(postId, authentication.getName());
        return new ResponseEntity<>(Map.of("message", "Post saved successfully"), HttpStatus.CREATED);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Map<String, String>> unsavePost(@PathVariable Long postId,
                                                           Authentication authentication) {
        savedPostService.unsavePost(postId, authentication.getName());
        return ResponseEntity.ok(Map.of("message", "Post unsaved successfully"));
    }

    @GetMapping
    public ResponseEntity<List<PostResponse>> getSavedPosts(Authentication authentication) {
        List<PostResponse> posts = savedPostService.getSavedPosts(authentication.getName());
        return ResponseEntity.ok(posts);
    }
}
