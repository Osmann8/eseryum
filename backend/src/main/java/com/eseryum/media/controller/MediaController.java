package com.eseryum.media.controller;

import com.eseryum.media.dto.CreateMediaRequest;
import com.eseryum.media.dto.MediaResponse;
import com.eseryum.media.dto.UpdateMediaRequest;
import com.eseryum.media.entity.MediaType;
import com.eseryum.media.service.MediaService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/media")
public class MediaController {

    private final MediaService mediaService;

    public MediaController(MediaService mediaService) {
        this.mediaService = mediaService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MediaResponse create(
            @Valid @RequestBody CreateMediaRequest request
    ) {
        return mediaService.create(request);
    }

    @GetMapping("/{id}")
    public MediaResponse getById(@PathVariable Long id) {
        return mediaService.getById(id);
    }

    @GetMapping
    public Page<MediaResponse> getAll(
            @RequestParam(required = false) MediaType type,
            @PageableDefault(
                    size = 20,
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable
    ) {
        return mediaService.getAll(type, pageable);
    }

    @PutMapping("/{id}")
    public MediaResponse update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateMediaRequest request
    ) {
        return mediaService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        mediaService.delete(id);
    }
}
