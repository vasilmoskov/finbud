package com.example.application.repository;

import com.example.application.data.Income;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface IncomeRepository extends MongoRepository<Income, Long> {
}
