package com.eseryum.media.test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.eseryum.common.exception.ResourceNotFoundException;
import com.eseryum.media.dto.MediaResponse;
import com.eseryum.media.entity.Media;
import com.eseryum.media.entity.MediaType;
import com.eseryum.media.mapper.MediaMapper;
import com.eseryum.media.repository.MediaRepository;
import com.eseryum.media.service.MediaService;
import java.math.BigDecimal;
import java.time.Instant;
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
                        MediaType.BOOK,
                        "Dune",
                        "Dune",
                        (short) 1965,
                        "https://example.com/cover.jpg",
                        "Bilim kurgu romanı",
                        new BigDecimal("8.50"),
                        42);

        response =
                new MediaResponse(
                        1L,
                        MediaType.BOOK,
                        "Dune",
                        "Dune",
                        (short) 1965,
                        "https://example.com/cover.jpg",
                        "Bilim kurgu romanı",
                        new BigDecimal("8.50"),
                        42,
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
