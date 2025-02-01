package com.example.application.repository;

import com.example.application.data.DocumentEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DocumentRepository extends MongoRepository<DocumentEntity, String> {

}
