package com.example.application.services;

import com.example.application.data.ExpenseEntity;
import com.example.application.data.IncomeEntity;
import com.example.application.dto.TransactionDto;

import java.math.BigDecimal;
import java.util.List;

public interface ExpenseService {

    List<TransactionDto> getAll();

    ExpenseEntity addExpense(BigDecimal amount, String currencyCode, String category, String document, boolean unusual);

    ExpenseEntity editExpense(String id, BigDecimal amount, String currencyCode, String category, String document, boolean unusual);

    void deleteExpense(String id);

    void deleteExpenseDocument(String id);

    List<TransactionDto> getAllByDatesBetween(String startDate, String endDate);
}
