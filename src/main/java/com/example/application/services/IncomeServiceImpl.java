package com.example.application.services;

import com.example.application.data.CurrencyCode;
import com.example.application.data.DocumentEntity;
import com.example.application.data.IncomeCategory;
import com.example.application.data.IncomeEntity;
import com.example.application.exception.ResourceNotFoundException;
import com.example.application.repository.DocumentRepository;
import com.example.application.repository.IncomeRepository;
import com.example.application.security.AuthenticatedUser;
import com.vaadin.hilla.BrowserCallable;
import jakarta.annotation.security.PermitAll;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@BrowserCallable
@PermitAll
@Service
public class IncomeServiceImpl implements IncomeService {
    private final AuthenticatedUser authenticatedUser;
    private final IncomeRepository incomeRepository;
    private final DocumentRepository documentRepository;

    public IncomeServiceImpl(IncomeRepository incomeRepository, AuthenticatedUser authenticatedUser, DocumentRepository documentRepository) {
        this.incomeRepository = incomeRepository;
        this.authenticatedUser = authenticatedUser;
        this.documentRepository = documentRepository;
    }

    @Override
    public List<IncomeEntity> getAll() {
        return new ArrayList<>(incomeRepository.findAllByUser(authenticatedUser.get().orElseThrow()));
    }

    @Override
    public IncomeEntity addIncome(BigDecimal amount, String currencyCode, String category, String document, boolean unusual) {
        IncomeEntity incomeEntity = new IncomeEntity()
                .setAmount(amount)
                .setCurrency(CurrencyCode.valueOf(currencyCode))
                .setCategory(IncomeCategory.valueOf(category))
                .setDate(LocalDateTime.now())
                .setUnusual(unusual)
                .setUser(authenticatedUser.get().orElseThrow());

        if(document != null && !document.isEmpty()) {
            DocumentEntity documentEntity = new DocumentEntity(document);
            incomeEntity.setDocument(documentEntity);
            documentRepository.save(documentEntity);
        }

        return incomeRepository.save(incomeEntity);
    }

    @Override
    public IncomeEntity editIncome(String id, BigDecimal amount, String currencyCode, String category, String document, boolean unusual) {
        IncomeEntity incomeEntity = incomeRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Income with id %s not found.", id)));

        incomeEntity
                .setAmount(amount)
                .setCurrency(CurrencyCode.valueOf(currencyCode))
                .setCategory(IncomeCategory.valueOf(category))
                .setUnusual(unusual);

        if(document != null && !document.isEmpty()) {

            DocumentEntity previousDocument = incomeEntity.getDocument();

            if (previousDocument != null) {
                documentRepository.delete(previousDocument);
            }

            DocumentEntity documentEntity = new DocumentEntity(document);
            incomeEntity.setDocument(documentEntity);
            documentRepository.save(documentEntity);
        }

        return incomeRepository.save(incomeEntity);
    }

    @Override
    public void deleteIncome(String incomeId) {
        incomeRepository.deleteById(incomeId);
    }

    @Override
    public void deleteIncomeDocument(String id) {
        IncomeEntity incomeEntity = incomeRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Income with id %s not found.", id)));

        DocumentEntity document = incomeEntity.getDocument();

        if (document != null) {
            documentRepository.deleteById(document.getId());

            incomeEntity.setDocument(null);
            incomeRepository.save(incomeEntity);
        }
    }
}
