package com.example.application.services;

import com.example.application.data.Income;
import com.example.application.repository.IncomeRepository;
import com.vaadin.hilla.BrowserCallable;
import jakarta.annotation.security.PermitAll;
import org.springframework.stereotype.Service;

import java.util.List;

@BrowserCallable
@PermitAll
@Service
public class IncomeService implements IncomeServiceIfc {
    private final IncomeRepository repository;

    public IncomeService(IncomeRepository repository) {
        this.repository = repository;
    }

    // TODO: map to DTO
    @Override
    public List<Income> getAll() {
        return repository.findAll();
    }
}
