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
        return repository.findAllByUser(authenticatedUser.get().orElseThrow());
    }

    @Override
    public IncomeEntity addIncome(String amount, String currencyCode, String category) {
        IncomeEntity incomeEntity = new IncomeEntity()
                .setAmount(new BigDecimal(amount))
                .setCurrency(CurrencyCode.valueOf(currencyCode))
                .setUser(authenticatedUser.get().orElseThrow())
                .setDate(LocalDateTime.now())
                .setCategory(IncomeCategory.valueOf(category));

        return repository.save(incomeEntity);
    }

    @Override
    public IncomeEntity editIncome(String id, String amount, String currencyCode, String category) {
        IncomeEntity incomeEntity = repository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Income with id %s not found.", id)));

        incomeEntity
                .setAmount(new BigDecimal(amount))
                .setCurrency(CurrencyCode.valueOf(currencyCode))
                .setCategory(IncomeCategory.valueOf(category));

        return repository.save(incomeEntity);
    }

    @Override
    public void deleteIncome(String incomeId) {
        repository.deleteById(incomeId);
    }
}
