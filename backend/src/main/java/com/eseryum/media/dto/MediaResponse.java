package com.eseryum.media.dto;

import com.eseryum.media.entity.MediaType;
import java.math.BigDecimal;
import java.time.Instant;

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
