package com.eseryum.media.dto;

import com.eseryum.media.entity.MediaType;
import java.time.Instant;
import java.time.LocalDate;

public record MediaResponse(
        Long id,
        String title,
        String originalTitle,
        String description,
        MediaType type,
        LocalDate releaseDate,
        String posterUrl,
        String backdropUrl,
        Instant createdAt,
        Instant updatedAt
) {
}
