package com.eseryum.media.repository;

import com.eseryum.media.entity.Media;
import com.eseryum.media.entity.MediaType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MediaRepository extends JpaRepository<Media, Long> {

    Page<Media> findAllByType(MediaType type, Pageable pageable);
}
