package com.eseryum.common.exception;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Hata sozlesmesinin testi: her durumda ayni govde, ve ic detay sizmamasi.
 *
 * <p>Spring context ayaga kaldirilmadan, sadece handler + sahte bir controller ile calisir.
 */
class GlobalExceptionHandlerTest {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        ObjectMapper objectMapper =
                new ObjectMapper()
                        .registerModule(new JavaTimeModule())
                        .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        mockMvc =
                MockMvcBuilders.standaloneSetup(new TestController())
                        .setControllerAdvice(new GlobalExceptionHandler())
                        .setMessageConverters(new MappingJackson2HttpMessageConverter(objectMapper))
                        .build();
    }

    @Test
    @DisplayName("Kayit bulunamadi: 404 ve KAYIT_BULUNAMADI kodu doner")
    void kayitBulunamadi() throws Exception {
        mockMvc.perform(get("/test/eserler/42"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.code").value("KAYIT_BULUNAMADI"))
                .andExpect(jsonPath("$.message").value("Eser bulunamadı: 42"))
                .andExpect(jsonPath("$.path").value("/test/eserler/42"))
                .andExpect(jsonPath("$.timestamp").exists())
                .andExpect(jsonPath("$.fieldErrors").isEmpty());
    }

    @Test
    @DisplayName("Dogrulama hatasi: 400 ve alan bazli hata listesi doner")
    void dogrulamaHatasi() throws Exception {
        mockMvc.perform(
                        post("/test/eserler")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"baslik\":\"\",\"not\":\"cok cok uzun bir not\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("DOGRULAMA_HATASI"))
                .andExpect(jsonPath("$.fieldErrors", Matchers.hasSize(2)))
                .andExpect(
                        jsonPath("$.fieldErrors[*].field")
                                .value(Matchers.containsInAnyOrder("baslik", "not")));
    }

    @Test
    @DisplayName("Bozuk JSON: 400 ve GECERSIZ_ISTEK kodu doner")
    void bozukJson() throws Exception {
        mockMvc.perform(
                        post("/test/eserler")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{ bu json degil "))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("GECERSIZ_ISTEK"));
    }

    @Test
    @DisplayName("Yanlis tipte parametre: 400 ve alan adi ile doner")
    void tipUyusmazligi() throws Exception {
        mockMvc.perform(get("/test/eserler/abc"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("GECERSIZ_ISTEK"))
                .andExpect(jsonPath("$.fieldErrors[0].field").value("id"));
    }

    @Test
    @DisplayName("Beklenmeyen hata: 500 doner ve ic detay sizmaz")
    void beklenmeyenHata() throws Exception {
        mockMvc.perform(get("/test/patla"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.code").value("SUNUCU_HATASI"))
                .andExpect(
                        jsonPath("$.message")
                                .value("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin."))
                // Veritabani sifresi, sinif adi, stack trace: hicbiri govdede olmamali.
                .andExpect(jsonPath("$.message").value(Matchers.not(Matchers.containsString("gizli"))));
    }

    @RestController
    static class TestController {

        @GetMapping("/test/eserler/{id}")
        String bul(@PathVariable Long id) {
            throw ResourceNotFoundException.of("Eser", id);
        }

        @PostMapping("/test/eserler")
        String olustur(@Valid @RequestBody EserIstegi istek) {
            return "ok";
        }

        @GetMapping("/test/patla")
        String patla() {
            throw new IllegalStateException("gizli ic detay: jdbc://user:parola@localhost");
        }
    }

    record EserIstegi(
            @NotBlank(message = "Başlık boş olamaz") String baslik,
            @Size(max = 5, message = "Not en fazla 5 karakter olabilir") String not) {}
}
