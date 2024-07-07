package com.example.application.data;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import java.math.BigDecimal;
import java.time.LocalDateTime;

//@Entity
//@Table(name = "incomes")
public class Income extends AbstractEntity {
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private IncomeCategory category;

    private LocalDateTime date;

    public BigDecimal getAmount() {
        return amount;
    }

    public Income setAmount(BigDecimal amount) {
        this.amount = amount;
        return this;
    }

    public IncomeCategory getCategory() {
        return category;
    }

    public Income setCategory(IncomeCategory category) {
        this.category = category;
        return this;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public Income setDate(LocalDateTime date) {
        this.date = date;
        return this;
    }
}
