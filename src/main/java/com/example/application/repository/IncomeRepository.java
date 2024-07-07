package com.example.application.repository;

import com.example.application.data.IncomeEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface IncomeRepository extends MongoRepository<IncomeEntity, Long> {
}
