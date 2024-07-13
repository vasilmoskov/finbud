package com.example.application.services;

import com.example.application.data.IncomeEntity;
import com.example.application.repository.IncomeRepository;
import com.example.application.security.AuthenticatedUser;
import com.vaadin.hilla.BrowserCallable;
import jakarta.annotation.security.PermitAll;
import org.springframework.stereotype.Service;

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
    public void deleteIncome(Long incomeId) {
        repository.deleteById(incomeId);
    }
}
