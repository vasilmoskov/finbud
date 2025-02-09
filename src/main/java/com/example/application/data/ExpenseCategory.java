package com.example.application.data;

import java.util.HashMap;
import java.util.Map;

public enum ExpenseCategory {
    RENT("Rent"),
    GROCERIES("Groceries"),
    HEALTHCARE("Healthcare"),
    ENTERTAINMENT("Entertainment"),
    TRAVEL("Travel"),
    EDUCATION("Education"),
    CLOTHING("Clothing"),
    GIFT("Gift"),
    TAXES("Taxes"),
    OTHER("Other");

    private static final Map<String, ExpenseCategory> EXPENSES_BY_REPRESENTATION = new HashMap<>();

    static {
        for (ExpenseCategory category : ExpenseCategory.values()) {
            EXPENSES_BY_REPRESENTATION.put(category.getRepresentation(), category);
        }
    }

    private final String representation;


    ExpenseCategory(String representation) {
        this.representation = representation;
    }

    public String getRepresentation() {
        return representation;
    }

    public static ExpenseCategory fromRepresentation(String representation) {
        ExpenseCategory category = EXPENSES_BY_REPRESENTATION.get(representation);

        if (category == null) {
            throw new IllegalArgumentException("No enum constant with representation " + representation);
        }

        return category;
    }
}
