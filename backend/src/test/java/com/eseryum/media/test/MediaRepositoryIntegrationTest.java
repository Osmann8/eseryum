package com.eseryum.media.test;

import static org.assertj.core.api.Assertions.assertThat;

import com.eseryum.media.common.entity.Media;
import com.eseryum.media.common.entity.MediaType;
import com.eseryum.media.common.repository.MediaRepository;

import java.math.BigDecimal;
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
                        MediaType.FILM,
                        "Geliş",
                        "Arrival",
                        (short) 2016,
                        "https://example.com/arrival.jpg",
                        "Test açıklaması",
                        new BigDecimal("8.00"),
                        10));
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
                type,
                title,
                title,
                (short) 2020,
                "https://example.com/cover.jpg",
                "Test açıklaması",
                null,
                0);
    }
}
