package com.eseryum.common.exception;

/**
 * Bean Validation'in yakalayamadigi is kurali dogrulamalari icin. HTTP 400 doner.
 *
 * <p>Ornek: puanin 0.5 katlari olmasi, yeniden izleme tarihinin ilk izlemeden sonra olmasi.
 * Anotasyonla ifade edilebilen kurallar buraya degil, DTO'nun uzerine yazilir.
 */
public class ValidationException extends EseryumException {

    public ValidationException(String message) {
        super(ErrorCode.DOGRULAMA_HATASI, message);
    }
}
