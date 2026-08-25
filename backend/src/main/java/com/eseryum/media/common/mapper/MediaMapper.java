package com.eseryum.media.common.mapper;

import com.eseryum.media.common.dto.MediaResponse;
import com.eseryum.media.common.entity.Media;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface MediaMapper {

    @Mapping(target = "provider", source = "identity.provider")
    @Mapping(target = "externalId", source = "identity.externalId")
    MediaResponse toResponse(Media media);
}
