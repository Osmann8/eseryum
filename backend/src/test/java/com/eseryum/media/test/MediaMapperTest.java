package com.eseryum.media.test;

import static org.assertj.core.api.Assertions.assertThat;

import com.eseryum.media.dto.CreateMediaRequest;
import com.eseryum.media.dto.MediaResponse;
import com.eseryum.media.dto.UpdateMediaRequest;
import com.eseryum.media.entity.Media;
import com.eseryum.media.entity.MediaType;
import com.eseryum.media.mapper.MediaMapper;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

class MediaMapperTest {

    private final MediaMapper mediaMapper = Mappers.getMapper(MediaMapper.class);

    @Test
    void toEntity_shouldMapCreateRequest() {
        CreateMediaRequest request =
                new CreateMediaRequest(
                        "Dune",
                        "Dune",
                        "Bilim kurgu romanı",
                        MediaType.BOOK,
                        LocalDate.of(1965, 8, 1),
                        "https://example.com/poster.jpg",
                        null);

        Media media = mediaMapper.toEntity(request);

        assertThat(media.getTitle()).isEqualTo(request.title());
        assertThat(media.getOriginalTitle()).isEqualTo(request.originalTitle());
        assertThat(media.getDescription()).isEqualTo(request.description());
        assertThat(media.getType()).isEqualTo(request.type());
        assertThat(media.getReleaseDate()).isEqualTo(request.releaseDate());
        assertThat(media.getPosterUrl()).isEqualTo(request.posterUrl());
        assertThat(media.getBackdropUrl()).isEqualTo(request.backdropUrl());
    }

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

    @Test
    void updateEntity_shouldApplyRequestValues() {
        Media media =
                new Media(
                        "Eski başlık",
                        null,
                        null,
                        MediaType.FILM,
                        null,
                        null,
                        null);
        UpdateMediaRequest request =
                new UpdateMediaRequest(
                        "Yeni başlık",
                        "Original Title",
                        "Yeni açıklama",
                        MediaType.SERIES,
                        LocalDate.of(2026, 1, 1),
                        "https://example.com/new-poster.jpg",
                        "https://example.com/backdrop.jpg");

        mediaMapper.updateEntity(request, media);

        assertThat(media.getTitle()).isEqualTo(request.title());
        assertThat(media.getOriginalTitle()).isEqualTo(request.originalTitle());
        assertThat(media.getDescription()).isEqualTo(request.description());
        assertThat(media.getType()).isEqualTo(request.type());
        assertThat(media.getReleaseDate()).isEqualTo(request.releaseDate());
        assertThat(media.getPosterUrl()).isEqualTo(request.posterUrl());
        assertThat(media.getBackdropUrl()).isEqualTo(request.backdropUrl());
    }
}
