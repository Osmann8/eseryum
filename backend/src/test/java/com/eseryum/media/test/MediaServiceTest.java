package com.eseryum.media.test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.eseryum.common.exception.ResourceNotFoundException;
import com.eseryum.media.dto.CreateMediaRequest;
import com.eseryum.media.dto.MediaResponse;
import com.eseryum.media.dto.UpdateMediaRequest;
import com.eseryum.media.entity.Media;
import com.eseryum.media.entity.MediaType;
import com.eseryum.media.mapper.MediaMapper;
import com.eseryum.media.repository.MediaRepository;
import com.eseryum.media.service.MediaService;
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
                        LocalDate.of(1965, 8, 1),
                        "https://example.com/poster.jpg",
                        null,
                        Instant.now(),
                        Instant.now());
    }

    @Test
    void create_shouldSaveAndReturnMedia() {
        CreateMediaRequest request =
                new CreateMediaRequest(
                        "Dune",
                        "Dune",
                        "Bilim kurgu romanı",
                        MediaType.BOOK,
                        LocalDate.of(1965, 8, 1),
                        "https://example.com/poster.jpg",
                        null);

        when(mediaMapper.toEntity(request)).thenReturn(media);
        when(mediaRepository.save(media)).thenReturn(media);
        when(mediaMapper.toResponse(media)).thenReturn(response);

        MediaResponse result = mediaService.create(request);

        assertSame(response, result);
        verify(mediaRepository).save(media);
    }

    @Test
    void getById_shouldReturnMedia_whenMediaExists() {
        when(mediaRepository.findById(1L)).thenReturn(Optional.of(media));
        when(mediaMapper.toResponse(media)).thenReturn(response);

        MediaResponse result = mediaService.getById(1L);

        assertSame(response, result);
    }

    @Test
    void getById_shouldThrowException_whenMediaDoesNotExist() {
        when(mediaRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> mediaService.getById(99L));
    }

    @Test
    void getAll_shouldReturnAllMedia_whenTypeIsNull() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Media> mediaPage = new PageImpl<>(List.of(media), pageable, 1);

        when(mediaRepository.findAll(pageable)).thenReturn(mediaPage);
        when(mediaMapper.toResponse(media)).thenReturn(response);

        Page<MediaResponse> result = mediaService.getAll(null, pageable);

        assertEquals(1, result.getTotalElements());
        assertSame(response, result.getContent().getFirst());
        verify(mediaRepository).findAll(pageable);
    }

    @Test
    void getAll_shouldFilterMedia_whenTypeIsProvided() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Media> mediaPage = new PageImpl<>(List.of(media), pageable, 1);

        when(mediaRepository.findAllByType(MediaType.BOOK, pageable)).thenReturn(mediaPage);
        when(mediaMapper.toResponse(media)).thenReturn(response);

        Page<MediaResponse> result = mediaService.getAll(MediaType.BOOK, pageable);

        assertEquals(1, result.getTotalElements());
        verify(mediaRepository).findAllByType(MediaType.BOOK, pageable);
    }

    @Test
    void update_shouldUpdateAndReturnMedia() {
        UpdateMediaRequest request =
                new UpdateMediaRequest(
                        "Dune: Çöl Gezegeni",
                        "Dune",
                        "Bilim kurgu romanı",
                        MediaType.BOOK,
                        LocalDate.of(1965, 8, 1),
                        "https://example.com/poster.jpg",
                        null);

        when(mediaRepository.findById(1L)).thenReturn(Optional.of(media));
        when(mediaMapper.toResponse(media)).thenReturn(response);

        MediaResponse result = mediaService.update(1L, request);

        assertSame(response, result);
        verify(mediaMapper).updateEntity(request, media);
    }

    @Test
    void delete_shouldDeleteMedia() {
        when(mediaRepository.findById(1L)).thenReturn(Optional.of(media));

        mediaService.delete(1L);

        verify(mediaRepository).delete(media);
    }
}
