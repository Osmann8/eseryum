package com.eseryum.media.mapper;

import com.eseryum.media.dto.CreateMediaRequest;
import com.eseryum.media.dto.MediaResponse;
import com.eseryum.media.dto.UpdateMediaRequest;
import com.eseryum.media.entity.Media;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface MediaMapper {

    default Media toEntity(CreateMediaRequest request) {
        return new Media(
                request.title(),
                request.originalTitle(),
                request.description(),
                request.type(),
                request.releaseDate(),
                request.posterUrl(),
                request.backdropUrl()
        );
    }

    MediaResponse toResponse(Media media);

    default void updateEntity(UpdateMediaRequest request, Media media) {
        media.update(
                request.title(),
                request.originalTitle(),
                request.description(),
                request.type(),
                request.releaseDate(),
                request.posterUrl(),
                request.backdropUrl()
        );
    }
}
