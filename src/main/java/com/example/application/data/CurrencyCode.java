package com.example.application.data;

import java.util.HashMap;
import java.util.Map;

public enum CurrencyCode {
    BGN("лв."),
    EUR("€"),
    USD("$"),
    GBP("£"),
    OTHER("Other");

    private static final Map<String, CurrencyCode> CURRENCIES_BY_REPRESENTATION = new HashMap<>();

    static {
        for (CurrencyCode category : CurrencyCode.values()) {
            CURRENCIES_BY_REPRESENTATION.put(category.getRepresentation(), category);
        }
    }

    private final String representation;


    CurrencyCode(String representation) {
        this.representation = representation;
    }

    public String getRepresentation() {
        return representation;
    }

    public static CurrencyCode fromRepresentation(String representation) {
        CurrencyCode category = CURRENCIES_BY_REPRESENTATION.get(representation);

        if (category == null) {
            throw new IllegalArgumentException("No enum constant with representation " + representation);
        }

        return category;
    }
}
