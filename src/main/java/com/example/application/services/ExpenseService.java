package com.example.application.services;

import com.example.application.dto.TransactionDto;

import java.math.BigDecimal;
import java.util.List;

public interface ExpenseService {

    List<TransactionDto> getAll();

    TransactionDto addExpense(BigDecimal amount, String currencyCode, String category, String document, boolean unusual);

    TransactionDto editExpense(String id, BigDecimal amount, String currencyCode, String category, String document, boolean unusual);

    void deleteExpense(String id);

    void deleteExpenseDocument(String id);

    List<TransactionDto> getAllExpensesByDatesBetween(String startDate, String endDate);
}
