package com.eseryum.media.service;

import com.eseryum.common.exception.ResourceNotFoundException;
import com.eseryum.media.dto.CreateMediaRequest;
import com.eseryum.media.dto.MediaResponse;
import com.eseryum.media.dto.UpdateMediaRequest;
import com.eseryum.media.entity.Media;
import com.eseryum.media.entity.MediaType;
import com.eseryum.media.mapper.MediaMapper;
import com.eseryum.media.repository.MediaRepository;
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

    @Transactional
    public MediaResponse create(CreateMediaRequest request) {
        Media media = mediaMapper.toEntity(request);
        Media savedMedia = mediaRepository.save(media);

        return mediaMapper.toResponse(savedMedia);
    }

    @Transactional(readOnly = true)
    public MediaResponse getById(Long id) {
        Media media = findMedia(id);

        return mediaMapper.toResponse(media);
    }

    @Transactional(readOnly = true)
    public Page<MediaResponse> getAll(
            MediaType type,
            Pageable pageable
    ) {
        Page<Media> mediaPage = type == null
                ? mediaRepository.findAll(pageable)
                : mediaRepository.findAllByType(type, pageable);

        return mediaPage.map(mediaMapper::toResponse);
    }

    @Transactional
    public MediaResponse update(
            Long id,
            UpdateMediaRequest request
    ) {
        Media media = findMedia(id);
        mediaMapper.updateEntity(request, media);

        return mediaMapper.toResponse(media);
    }

    @Transactional
    public void delete(Long id) {
        Media media = findMedia(id);
        mediaRepository.delete(media);
    }

    private Media findMedia(Long id) {
        return mediaRepository.findById(id)
                .orElseThrow(() ->
                        ResourceNotFoundException.of("Medya", id)
                );
    }
}
