package com.eseryum.media.controller;

import com.eseryum.media.dto.MediaResponse;
import com.eseryum.media.service.MediaService;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.validation.annotation.Validated;

@RestController
@RequestMapping("/api/media")
@Validated
public class MediaController {

    private final MediaService mediaService;

    public MediaController(MediaService mediaService) {
        this.mediaService = mediaService;
    }

    @GetMapping("/{id}")
    public MediaResponse getById(@PathVariable Long id) {
        return mediaService.getById(id);
    }

    @GetMapping("/search")
    public Page<MediaResponse> search(
            @RequestParam("q")
            @NotBlank
            @Size(max = 100)
            String query,
            @PageableDefault(size = 20, sort = "title") Pageable pageable
    ) {
        return mediaService.search(query, pageable);
    }
}
