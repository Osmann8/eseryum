package com.eseryum.media.test;

import static org.assertj.core.api.Assertions.assertThat;

import com.eseryum.media.common.dto.MediaResponse;
import com.eseryum.media.common.entity.Media;
import com.eseryum.media.common.entity.MediaType;
import com.eseryum.media.common.mapper.MediaMapper;
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
                        LocalDate.of(1965, 8, 1),
                        "https://example.com/poster.jpg",
                        null);

        MediaResponse response = mediaMapper.toResponse(media);

        assertThat(response.title()).isEqualTo(media.getTitle());
        assertThat(response.originalTitle()).isEqualTo(media.getOriginalTitle());
        assertThat(response.description()).isEqualTo(media.getDescription());
        assertThat(response.type()).isEqualTo(media.getType());
        assertThat(response.releaseDate()).isEqualTo(media.getReleaseDate());
        assertThat(response.posterUrl()).isEqualTo(media.getPosterUrl());
        assertThat(response.backdropUrl()).isEqualTo(media.getBackdropUrl());
    }

}
