package com.eseryum.media.common.service;

import com.eseryum.common.exception.ResourceNotFoundException;
import com.eseryum.media.common.dto.MediaResponse;
import com.eseryum.media.common.entity.Media;
import com.eseryum.media.common.mapper.MediaMapper;
import com.eseryum.media.common.repository.MediaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MediaService {

    private final MediaRepository mediaRepository;
    private final MediaMapper mediaMapper;

    public MediaService(
            MediaRepository mediaRepository,
            MediaMapper mediaMapper
    ) {
        this.mediaRepository = mediaRepository;
        this.mediaMapper = mediaMapper;
    }

    @Transactional(readOnly = true)
    public MediaResponse getById(Long id) {
        Media media = findMedia(id);

        return mediaMapper.toResponse(media);
    }

    @Transactional(readOnly = true)
    public Page<MediaResponse> search(String query, Pageable pageable) {
        return mediaRepository.searchByTitle(query.trim(), pageable)
                .map(mediaMapper::toResponse);
    }

    private Media findMedia(Long id) {
        return mediaRepository.findById(id)
                .orElseThrow(() ->
                        ResourceNotFoundException.of("Medya", id)
                );
    }
}
