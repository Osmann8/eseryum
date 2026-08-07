package com.eseryum;

import static org.assertj.core.api.Assertions.assertThat;

import io.swagger.v3.oas.models.OpenAPI;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * Uygulamanin gercek bir Postgres'e karsi ayaga kalktigini dogrular.
 *
 * <p>Sadece "derleniyor mu" degil, "konfigurasyon birbirini kiriyor mu" sorusunun cevabi:
 * Flyway calisiyor, ddl-auto validate semayla kavga etmiyor, JPA auditing acik, Swagger
 * beani olusuyor.
 */
@SpringBootTest
@Testcontainers
class EseryumApplicationTests {

    @Container
    static final PostgreSQLContainer<?> POSTGRES =
            new PostgreSQLContainer<>("postgres:16-alpine");

    @DynamicPropertySource
    static void datasourceProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }

    @Autowired private ApplicationContext context;

    @Test
    @DisplayName("Context ayaga kalkar; Flyway, JPA auditing ve OpenAPI beanleri hazir")
    void contextLoads() {
        assertThat(context.getBean(Flyway.class)).isNotNull();
        assertThat(context.getBean(OpenAPI.class)).isNotNull();
        // @EnableJpaAuditing'in kaydettigi bean. Yoksa createdAt/updatedAt null kalir.
        assertThat(context.containsBean("jpaAuditingHandler")).isTrue();
    }
}
