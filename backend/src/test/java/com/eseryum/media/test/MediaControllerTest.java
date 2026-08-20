package com.eseryum.media.test;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.eseryum.common.exception.GlobalExceptionHandler;
import com.eseryum.media.controller.MediaController;
import com.eseryum.media.dto.CreateMediaRequest;
import com.eseryum.media.dto.MediaResponse;
import com.eseryum.media.dto.UpdateMediaRequest;
import com.eseryum.media.entity.MediaType;
import com.eseryum.media.identity.MediaProvider;
import com.eseryum.media.service.MediaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(MockitoExtension.class)
class MediaControllerTest {

    @Mock private MediaService mediaService;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;
    private MediaResponse response;

    @BeforeEach
    void setUp() {
        objectMapper =
                new ObjectMapper()
                        .registerModule(new JavaTimeModule())
                        .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        mockMvc =
                MockMvcBuilders.standaloneSetup(new MediaController(mediaService))
                        .setControllerAdvice(new GlobalExceptionHandler())
                        .setCustomArgumentResolvers(new PageableHandlerMethodArgumentResolver())
                        .setMessageConverters(new MappingJackson2HttpMessageConverter(objectMapper))
                        .build();

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
                        Instant.parse("2026-08-07T10:00:00Z"),
                        Instant.parse("2026-08-07T10:00:00Z"));
    }

    @Test
    void create_shouldReturnCreatedMedia() throws Exception {
        CreateMediaRequest request =
                new CreateMediaRequest(
                        "Dune",
                        "Dune",
                        "Bilim kurgu romanı",
                        MediaType.BOOK,
                        MediaProvider.GOOGLE_BOOKS,
                        "dune-volume-id",
                        LocalDate.of(1965, 8, 1),
                        "https://example.com/poster.jpg",
                        null);
        when(mediaService.create(request)).thenReturn(response);

        mockMvc.perform(
                        post("/api/media")
                                .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Dune"))
                .andExpect(jsonPath("$.type").value("BOOK"));
    }

    @Test
    void create_shouldRejectInvalidRequest() throws Exception {
        mockMvc.perform(
                        post("/api/media")
                                .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                                .content("{\"title\":\"\",\"type\":null}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("DOGRULAMA_HATASI"));
    }

    @Test
    void getById_shouldReturnMedia() throws Exception {
        when(mediaService.getById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/media/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Dune"));
    }

    @Test
    void getAll_shouldForwardTypeAndPagination() throws Exception {
        PageRequest pageable = PageRequest.of(0, 10);
        when(mediaService.getAll(eq(MediaType.BOOK), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(response), pageable, 1));

        mockMvc.perform(get("/api/media").param("type", "BOOK").param("page", "0").param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Dune"))
                .andExpect(jsonPath("$.totalElements").value(1));

        verify(mediaService).getAll(eq(MediaType.BOOK), any(Pageable.class));
    }

    @Test
    void update_shouldReturnUpdatedMedia() throws Exception {
        UpdateMediaRequest request =
                new UpdateMediaRequest(
                        "Dune: Çöl Gezegeni",
                        "Dune",
                        "Bilim kurgu romanı",
                        MediaType.BOOK,
                        LocalDate.of(1965, 8, 1),
                        "https://example.com/poster.jpg",
                        null);
        MediaResponse updatedResponse =
                new MediaResponse(
                        1L,
                        request.title(),
                        request.originalTitle(),
                        request.description(),
                        request.type(),
                        response.provider(),
                        response.externalId(),
                        request.releaseDate(),
                        request.posterUrl(),
                        request.backdropUrl(),
                        response.createdAt(),
                        response.updatedAt());
        when(mediaService.update(1L, request)).thenReturn(updatedResponse);

        mockMvc.perform(
                        put("/api/media/1")
                                .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Dune: Çöl Gezegeni"));
    }

    @Test
    void delete_shouldReturnNoContent() throws Exception {
        mockMvc.perform(delete("/api/media/1")).andExpect(status().isNoContent());

        verify(mediaService).delete(1L);
    }
}
