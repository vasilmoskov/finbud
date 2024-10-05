package com.example.application.services;

import com.example.application.data.IncomeEntity;

import java.util.List;

public interface IncomeService {
    // TODO: map to DTO
    List<IncomeEntity> getAll();

    IncomeEntity addIncome(String amount, String category);

    IncomeEntity editIncome(String id, String amount, String category);

    void deleteIncome(String id);

}
