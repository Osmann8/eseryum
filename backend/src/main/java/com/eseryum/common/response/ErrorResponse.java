package com.eseryum.common.response;

import com.eseryum.common.exception.ErrorCode;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;

/**
 * API'nin donduregi tek hata govdesi. Durum kodu ne olursa olsun sekil degismez —
 * frontend tek bir tip yazar, her endpoint icin ayri hata sekli ogrenmez.
 *
 * @param timestamp   hatanin olustugu an (UTC)
 * @param status      HTTP durum kodu
 * @param code        {@link ErrorCode} adi; istemcinin dala ayirdigi sabit
 * @param message     kullaniciya gosterilebilir Turkce aciklama
 * @param path        istegin yolu
 * @param fieldErrors alan bazli dogrulama hatalari; yoksa bos liste (asla null degil)
 */
@Schema(description = "Standart hata cevabi")
public record ErrorResponse(
        @Schema(example = "2026-08-07T14:22:31Z") Instant timestamp,
        @Schema(example = "404") int status,
        @Schema(example = "KAYIT_BULUNAMADI") String code,
        @Schema(example = "Eser bulunamadı: 42") String message,
        @Schema(example = "/api/v1/works/42") String path,
        List<FieldError> fieldErrors) {

    /**
     * Tek bir alanin neden reddedildigi.
     *
     * @param field   DTO alan adi
     * @param message alan icin Turkce hata mesaji
     */
    @Schema(description = "Alan bazli dogrulama hatasi")
    public record FieldError(
            @Schema(example = "puan") String field,
            @Schema(example = "Puan 0.5 ile 5 arasinda olmalidir") String message) {}

    public static ErrorResponse of(ErrorCode code, String message, String path) {
        return of(code, message, path, List.of());
    }

    public static ErrorResponse of(
            ErrorCode code, String message, String path, List<FieldError> fieldErrors) {
        return new ErrorResponse(
                Instant.now(),
                code.getHttpStatus().value(),
                code.name(),
                message,
                path,
                fieldErrors == null ? List.of() : List.copyOf(fieldErrors));
    }
}
