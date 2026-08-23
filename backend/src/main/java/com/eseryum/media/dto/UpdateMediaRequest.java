package com.eseryum.media.dto;

import com.eseryum.media.entity.MediaType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record UpdateMediaRequest(
        @NotBlank
        @Size(max = 300)
        String title,

        @Size(max = 300)
        String originalTitle,

        @Size(max = 10000)
        String description,

        @NotNull
        MediaType type,

        LocalDate releaseDate,

        @Size(max = 2048)
        String posterUrl,

        @Size(max = 2048)
        String backdropUrl
) {
}
