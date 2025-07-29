package com.yuki.api.service;

import com.yuki.api.entity.Post;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Service;

@Service
public class PostService {

  private final List<Post> posts;
  private final AtomicLong idGenerator;

  public PostService() {
    this.posts = new ArrayList<>();
    this.idGenerator = new AtomicLong(1);

    initializeMockData();
  }

  private void initializeMockData() {
    createPost("First Post", "This is the content of the first post");
    createPost("Second Post", "This is the content of the second post");
    createPost("Third Post", "This is the content of the third post");
  }

  public Post createPost(String title, String content) {
    Post post = new Post();
    post.setId(idGenerator.getAndIncrement());
    post.setTitle(title);
    post.setContent(content);
    post.setCreatedAt(LocalDateTime.now());
    posts.add(post);
    return post;
  }

  public List<Post> getAllPosts() {
    return new ArrayList<>(posts);
  }

  public Optional<Post> getPostById(Long id) {
    return posts.stream().filter(post -> post.getId().equals(id)).findFirst();
  }

  public Post updatePost(Long id, String title, String content) {
    Optional<Post> existingPost = getPostById(id);
    if (existingPost.isPresent()) {
      Post post = existingPost.get();
      post.setTitle(title);
      post.setContent(content);
      return post;
    }
    throw new RuntimeException("Post not found with id: " + id);
  }

  public void deletePost(Long id) {
    boolean removed = posts.removeIf(post -> post.getId().equals(id));
    if (!removed) {
      throw new RuntimeException("Post not found with id: " + id);
    }
  }

  public int getPostCount() {
    return posts.size();
  }

  public void clearAllPosts() {
    posts.clear();
    idGenerator.set(1);
  }
}
