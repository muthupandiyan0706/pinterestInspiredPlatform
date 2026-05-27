package com.pinterest.controller;

import com.pinterest.dto.PostRequest;
import com.pinterest.dto.UpdatePostRequest;
import com.pinterest.dto.PostResponse;
import com.pinterest.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts(Authentication authentication) {
        String username = authentication != null ? authentication.getName() : null;
        List<PostResponse> posts = postService.getAllPosts(username);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long id,
                                                     Authentication authentication) {
        String username = authentication != null ? authentication.getName() : null;
        PostResponse post = postService.getPostById(id, username);
        return ResponseEntity.ok(post);
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(@Valid @RequestBody PostRequest request,
                                                    Authentication authentication) {
        PostResponse post = postService.createPost(request, authentication.getName());
        return new ResponseEntity<>(post, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(@PathVariable Long id,
                                                     @RequestBody UpdatePostRequest request,
                                                     Authentication authentication) {
        PostResponse post = postService.updatePost(id, request, authentication.getName());
        return ResponseEntity.ok(post);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id,
                                            Authentication authentication) {
        postService.deletePost(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<PostResponse>> searchPosts(@RequestParam String query,
                                                           Authentication authentication) {
        String username = authentication != null ? authentication.getName() : null;
        List<PostResponse> posts = postService.searchPosts(query, username);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<PostResponse>> getPostsByCategory(@PathVariable String category,
                                                                   Authentication authentication) {
        String username = authentication != null ? authentication.getName() : null;
        List<PostResponse> posts = postService.getPostsByCategory(category, username);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostResponse>> getPostsByUser(@PathVariable Long userId,
                                                              Authentication authentication) {
        String username = authentication != null ? authentication.getName() : null;
        List<PostResponse> posts = postService.getPostsByUser(userId, username);
        return ResponseEntity.ok(posts);
    }
}
