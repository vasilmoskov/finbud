package com.example.application.services;

import com.example.application.data.IncomeEntity;

import java.math.BigDecimal;
import java.util.List;

public interface IncomeService {
    // TODO: map to DTO
    List<IncomeEntity> getAll();

    IncomeEntity addIncome(BigDecimal amount, String currencyCode, String category, String document, boolean unusual);

    IncomeEntity editIncome(String id, BigDecimal amount, String currencyCode, String category, boolean unusual);

    void deleteIncome(String id);

}
