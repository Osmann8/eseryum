package com.eseryum.media.common.dto;

import com.eseryum.media.common.entity.MediaType;
import com.eseryum.media.common.identity.MediaProvider;
import java.time.Instant;
import java.time.LocalDate;

public record MediaResponse(
        Long id,
        String title,
        String originalTitle,
        String description,
        MediaType type,
        MediaProvider provider,
        String externalId,
        LocalDate releaseDate,
        String posterUrl,
        String backdropUrl,
        Instant createdAt,
        Instant updatedAt
) {
}
