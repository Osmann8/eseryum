package com.eseryum.common.exception;

/**
 * Uygulamanin kendi firlattigi tum hatalarin atasi.
 *
 * <p>Bir hatanin HTTP durumu ve kodu, firlatildigi yerde belli olur; controller'in ya da
 * handler'in bunu tahmin etmesi gerekmez. {@link GlobalExceptionHandler} bu tipi tek bir
 * yerde yakalar.
 */
public class EseryumException extends RuntimeException {

    private final ErrorCode errorCode;

    public EseryumException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public EseryumException(ErrorCode errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }
}
