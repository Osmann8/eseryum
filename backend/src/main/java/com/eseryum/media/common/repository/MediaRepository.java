package com.eseryum.media.common.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.eseryum.media.common.entity.Media;

public interface MediaRepository extends JpaRepository<Media, Long> {

    @Query("""
            select media
            from Media media
            where lower(media.title) like lower(concat('%', :query, '%'))
               or lower(coalesce(media.originalTitle, '')) like lower(concat('%', :query, '%'))
            """)
    Page<Media> searchByTitle(@Param("query") String query, Pageable pageable);
}
