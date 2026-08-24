package com.eseryum.media.entity;

import com.eseryum.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Embedded;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import com.eseryum.media.identity.MediaIdentity;
import java.time.LocalDate;
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
    private String description;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "media_type", nullable = false, columnDefinition = "media_type")
    private MediaType type;

    @Embedded
    private MediaIdentity identity;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @Column(name = "cover_url", columnDefinition = "TEXT")
    private String posterUrl;

    @Column(name = "backdrop_url", columnDefinition = "TEXT")
    private String backdropUrl;

    protected Media() {
    }

    public Media(
            String title,
            String originalTitle,
            String description,
            MediaType type,
            MediaIdentity identity,
            LocalDate releaseDate,
            String posterUrl,
            String backdropUrl) {
        this.title = title;
        this.originalTitle = originalTitle;
        this.description = description;
        this.type = type;
        this.identity = identity;
        this.releaseDate = releaseDate;
        this.posterUrl = posterUrl;
        this.backdropUrl = backdropUrl;
    }

    public String getTitle() {
        return title;
    }

    public String getOriginalTitle() {
        return originalTitle;
    }

    public String getDescription() {
        return description;
    }

    public MediaType getType() {
        return type;
    }

    public MediaIdentity getIdentity() {
        return identity;
    }

    public LocalDate getReleaseDate() {
        return releaseDate;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public String getBackdropUrl() {
        return backdropUrl;
    }
}
