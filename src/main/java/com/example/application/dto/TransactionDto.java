package com.example.application.dto;

import com.mongodb.lang.Nullable;

import java.math.BigDecimal;

public class TransactionDto {
    String id;
    BigDecimal amount;
    String currency;
    String category;
    String date;
    @Nullable
    DocumentDto document;
    boolean unusual;

    public String getId() {
        return id;
    }

    public TransactionDto setId(String id) {
        this.id = id;
        return this;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public TransactionDto setAmount(BigDecimal amount) {
        this.amount = amount;
        return this;
    }

    public String getCurrency() {
        return currency;
    }

    public TransactionDto setCurrency(String currency) {
        this.currency = currency;
        return this;
    }

    public String getCategory() {
        return category;
    }

    public TransactionDto setCategory(String category) {
        this.category = category;
        return this;
    }

    public String getDate() {
        return date;
    }

    public TransactionDto setDate(String date) {
        this.date = date;
        return this;
    }

    public DocumentDto getDocument() {
        return document;
    }

    public TransactionDto setDocument(DocumentDto document) {
        this.document = document;
        return this;
    }

    public boolean isUnusual() {
        return unusual;
    }

    public TransactionDto setUnusual(boolean unusual) {
        this.unusual = unusual;
        return this;
    }
}
