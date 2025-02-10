package com.example.application.services;

import com.example.application.dto.TransactionDto;

import java.math.BigDecimal;
import java.util.List;

public interface IncomeService {
    List<TransactionDto> getAll();

    TransactionDto addIncome(BigDecimal amount, String currencyCode, String category, String document, boolean unusual);

    TransactionDto editIncome(String id, BigDecimal amount, String currencyCode, String category, String document, boolean unusual);

    void deleteIncome(String id);

    void deleteIncomeDocument(String id);

    List<TransactionDto> getAllIncomesByDatesBetween(String startDate, String endDate);

}
