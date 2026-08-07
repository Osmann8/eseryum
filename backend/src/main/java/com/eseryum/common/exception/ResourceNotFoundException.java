package com.eseryum.common.exception;

/**
 * Istenen kayit bulunamadi. HTTP 404 doner.
 */
public class ResourceNotFoundException extends EseryumException {

    public ResourceNotFoundException(String message) {
        super(ErrorCode.KAYIT_BULUNAMADI, message);
    }

    /**
     * "Eser bulunamadı: 42" seklinde standart mesaj uretir. Kayit tipini Turkce yazin —
     * bu mesaj kullaniciya gorunur.
     */
    public static ResourceNotFoundException of(String kayitTipi, Object id) {
        return new ResourceNotFoundException("%s bulunamadı: %s".formatted(kayitTipi, id));
    }
}
