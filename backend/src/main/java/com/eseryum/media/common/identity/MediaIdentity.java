package com.eseryum.media.common.identity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import java.util.Objects;

@Embeddable
public class MediaIdentity {

    @Enumerated(EnumType.STRING)
    @Column(name = "provider", nullable = false, length = 30)
    private MediaProvider provider;

    @Column(name = "external_id", nullable = false, length = 255)
    private String externalId;

    protected MediaIdentity() {
    }

    public MediaIdentity(MediaProvider provider, String externalId) {
        this.provider = Objects.requireNonNull(provider, "provider boş olamaz");
        this.externalId = Objects.requireNonNull(externalId, "externalId boş olamaz");
    }

    public MediaProvider getProvider() {
        return provider;
    }

    public String getExternalId() {
        return externalId;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof MediaIdentity that)) {
            return false;
        }
        return provider == that.provider && externalId.equals(that.externalId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(provider, externalId);
    }
}
