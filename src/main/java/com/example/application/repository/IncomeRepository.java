package com.example.application.repository;

import com.example.application.data.IncomeEntity;
import com.example.application.data.UserEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface IncomeRepository extends MongoRepository<IncomeEntity, String> {
    List<IncomeEntity> findAllByUser(UserEntity user);

    List<IncomeEntity> findAllByUserAndDateBetween(UserEntity user, LocalDateTime dateAfter, LocalDateTime dateBefore);
}
