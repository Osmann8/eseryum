package com.eseryum.media.repository;

import com.eseryum.media.entity.Media;
import com.eseryum.media.entity.MediaType;
import com.eseryum.media.identity.MediaProvider;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MediaRepository extends JpaRepository<Media, Long> {

    Page<Media> findAllByType(MediaType type, Pageable pageable);

    boolean existsByIdentityProviderAndIdentityExternalId(
            MediaProvider provider,
            String externalId
    );
}
