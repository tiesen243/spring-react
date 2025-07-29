package com.yuki.api.entity;

import java.time.LocalDateTime;

public class Post {

  private Long id;
  private String title;
  private String content;
  private LocalDateTime createdAt;

  public Post() {}

  public Post(String title, String content) {
    this.title = title;
    this.content = content;
    this.createdAt = LocalDateTime.now();
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }
}
