package com.example.application.repository;

import com.example.application.data.UserEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

// TODO: extend JpaSpecificationExecutor<UserEntity>?
public interface UserRepository extends MongoRepository<UserEntity, Long> {

    UserEntity findByUsername(String username);
}
