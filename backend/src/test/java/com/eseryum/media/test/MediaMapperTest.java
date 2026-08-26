package com.eseryum.media.test;

import static org.assertj.core.api.Assertions.assertThat;

import com.eseryum.media.common.dto.MediaResponse;
import com.eseryum.media.common.entity.Media;
import com.eseryum.media.common.entity.MediaType;
import com.eseryum.media.common.mapper.MediaMapper;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

class MediaMapperTest {

    private final MediaMapper mediaMapper = Mappers.getMapper(MediaMapper.class);

    @Test
    void toResponse_shouldMapEntity() {
        Media media =
                new Media(
                        MediaType.BOOK,
                        "Dune",
                        "Dune",
                        (short) 1965,
                        "https://example.com/cover.jpg",
                        "Bilim kurgu romanı",
                        new BigDecimal("8.50"),
                        42);

        MediaResponse response = mediaMapper.toResponse(media);

        assertThat(response.mediaType()).isEqualTo(media.getMediaType());
        assertThat(response.title()).isEqualTo(media.getTitle());
        assertThat(response.originalTitle()).isEqualTo(media.getOriginalTitle());
        assertThat(response.releaseYear()).isEqualTo(media.getReleaseYear());
        assertThat(response.coverUrl()).isEqualTo(media.getCoverUrl());
        assertThat(response.synopsis()).isEqualTo(media.getSynopsis());
        assertThat(response.ratingAvg()).isEqualTo(media.getRatingAvg());
        assertThat(response.ratingCount()).isEqualTo(media.getRatingCount());
    }

}
