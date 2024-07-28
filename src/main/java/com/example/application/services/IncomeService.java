package com.example.application.services;

import com.example.application.data.IncomeCategory;
import com.example.application.data.IncomeEntity;

import java.math.BigDecimal;
import java.util.List;

public interface IncomeService {
    // TODO: map to DTO
    List<IncomeEntity> getAll();

    void deleteIncome(String id);

    IncomeEntity create(String amount, String category);
}
