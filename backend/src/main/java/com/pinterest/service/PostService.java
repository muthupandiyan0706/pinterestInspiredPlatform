package com.pinterest.service;

import com.pinterest.dto.PostRequest;
import com.pinterest.dto.UpdatePostRequest;
import com.pinterest.dto.PostResponse;
import com.pinterest.entity.Post;
import com.pinterest.entity.User;
import com.pinterest.exception.ResourceNotFoundException;
import com.pinterest.repository.PostRepository;
import com.pinterest.repository.SavedPostRepository;
import com.pinterest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final SavedPostRepository savedPostRepository;

    public List<PostResponse> getAllPosts(String currentUsername) {
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();
        return posts.stream()
                .map(post -> mapToResponse(post, currentUsername))
                .collect(Collectors.toList());
    }

    public PostResponse getPostById(Long id, String currentUsername) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));
        return mapToResponse(post, currentUsername);
    }

    public PostResponse createPost(PostRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Post post = Post.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .category(request.getCategory())
                .user(user)
                .build();

        post = postRepository.save(post);
        return mapToResponse(post, username);
    }

    public PostResponse updatePost(Long id, UpdatePostRequest request, String username) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));

        if (!post.getUser().getUsername().equals(username)) {
            throw new IllegalArgumentException("You can only edit your own posts");
        }

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            post.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            post.setDescription(request.getDescription());
        }
        if (request.getImageUrl() != null && !request.getImageUrl().isBlank()) {
            post.setImageUrl(request.getImageUrl());
        }
        if (request.getCategory() != null) {
            post.setCategory(request.getCategory());
        }

        post = postRepository.save(post);
        return mapToResponse(post, username);
    }

    public void deletePost(Long id, String username) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));

        if (!post.getUser().getUsername().equals(username)) {
            throw new IllegalArgumentException("You can only delete your own posts");
        }

        postRepository.delete(post);
    }

    public List<PostResponse> searchPosts(String query, String currentUsername) {
        List<Post> posts = postRepository.searchPosts(query);
        return posts.stream()
                .map(post -> mapToResponse(post, currentUsername))
                .collect(Collectors.toList());
    }

    public List<PostResponse> getPostsByCategory(String category, String currentUsername) {
        List<Post> posts = postRepository.findByCategoryIgnoreCaseOrderByCreatedAtDesc(category);
        return posts.stream()
                .map(post -> mapToResponse(post, currentUsername))
                .collect(Collectors.toList());
    }

    public List<PostResponse> getPostsByUser(Long userId, String currentUsername) {
        List<Post> posts = postRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return posts.stream()
                .map(post -> mapToResponse(post, currentUsername))
                .collect(Collectors.toList());
    }

    private PostResponse mapToResponse(Post post, String currentUsername) {
        boolean isSaved = false;
        if (currentUsername != null) {
            User currentUser = userRepository.findByUsername(currentUsername).orElse(null);
            if (currentUser != null) {
                isSaved = savedPostRepository.existsByUserIdAndPostId(currentUser.getId(), post.getId());
            }
        }

        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .description(post.getDescription())
                .imageUrl(post.getImageUrl())
                .category(post.getCategory())
                .createdAt(post.getCreatedAt())
                .userId(post.getUser().getId())
                .username(post.getUser().getUsername())
                .userProfileImage(post.getUser().getProfileImage())
                .saved(isSaved)
                .build();
    }
}
