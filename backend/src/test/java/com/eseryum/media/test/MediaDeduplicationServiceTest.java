package com.eseryum.media.test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import com.eseryum.common.exception.DuplicateResourceException;
import com.eseryum.media.common.identity.MediaDeduplicationService;
import com.eseryum.media.common.identity.MediaIdentity;
import com.eseryum.media.common.identity.MediaProvider;
import com.eseryum.media.common.repository.MediaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class MediaDeduplicationServiceTest {

    @Mock private MediaRepository mediaRepository;

    @InjectMocks private MediaDeduplicationService mediaDeduplicationService;

    @Test
    void ensureUnique_shouldAllowUnknownIdentity() {
        MediaIdentity identity = new MediaIdentity(MediaProvider.TMDB, "550");
        when(mediaRepository.existsByIdentityProviderAndIdentityExternalId(
                        MediaProvider.TMDB, "550"))
                .thenReturn(false);

        assertDoesNotThrow(() -> mediaDeduplicationService.ensureUnique(identity));
    }

    @Test
    void ensureUnique_shouldRejectKnownIdentity() {
        MediaIdentity identity = new MediaIdentity(MediaProvider.TMDB, "550");
        when(mediaRepository.existsByIdentityProviderAndIdentityExternalId(
                        MediaProvider.TMDB, "550"))
                .thenReturn(true);

        assertThrows(
                DuplicateResourceException.class,
                () -> mediaDeduplicationService.ensureUnique(identity));
    }
}
