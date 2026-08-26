package com.eseryum.media.common.dto;

import java.math.BigDecimal;
import java.time.Instant;

import com.eseryum.media.common.entity.MediaType;

public record MediaResponse(
        Long id,
        MediaType mediaType,
        String title,
        String originalTitle,
        Short releaseYear,
        String coverUrl,
        String synopsis,
        BigDecimal ratingAvg,
        int ratingCount,
        Instant createdAt,
        Instant updatedAt
) {
}
