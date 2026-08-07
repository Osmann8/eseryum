package com.eseryum.common.exception;

/**
 * Benzersiz olmasi gereken bir kayit zaten var. HTTP 409 doner.
 *
 * <p>Ornek: alinmis kullanici adi, kayitli e-posta.
 */
public class DuplicateResourceException extends EseryumException {

    public DuplicateResourceException(String message) {
        super(ErrorCode.KAYIT_ZATEN_VAR, message);
    }
}
