package com.example.application.data;

import org.springframework.data.mongodb.core.mapping.Document;

@Document("documents")
public class DocumentEntity extends AbstractEntity<DocumentEntity> {
    private String content;

    public DocumentEntity(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
