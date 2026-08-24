package com.eseryum.media.test;

import static org.assertj.core.api.Assertions.assertThat;

import com.eseryum.media.entity.Media;
import com.eseryum.media.entity.MediaType;
import com.eseryum.media.identity.MediaIdentity;
import com.eseryum.media.identity.MediaProvider;
import com.eseryum.media.repository.MediaRepository;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@Testcontainers
@Transactional
class MediaRepositoryIntegrationTest {

    @Container
    static final PostgreSQLContainer<?> POSTGRES =
            new PostgreSQLContainer<>("postgres:16-alpine");

    @DynamicPropertySource
    static void datasourceProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }

    @Autowired private MediaRepository mediaRepository;

    @Test
    void save_shouldPersistMediaWithAuditFields() {
        Media media = createMedia("Dune", MediaType.BOOK);

        Media savedMedia = mediaRepository.saveAndFlush(media);

        assertThat(savedMedia.getId()).isNotNull();
        assertThat(savedMedia.getCreatedAt()).isNotNull();
        assertThat(savedMedia.getUpdatedAt()).isNotNull();
        assertThat(mediaRepository.findById(savedMedia.getId())).contains(savedMedia);
    }

    @Test
    void searchByTitle_shouldMatchTitleAndOriginalTitleIgnoringCase() {
        mediaRepository.save(createMedia("Dune", MediaType.BOOK));
        mediaRepository.save(
                new Media(
                        "Geliş",
                        "Arrival",
                        "Test açıklaması",
                        MediaType.FILM,
                        new MediaIdentity(MediaProvider.TMDB, "arrival"),
                        LocalDate.of(2016, 1, 1),
                        "https://example.com/arrival.jpg",
                        null));
        mediaRepository.flush();

        Page<Media> titleResult = mediaRepository.searchByTitle("dUn", PageRequest.of(0, 20));
        Page<Media> originalTitleResult =
                mediaRepository.searchByTitle("ARRIVAL", PageRequest.of(0, 20));

        assertThat(titleResult.getContent()).extracting(Media::getTitle).containsExactly("Dune");
        assertThat(originalTitleResult.getContent())
                .extracting(Media::getTitle)
                .containsExactly("Geliş");
    }

    private Media createMedia(String title, MediaType type) {
        return new Media(
                title,
                title,
                "Test açıklaması",
                type,
                new MediaIdentity(
                        MediaProvider.GOOGLE_BOOKS,
                        title.toLowerCase().replace(" ", "-")),
                LocalDate.of(2020, 1, 1),
                "https://example.com/poster.jpg",
                null);
    }
}
