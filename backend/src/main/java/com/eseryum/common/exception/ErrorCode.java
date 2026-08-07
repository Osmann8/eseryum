package com.eseryum.common.exception;

import org.springframework.http.HttpStatus;

/**
 * API'nin dondurdugu hata kodlari.
 *
 * <p>Kod, HTTP durumunun yerine gecmez; yaninda durur. HTTP durumu kabaca "ne tur bir sorun"
 * derken, kod istemcinin uzerine dal budak salmadan {@code switch} yazabilecegi kesin bir
 * ayrimdir: 400 donen iki farkli durumu ayirt etmenin tek yolu budur.
 *
 * <p>Kod adlari sozlesmedir — bir kez yayina girdikten sonra degistirilmez, yenisi eklenir.
 */
public enum ErrorCode {

    /** Istenen kayit yok. */
    KAYIT_BULUNAMADI(HttpStatus.NOT_FOUND),

    /** Istek govdesi/parametreleri dogrulamadan gecmedi. Alan bazli detay fieldErrors'ta. */
    DOGRULAMA_HATASI(HttpStatus.BAD_REQUEST),

    /** Istek okunamadi ya da tip donusumu basarisiz (bozuk JSON, harf girilen id gibi). */
    GECERSIZ_ISTEK(HttpStatus.BAD_REQUEST),

    /** Benzersiz olmasi gereken bir kayit zaten var (ayni e-posta, ayni kullanici adi). */
    KAYIT_ZATEN_VAR(HttpStatus.CONFLICT),

    /** Kimlik dogrulanmadi: token yok, suresi dolmus ya da gecersiz. */
    YETKISIZ_ERISIM(HttpStatus.UNAUTHORIZED),

    /** Kimlik dogru ama bu kaynak icin yetki yok. */
    ERISIM_ENGELLENDI(HttpStatus.FORBIDDEN),

    /** Endpoint var ama bu HTTP metodunu kabul etmiyor. */
    METOD_DESTEKLENMIYOR(HttpStatus.METHOD_NOT_ALLOWED),

    /** Beklenmeyen hata. Detayi istemciye degil loga yazilir. */
    SUNUCU_HATASI(HttpStatus.INTERNAL_SERVER_ERROR);

    private final HttpStatus httpStatus;

    ErrorCode(HttpStatus httpStatus) {
        this.httpStatus = httpStatus;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}
