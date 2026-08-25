package com.eseryum.media.test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.eseryum.common.exception.ResourceNotFoundException;
import com.eseryum.media.common.dto.MediaResponse;
import com.eseryum.media.common.entity.Media;
import com.eseryum.media.common.entity.MediaType;
import com.eseryum.media.common.identity.MediaIdentity;
import com.eseryum.media.common.identity.MediaProvider;
import com.eseryum.media.common.mapper.MediaMapper;
import com.eseryum.media.common.repository.MediaRepository;
import com.eseryum.media.common.service.MediaService;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@ExtendWith(MockitoExtension.class)
class MediaServiceTest {

    @Mock private MediaRepository mediaRepository;
    @Mock private MediaMapper mediaMapper;

    @InjectMocks private MediaService mediaService;

    private Media media;
    private MediaResponse response;

    @BeforeEach
    void setUp() {
        media =
                new Media(
                        "Dune",
                        "Dune",
                        "Bilim kurgu romanı",
                        MediaType.BOOK,
                        new MediaIdentity(MediaProvider.GOOGLE_BOOKS, "dune-volume-id"),
                        LocalDate.of(1965, 8, 1),
                        "https://example.com/poster.jpg",
                        null);

        response =
                new MediaResponse(
                        1L,
                        "Dune",
                        "Dune",
                        "Bilim kurgu romanı",
                        MediaType.BOOK,
                        MediaProvider.GOOGLE_BOOKS,
                        "dune-volume-id",
                        LocalDate.of(1965, 8, 1),
                        "https://example.com/poster.jpg",
                        null,
                        Instant.now(),
                        Instant.now());
    }

    @Test
    void getById_shouldReturnMedia_whenMediaExists() {
        when(mediaRepository.findById(1L)).thenReturn(Optional.of(media));
        when(mediaMapper.toResponse(media)).thenReturn(response);

        MediaResponse result = mediaService.getById(1L);

        assertEquals(response, result);
    }

    @Test
    void getById_shouldThrowException_whenMediaDoesNotExist() {
        when(mediaRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> mediaService.getById(99L));
    }

    @Test
    void search_shouldTrimQueryAndMapResults() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Media> mediaPage = new PageImpl<>(List.of(media), pageable, 1);

        when(mediaRepository.searchByTitle("Dune", pageable)).thenReturn(mediaPage);
        when(mediaMapper.toResponse(media)).thenReturn(response);

        Page<MediaResponse> result = mediaService.search("  Dune  ", pageable);

        assertEquals(1, result.getTotalElements());
        assertEquals(response, result.getContent().getFirst());
        verify(mediaRepository).searchByTitle("Dune", pageable);
    }

}
