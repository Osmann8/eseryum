package com.eseryum.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * JPA tarafinin temel konfigurasyonu.
 *
 * <p>Auditing acik olmadan BaseEntity'deki createdAt/updatedAt null kalir ve NOT NULL kolon
 * yuzunden insert patlar; bu yuzden burada tek satirla acilir.
 *
 * <p>Repository taramasi ve entity taramasi icin ayrica bir sey yazilmadi: @SpringBootApplication
 * zaten com.eseryum altini tariyor, feature paketleri kendi repository'lerini ekledikce
 * bulunacaklar.
 */
@Configuration
@EnableJpaAuditing
@EnableTransactionManagement
public class JpaConfig {}
