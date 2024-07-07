package com.example.application.services;

import com.example.application.data.Income;
import com.example.application.data.IncomeCategory;
import com.example.application.repository.IncomeRepository;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class MongoInitializr {

    private final IncomeRepository incomeRepository;

    public MongoInitializr(IncomeRepository incomeRepository) {
        this.incomeRepository = incomeRepository;

        if (incomeRepository.count() == 0) {
            initIncomes();
        }
    }

    private void initIncomes() {
        Income i1 = new Income()
                .setAmount(BigDecimal.valueOf(2100.90))
                .setCategory(IncomeCategory.SALARY)
                .setDate(LocalDateTime.now());
        i1.setId(1L);
        incomeRepository.save(i1);

        Income i2 = new Income()
                .setAmount(BigDecimal.valueOf(970.90))
                .setCategory(IncomeCategory.SAVINGS)
                .setDate(LocalDateTime.now());
        i2.setId(2L);
        incomeRepository.save(i2);
    }
}
