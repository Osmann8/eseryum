package com.eseryum.media.identity;

import com.eseryum.common.exception.DuplicateResourceException;
import com.eseryum.media.repository.MediaRepository;
import org.springframework.stereotype.Service;

@Service
public class MediaDeduplicationService {

    private final MediaRepository mediaRepository;

    public MediaDeduplicationService(MediaRepository mediaRepository) {
        this.mediaRepository = mediaRepository;
    }

    public void ensureUnique(MediaIdentity identity) {
        boolean exists = mediaRepository.existsByIdentityProviderAndIdentityExternalId(
                identity.getProvider(),
                identity.getExternalId()
        );

        if (exists) {
            throw new DuplicateResourceException(
                    "Medya zaten kayıtlı: %s/%s".formatted(
                            identity.getProvider(),
                            identity.getExternalId()
                    )
            );
        }
    }
}
