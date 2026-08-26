package com.eseryum.media.common.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import java.util.Locale;

public enum MediaType {
    film,
    series,
    book;

    public static final MediaType FILM = film;
    public static final MediaType SERIES = series;
    public static final MediaType BOOK = book;

    @JsonCreator
    public static MediaType fromApiValue(String value) {
        return valueOf(value.toLowerCase(Locale.ROOT));
    }

    @JsonValue
    public String toApiValue() {
        return name().toUpperCase(Locale.ROOT);
    }
}
