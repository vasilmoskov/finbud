package com.example.application.services;

import com.example.application.data.IncomeEntity;
import com.example.application.dto.TransactionDto;

import java.math.BigDecimal;
import java.util.List;

public interface IncomeService {
    List<IncomeEntity> getAll();

    IncomeEntity addIncome(BigDecimal amount, String currencyCode, String category, String document, boolean unusual);

    IncomeEntity editIncome(String id, BigDecimal amount, String currencyCode, String category, String document, boolean unusual);

    void deleteIncome(String id);

    void deleteIncomeDocument(String id);

    List<TransactionDto> getAllIncomesByDatesBetween(String startDate, String endDate);

}
