package com.example.application.data;

import java.util.HashMap;
import java.util.Map;

public enum IncomeCategory {
    SALARY("Salary"),
    SAVINGS("Savings"),
    DEPOSIT("Deposit"),
    BONUS("Bonus"),
    INTEREST("Interest"),
    DIVIDEND("Dividend"),
    GIFT("Gift"),
    PENSION("Pension"),
    SCHOLARSHIP("Scholarship"),
    OTHER("Other");

    private static final Map<String, IncomeCategory> INCOMES_BY_REPRESENTATION = new HashMap<>();

    static {
        for (IncomeCategory category : IncomeCategory.values()) {
            INCOMES_BY_REPRESENTATION.put(category.getRepresentation(), category);
        }
    }

    private final String representation;


    IncomeCategory(String representation) {
        this.representation = representation;
    }

    public String getRepresentation() {
        return representation;
    }

    public static IncomeCategory fromRepresentation(String representation) {
        IncomeCategory category = INCOMES_BY_REPRESENTATION.get(representation);

        if (category == null) {
            throw new IllegalArgumentException("No enum constant with representation " + representation);
        }

        return category;
    }
}
