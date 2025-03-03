package com.example.application.data;

import com.mongodb.lang.Nullable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document("expenses")
public class ExpenseEntity extends AbstractEntity<ExpenseEntity> {
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private CurrencyCode currency;

    @Enumerated(EnumType.STRING)
    private ExpenseCategory category;

    private LocalDateTime date;

    @Nullable
    private DocumentEntity document;

    private boolean unusual;

    private UserEntity user;

    public BigDecimal getAmount() {
        return amount;
    }

    public ExpenseEntity setAmount(BigDecimal amount) {
        this.amount = amount;
        return this;
    }

    public CurrencyCode getCurrency() {
        return currency;
    }

    public ExpenseEntity setCurrency(CurrencyCode currency) {
        this.currency = currency;
        return this;
    }

    public ExpenseCategory getCategory() {
        return category;
    }

    public ExpenseEntity setCategory(ExpenseCategory category) {
        this.category = category;
        return this;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public ExpenseEntity setDate(LocalDateTime date) {
        this.date = date;
        return this;
    }

    public DocumentEntity getDocument() {
        return document;
    }

    public ExpenseEntity setDocument(DocumentEntity document) {
        this.document = document;
        return this;
    }

    public boolean isUnusual() {
        return unusual;
    }

    public ExpenseEntity setUnusual(boolean unusual) {
        this.unusual = unusual;
        return this;
    }

    public UserEntity getUser() {
        return user;
    }

    public ExpenseEntity setUser(UserEntity user) {
        this.user = user;
        return this;
    }
}
