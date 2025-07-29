package com.yuki.api.controller;

import com.yuki.api.dto.PostDto;
import com.yuki.api.entity.Post;
import com.yuki.api.service.PostService;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/post")
public class PostController {
  private final PostService postService;

  @Autowired
  public PostController(PostService postService) {
    this.postService = postService;
  }

  @GetMapping
  public ResponseEntity<List<Post>> getAllPosts() {
    List<Post> posts = postService.getAllPosts();
    return ResponseEntity.ok(posts);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Post> getPostById(@PathVariable Long id) {
    Optional<Post> post = postService.getPostById(id);
    return post.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Post> createPost(@RequestBody PostDto.CreatePostRequest request) {
    try {
      Post post = postService.createPost(request.getTitle(), request.getContent());
      return ResponseEntity.status(HttpStatus.CREATED).body(post);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
  }

  @PutMapping("/{id}")
  public ResponseEntity<Post> updatePost(
      @PathVariable Long id, @RequestBody PostDto.UpdatePostRequest request) {
    try {
      Post updatedPost = postService.updatePost(id, request.getTitle(), request.getContent());
      return ResponseEntity.ok(updatedPost);
    } catch (RuntimeException e) {
      return ResponseEntity.notFound().build();
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deletePost(@PathVariable Long id) {
    try {
      postService.deletePost(id);
      return ResponseEntity.noContent().build();
    } catch (RuntimeException e) {
      return ResponseEntity.notFound().build();
    }
  }

  @GetMapping("/count")
  public ResponseEntity<Integer> getPostCount() {
    int count = postService.getPostCount();
    return ResponseEntity.ok(count);
  }

  @DeleteMapping
  public ResponseEntity<Void> clearAllPosts() {
    postService.clearAllPosts();
    return ResponseEntity.noContent().build();
  }
}
