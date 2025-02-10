package com.example.application.services;

import com.example.application.data.*;
import com.example.application.dto.DocumentDto;
import com.example.application.dto.TransactionDto;
import com.example.application.exception.ResourceNotFoundException;
import com.example.application.repository.DocumentRepository;
import com.example.application.repository.IncomeRepository;
import com.example.application.security.AuthenticatedUser;
import com.vaadin.hilla.BrowserCallable;
import jakarta.annotation.security.PermitAll;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
    public List<TransactionDto> getAll() {
        return incomeRepository
                .findAllByUser(authenticatedUser.get().orElseThrow())
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public TransactionDto addIncome(BigDecimal amount, String currencyCode, String category, String document, boolean unusual) {
        IncomeEntity incomeEntity = new IncomeEntity()
                .setAmount(amount)
                .setCurrency(CurrencyCode.fromRepresentation(currencyCode))
                .setCategory(IncomeCategory.fromRepresentation(category))
                .setDate(LocalDateTime.now())
                .setUnusual(unusual)
                .setUser(authenticatedUser.get().orElseThrow());

        if (document != null && !document.isEmpty()) {
            DocumentEntity documentEntity = new DocumentEntity(document);
            incomeEntity.setDocument(documentEntity);
            documentRepository.save(documentEntity);
        }

        return toDto(incomeRepository.save(incomeEntity));
    }

    @Override
    public TransactionDto editIncome(String id, BigDecimal amount, String currencyCode, String category, String document, boolean unusual) {
        IncomeEntity incomeEntity = incomeRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Income with id %s not found.", id)));

        incomeEntity
                .setAmount(amount)
                .setCurrency(CurrencyCode.valueOf(currencyCode))
                .setCategory(IncomeCategory.valueOf(category))
                .setUnusual(unusual);

        if (document != null && !document.isEmpty()) {

            DocumentEntity previousDocument = incomeEntity.getDocument();

            if (previousDocument != null) {
                documentRepository.delete(previousDocument);
            }

            DocumentEntity documentEntity = new DocumentEntity(document);
            incomeEntity.setDocument(documentEntity);
            documentRepository.save(documentEntity);
        }

        return toDto(incomeRepository.save(incomeEntity));
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

    @Override
    public List<TransactionDto> getAllIncomesByDatesBetween(String startDate, String endDate) {
        String[] startDateTokens = startDate.split("-");
        int startDateYear = Integer.parseInt(startDateTokens[0]);
        int startDateMonth = Integer.parseInt(startDateTokens[1]);
        int startDateDay = Integer.parseInt(startDateTokens[2]);

        String[] endDateTokens = endDate.split("-");
        int endDateYear = Integer.parseInt(endDateTokens[0]);
        int endDateMonth = Integer.parseInt(endDateTokens[1]);
        int endDateDay = Integer.parseInt(endDateTokens[2]);

        return incomeRepository
                .findAllByUserAndDateBetween(authenticatedUser.get().orElseThrow(),
                        LocalDateTime.of(startDateYear, startDateMonth, startDateDay, 0, 0),
                        LocalDateTime.of(endDateYear, endDateMonth, endDateDay, 23, 59)
                )
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private TransactionDto toDto(IncomeEntity e) {
        return new TransactionDto()
                .setId(e.getId())
                .setAmount(e.getAmount())
                .setCategory(e.getCategory().getRepresentation())
                .setCurrency(e.getCurrency().getRepresentation())
                .setDate(e.getDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm:ss")))
                .setUnusual(e.isUnusual())
                .setDocument(e.getDocument() == null ? null : new DocumentDto().setId(e.getDocument().getId()).setContent(e.getDocument().getContent()));
    }
}
