package com.example.application.data;

import com.mongodb.lang.Nullable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document("income")
public class IncomeEntity extends AbstractEntity<IncomeEntity> {
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private CurrencyCode currency;

    @Enumerated(EnumType.STRING)
    private IncomeCategory category;

    private LocalDateTime date;

    @Nullable
    private DocumentEntity document;

    private boolean unusual;

    private UserEntity user;

    public BigDecimal getAmount() {
        return amount;
    }

    public IncomeEntity setAmount(BigDecimal amount) {
        this.amount = amount;
        return this;
    }

    public CurrencyCode getCurrency() {
        return currency;
    }

    public IncomeEntity setCurrency(CurrencyCode currency) {
        this.currency = currency;
        return this;
    }

    public IncomeCategory getCategory() {
        return category;
    }

    public IncomeEntity setCategory(IncomeCategory category) {
        this.category = category;
        return this;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public IncomeEntity setDate(LocalDateTime date) {
        this.date = date;
        return this;
    }

    public DocumentEntity getDocument() {
        return document;
    }

    public IncomeEntity setDocument(DocumentEntity document) {
        this.document = document;
        return this;
    }

    public boolean isUnusual() {
        return unusual;
    }

    public IncomeEntity setUnusual(boolean unusual) {
        this.unusual = unusual;
        return this;
    }

    public UserEntity getUser() {
        return user;
    }

    public IncomeEntity setUser(UserEntity user) {
        this.user = user;
        return this;
    }
}
