package com.example.application.services;

import com.example.application.data.*;
import com.example.application.dto.DocumentDto;
import com.example.application.dto.TransactionDto;
import com.example.application.exception.ResourceNotFoundException;
import com.example.application.repository.DocumentRepository;
import com.example.application.repository.ExpenseRepository;
import com.example.application.repository.IncomeRepository;
import com.example.application.security.AuthenticatedUser;
import com.vaadin.hilla.BrowserCallable;
import jakarta.annotation.security.PermitAll;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@BrowserCallable
@PermitAll
@Service
public class ExpenseServiceImpl implements ExpenseService {
    private final AuthenticatedUser authenticatedUser;
    private final ExpenseRepository expenseRepository;
    private final DocumentRepository documentRepository;

    public ExpenseServiceImpl(AuthenticatedUser authenticatedUser, ExpenseRepository expenseRepository, DocumentRepository documentRepository) {
        this.authenticatedUser = authenticatedUser;
        this.expenseRepository = expenseRepository;
        this.documentRepository = documentRepository;
    }

    @Override
    public List<TransactionDto> getAll() {
        return expenseRepository
                .findAllByUser(authenticatedUser.get().orElseThrow())
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }


    @Override
    public List<TransactionDto> getAllByDatesBetween(String startDate, String endDate) {
        String[] startDateTokens = startDate.split("-");
        int startDateYear = Integer.parseInt(startDateTokens[0]);
        int startDateMonth = Integer.parseInt(startDateTokens[1]);
        int startDateDay = Integer.parseInt(startDateTokens[2]);

        String[] endDateTokens = endDate.split("-");
        int endDateYear = Integer.parseInt(endDateTokens[0]);
        int endDateMonth = Integer.parseInt(endDateTokens[1]);
        int endDateDay = Integer.parseInt(endDateTokens[2]);

        return expenseRepository
                .findAllByUserAndDateBetween(authenticatedUser.get().orElseThrow(),
                        LocalDateTime.of(startDateYear, startDateMonth, startDateDay, 0, 0),
                        LocalDateTime.of(endDateYear, endDateMonth, endDateDay, 23, 59)
                )
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private TransactionDto toDto(ExpenseEntity e) {
        return new TransactionDto()
                .setId(e.getId())
                .setAmount(e.getAmount())
                .setCategory(e.getCategory().getRepresentation())
                .setCurrency(e.getCurrency().getRepresentation())
                .setDate(e.getDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm:ss")))
                .setUnusual(e.isUnusual())
                .setDocument(e.getDocument() == null ? null : new DocumentDto().setId(e.getDocument().getId()).setContent(e.getDocument().getContent()));
    }

    @Override
    public ExpenseEntity addExpense(BigDecimal amount, String currencyCode, String category, String document, boolean unusual) {
        ExpenseEntity expense = new ExpenseEntity()
                .setAmount(amount)
                .setCurrency(CurrencyCode.fromRepresentation(currencyCode))
                .setCategory(ExpenseCategory.fromRepresentation(category))
                .setDate(LocalDateTime.now())
                .setUnusual(unusual)
                .setUser(authenticatedUser.get().orElseThrow());

        if(document != null && !document.isEmpty()) {
            DocumentEntity documentEntity = new DocumentEntity(document);
            expense.setDocument(documentEntity);
            documentRepository.save(documentEntity);
        }

        return expenseRepository.save(expense);
    }

    @Override
    public ExpenseEntity editExpense(String id, BigDecimal amount, String currencyCode, String category, String document, boolean unusual) {
        ExpenseEntity expenseEntity = expenseRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Expense with id %s not found.", id)));

        expenseEntity
                .setAmount(amount)
                .setCurrency(CurrencyCode.fromRepresentation(currencyCode))
                .setCategory(ExpenseCategory.fromRepresentation(category))
                .setUnusual(unusual);

        if(document != null && !document.isEmpty()) {

            DocumentEntity previousDocument = expenseEntity.getDocument();

            if (previousDocument != null) {
                documentRepository.delete(previousDocument);
            }

            DocumentEntity documentEntity = new DocumentEntity(document);
            expenseEntity.setDocument(documentEntity);
            documentRepository.save(documentEntity);
        }

        return expenseRepository.save(expenseEntity);
    }

    @Override
    public void deleteExpense(String id) {
        expenseRepository.deleteById(id);
    }

    @Override
    public void deleteExpenseDocument(String id) {
        ExpenseEntity expenseEntity = expenseRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Expense with id %s not found.", id)));

        DocumentEntity document = expenseEntity.getDocument();

        if (document != null) {
            documentRepository.deleteById(document.getId());

            expenseEntity.setDocument(null);
            expenseRepository.save(expenseEntity);
        }
    }

}
