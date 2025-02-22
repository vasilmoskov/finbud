package com.example.application.repository;

import com.example.application.data.UserEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<UserEntity, Long> {
    boolean existsByUsername(String username);

    UserEntity findByUsername(String username);
}
