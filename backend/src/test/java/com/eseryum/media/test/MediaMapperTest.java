package com.eseryum.media.test;

import static org.assertj.core.api.Assertions.assertThat;

import com.eseryum.media.dto.MediaResponse;
import com.eseryum.media.entity.Media;
import com.eseryum.media.entity.MediaType;
import com.eseryum.media.identity.MediaIdentity;
import com.eseryum.media.identity.MediaProvider;
import com.eseryum.media.mapper.MediaMapper;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

class MediaMapperTest {

    private final MediaMapper mediaMapper = Mappers.getMapper(MediaMapper.class);

    @Test
    void toResponse_shouldMapEntity() {
        Media media =
                new Media(
                        "Dune",
                        "Dune",
                        "Bilim kurgu romanı",
                        MediaType.BOOK,
                        new MediaIdentity(MediaProvider.GOOGLE_BOOKS, "dune-volume-id"),
                        LocalDate.of(1965, 8, 1),
                        "https://example.com/poster.jpg",
                        null);

        MediaResponse response = mediaMapper.toResponse(media);

        assertThat(response.title()).isEqualTo(media.getTitle());
        assertThat(response.originalTitle()).isEqualTo(media.getOriginalTitle());
        assertThat(response.description()).isEqualTo(media.getDescription());
        assertThat(response.type()).isEqualTo(media.getType());
        assertThat(response.provider()).isEqualTo(media.getIdentity().getProvider());
        assertThat(response.externalId()).isEqualTo(media.getIdentity().getExternalId());
        assertThat(response.releaseDate()).isEqualTo(media.getReleaseDate());
        assertThat(response.posterUrl()).isEqualTo(media.getPosterUrl());
        assertThat(response.backdropUrl()).isEqualTo(media.getBackdropUrl());
    }

}
