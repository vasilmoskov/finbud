package com.example.application.services;

import com.example.application.data.CurrencyCode;
import com.example.application.data.IncomeCategory;
import com.example.application.data.IncomeEntity;
import com.example.application.exception.ResourceNotFoundException;
import com.example.application.repository.IncomeRepository;
import com.example.application.security.AuthenticatedUser;
import com.vaadin.hilla.BrowserCallable;
import jakarta.annotation.security.PermitAll;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@BrowserCallable
@PermitAll
@Service
public class IncomeServiceImpl implements IncomeService {
    private final IncomeRepository repository;
    private final AuthenticatedUser authenticatedUser;

    public IncomeServiceImpl(IncomeRepository repository, AuthenticatedUser authenticatedUser) {
        this.repository = repository;
        this.authenticatedUser = authenticatedUser;
    }

    // TODO: map to DTO
    @Override
    public List<IncomeEntity> getAll() {
        return repository.findAllByUser(authenticatedUser.get().orElseThrow())
        .stream()
        .map((i) -> {
            if (i.getDocument() == null) {
                i.setDocument("");
            }

            return i;
        }).collect(Collectors.toList());
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

        if(document != null) {
            incomeEntity.setDocument(document);
        }

        return repository.save(incomeEntity);
    }

    @Override
    public IncomeEntity editIncome(String id, BigDecimal amount, String currencyCode, String category, boolean unusual) {
        IncomeEntity incomeEntity = repository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Income with id %s not found.", id)));

        incomeEntity
                .setAmount(amount)
                .setCurrency(CurrencyCode.valueOf(currencyCode))
                .setCategory(IncomeCategory.valueOf(category))
                .setUnusual(unusual);

        return repository.save(incomeEntity);
    }

    @Override
    public void deleteIncome(String incomeId) {
        repository.deleteById(incomeId);
    }
}
