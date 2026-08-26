package com.eseryum.media.common.entity;

import com.eseryum.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "media")
public class Media extends BaseEntity {

    @Column(nullable = false, length = 300)
    private String title;

    @Column(name = "original_title", length = 300)
    private String originalTitle;

    @Column(name = "synopsis", columnDefinition = "TEXT")
    private String synopsis;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "media_type", nullable = false, columnDefinition = "media_type")
    private MediaType mediaType;

    @Column(name = "release_year")
    private Short releaseYear;

    @Column(name = "cover_url", columnDefinition = "TEXT")
    private String coverUrl;

    @Column(name = "rating_avg", precision = 4, scale = 2)
    private BigDecimal ratingAvg;

    @Column(name = "rating_count", nullable = false)
    private int ratingCount;

    protected Media() {
    }

    public Media(
            MediaType mediaType,
            String title,
            String originalTitle,
            Short releaseYear,
            String coverUrl,
            String synopsis,
            BigDecimal ratingAvg,
            int ratingCount) {
        this.mediaType = mediaType;
        this.title = title;
        this.originalTitle = originalTitle;
        this.releaseYear = releaseYear;
        this.coverUrl = coverUrl;
        this.synopsis = synopsis;
        this.ratingAvg = ratingAvg;
        this.ratingCount = ratingCount;
    }

    public String getTitle() {
        return title;
    }

    public String getOriginalTitle() {
        return originalTitle;
    }

    public String getSynopsis() {
        return synopsis;
    }

    public MediaType getMediaType() {
        return mediaType;
    }

    public Short getReleaseYear() {
        return releaseYear;
    }

    public String getCoverUrl() {
        return coverUrl;
    }

    public BigDecimal getRatingAvg() {
        return ratingAvg;
    }

    public int getRatingCount() {
        return ratingCount;
    }
}
