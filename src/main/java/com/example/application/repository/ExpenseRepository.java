package com.example.application.repository;

import com.example.application.data.ExpenseEntity;
import com.example.application.data.UserEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ExpenseRepository extends MongoRepository<ExpenseEntity, String> {
    List<ExpenseEntity> findAllByUser(UserEntity user);

    List<ExpenseEntity> findAllByUserAndDateBetween(UserEntity user, LocalDateTime dateAfter, LocalDateTime dateBefore);
}
