package com.example.application.dto;

public class DocumentDto {
    private String id;
    private String content;

    public String getId() {
        return id;
    }

    public DocumentDto setId(String id) {
        this.id = id;
        return this;
    }

    public String getContent() {
        return content;
    }

    public DocumentDto setContent(String content) {
        this.content = content;
        return this;
    }
}
