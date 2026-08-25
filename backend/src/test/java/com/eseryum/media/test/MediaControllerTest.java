package com.eseryum.media.test;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.eseryum.common.exception.GlobalExceptionHandler;
import com.eseryum.media.common.controller.MediaController;
import com.eseryum.media.common.dto.MediaResponse;
import com.eseryum.media.common.entity.MediaType;
import com.eseryum.media.common.identity.MediaProvider;
import com.eseryum.media.common.service.MediaService;
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
    void getById_shouldReturnMedia() throws Exception {
        when(mediaService.getById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/media/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Dune"));
    }

    @Test
    void search_shouldForwardQueryAndPagination() throws Exception {
        PageRequest pageable = PageRequest.of(0, 20);
        when(mediaService.search(eq("dune"), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(response), pageable, 1));

        mockMvc.perform(get("/api/media/search").param("q", "dune"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Dune"))
                .andExpect(jsonPath("$.totalElements").value(1));

        verify(mediaService).search(eq("dune"), any(Pageable.class));
    }

    @Test
    void search_shouldRejectMissingQuery() throws Exception {
        mockMvc.perform(get("/api/media/search"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("GECERSIZ_ISTEK"));
    }

}
