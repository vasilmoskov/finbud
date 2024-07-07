package com.example.application.services;

import com.example.application.data.IncomeEntity;
import com.example.application.repository.IncomeRepository;
import com.vaadin.hilla.BrowserCallable;
import jakarta.annotation.security.PermitAll;
import org.springframework.stereotype.Service;

import java.util.List;

@BrowserCallable
@PermitAll
@Service
public class IncomeServiceImpl implements IncomeService {
    private final IncomeRepository repository;

    public IncomeServiceImpl(IncomeRepository repository) {
        this.repository = repository;
    }

    // TODO: map to DTO
    @Override
    public List<IncomeEntity> getAll() {
        return repository.findAll();
    }
}
