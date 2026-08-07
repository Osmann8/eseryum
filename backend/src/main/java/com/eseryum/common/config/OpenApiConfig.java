package com.eseryum.common.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger UI'nin ustundeki baslik/aciklama. Endpoint dokumantasyonu bu dosyada degil,
 * controller'larin uzerindeki anotasyonlardan uretilir.
 *
 * <p>JWT guvenlik semasi burada tanimli degil — auth ticket'i geldiginde eklenecek, aksi halde
 * Swagger UI'da hicbir sey korumazken "Authorize" dugmesi cikar.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI eseryumOpenApi() {
        return new OpenAPI()
                .info(
                        new Info()
                                .title("eseryum API")
                                .version("v1")
                                .description(
                                        "Film, dizi ve kitabı tek bir \"eser\" kavramı altında "
                                                + "toplayan takip ve keşif ağı.")
                                .contact(new Contact().name("eseryum"))
                                .license(new License().name("Private")));
    }
}
