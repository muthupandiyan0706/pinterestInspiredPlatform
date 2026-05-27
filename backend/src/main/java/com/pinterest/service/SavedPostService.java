package com.pinterest.service;

import com.pinterest.dto.PostResponse;
import com.pinterest.entity.Post;
import com.pinterest.entity.SavedPost;
import com.pinterest.entity.User;
import com.pinterest.exception.ResourceNotFoundException;
import com.pinterest.repository.PostRepository;
import com.pinterest.repository.SavedPostRepository;
import com.pinterest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavedPostService {

    private final SavedPostRepository savedPostRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public void savePost(Long postId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        if (savedPostRepository.existsByUserIdAndPostId(user.getId(), postId)) {
            throw new IllegalArgumentException("Post is already saved");
        }

        SavedPost savedPost = SavedPost.builder()
                .user(user)
                .post(post)
                .build();

        savedPostRepository.save(savedPost);
    }

    @Transactional
    public void unsavePost(Long postId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!savedPostRepository.existsByUserIdAndPostId(user.getId(), postId)) {
            throw new ResourceNotFoundException("Saved post not found");
        }

        savedPostRepository.deleteByUserIdAndPostId(user.getId(), postId);
    }

    public List<PostResponse> getSavedPosts(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<SavedPost> savedPosts = savedPostRepository.findByUserIdOrderByIdDesc(user.getId());

        return savedPosts.stream()
                .map(sp -> mapToResponse(sp.getPost()))
                .collect(Collectors.toList());
    }

    private PostResponse mapToResponse(Post post) {
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
                .saved(true)
                .build();
    }
}
