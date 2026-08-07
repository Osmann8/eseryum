package com.eseryum.common.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import java.time.Instant;
import org.hibernate.Hibernate;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

/**
 * Tum entity'lerin miras aldigi temel yapi: id ve zaman damgalari.
 *
 * <p>createdAt / updatedAt alanlarini {@link AuditingEntityListener} doldurur; bunun icin
 * {@code @EnableJpaAuditing} gerekir (bkz. JpaConfig). Zaman damgalari {@link Instant} olarak,
 * yani UTC tutulur — kullaniciya gosterilecek yerel saat donusumu sunum katmaninin isi.
 */
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public Long getId() {
        return id;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    /**
     * Ayni tipteki iki kayitli entity ayni id'ye sahipse esittir. Henuz kaydedilmemis
     * (id == null) entity yalnizca kendisine esittir; boylece bir Set icinde iki farkli
     * yeni kayit birbirini yutmaz. Tip karsilastirmasi {@code Hibernate.getClass} ile
     * yapilir, aksi halde lazy proxy ile gercek nesne asla esit cikmaz.
     */
    @Override
    public final boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) {
            return false;
        }
        return id != null && id.equals(((BaseEntity) other).id);
    }

    /**
     * Tip basina sabit hash: id kaydetme aninda null'dan bir degere degistigi icin id tabanli
     * hash, entity'yi eklendigi HashSet icinde kaybettirir.
     */
    @Override
    public final int hashCode() {
        return Hibernate.getClass(this).hashCode();
    }
}
