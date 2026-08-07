package com.eseryum.common.exception;

import com.eseryum.common.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

/**
 * Uygulamadaki tum hatalarin tek cikis noktasi.
 *
 * <p>Buradaki kural: istemciye giden govde her zaman {@link ErrorResponse}. Controller'lar
 * try/catch yazmaz, hata firlatir. Beklenmeyen hatalarin ic detayi (stack trace, SQL, sinif
 * adi) istemciye sizmaz — loga yazilir, istemci genel bir mesaj gorur.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /** Uygulamanin bilerek firlattigi hatalar: kodu ve durumu kendi uzerinde tasir. */
    @ExceptionHandler(EseryumException.class)
    public ResponseEntity<ErrorResponse> handleEseryumException(
            EseryumException ex, HttpServletRequest request) {
        ErrorCode code = ex.getErrorCode();
        log.debug("Beklenen hata: {} - {}", code, ex.getMessage());
        return build(code, ex.getMessage(), request);
    }

    /** @Valid ile isaretli istek govdesi dogrulamadan gecmedi. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        List<ErrorResponse.FieldError> fieldErrors =
                ex.getBindingResult().getFieldErrors().stream()
                        .map(GlobalExceptionHandler::toFieldError)
                        .toList();
        return build(
                ErrorCode.DOGRULAMA_HATASI,
                "Gönderilen bilgiler geçerli değil.",
                request,
                fieldErrors);
    }

    /** @Validated ile isaretli parametrelerde (path/query) dogrulama hatasi. */
    @ExceptionHandler({
        ConstraintViolationException.class,
        org.springframework.web.method.annotation.HandlerMethodValidationException.class
    })
    public ResponseEntity<ErrorResponse> handleConstraintViolation(Exception ex, HttpServletRequest request) {
        if (ex instanceof ConstraintViolationException cve) {
            List<ErrorResponse.FieldError> fieldErrors =
                    cve.getConstraintViolations().stream()
                            .map(
                                    violation ->
                                            new ErrorResponse.FieldError(
                                                    violation.getPropertyPath().toString(),
                                                    violation.getMessage()))
                            .toList();
            return build(
                    ErrorCode.DOGRULAMA_HATASI,
                    "Gönderilen bilgiler geçerli değil.",
                    request,
                    fieldErrors);
        }

        return build(ErrorCode.DOGRULAMA_HATASI, "Gönderilen bilgiler geçerli değil.", request);
    }

    /** Govde okunamadi: bozuk JSON, eksik govde, beklenmeyen tip. */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleNotReadable(
            HttpMessageNotReadableException ex, HttpServletRequest request) {
        log.debug("Okunamayan istek govdesi: {}", ex.getMessage());
        return build(ErrorCode.GECERSIZ_ISTEK, "İstek gövdesi okunamadı.", request);
    }

    /** Parametre tipi tutmuyor: /works/abc gibi. */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex, HttpServletRequest request) {
        String message = "'%s' parametresi geçerli bir değer değil.".formatted(ex.getName());
        return build(
                ErrorCode.GECERSIZ_ISTEK,
                message,
                request,
                List.of(new ErrorResponse.FieldError(ex.getName(), "Geçersiz değer.")));
    }

    /** Zorunlu query parametresi gonderilmemis. */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> handleMissingParameter(
            MissingServletRequestParameterException ex, HttpServletRequest request) {
        String message = "'%s' parametresi zorunludur.".formatted(ex.getParameterName());
        return build(
                ErrorCode.GECERSIZ_ISTEK,
                message,
                request,
                List.of(new ErrorResponse.FieldError(ex.getParameterName(), "Zorunlu alan.")));
    }

    /** Endpoint var, HTTP metodu desteklenmiyor. */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleMethodNotSupported(
            HttpRequestMethodNotSupportedException ex, HttpServletRequest request) {
        String message = "%s metodu bu adres için desteklenmiyor.".formatted(ex.getMethod());
        return build(ErrorCode.METOD_DESTEKLENMIYOR, message, request);
    }

    /** Eslesen endpoint yok. Spring'in varsayilan beyaz sayfasi yerine ayni govdeyi doner. */
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoResourceFound(
            NoResourceFoundException ex, HttpServletRequest request) {
        return build(ErrorCode.KAYIT_BULUNAMADI, "Böyle bir adres yok.", request);
    }

    /**
     * Yetki reddi. Not: Security filtre zincirinde olusan hatalar buraya ulasmaz, onlari
     * AuthenticationEntryPoint / AccessDeniedHandler yakalar — auth ticket'inda kurulacak,
     * ayni govdeyi uretmesi gerekir.
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(
            AccessDeniedException ex, HttpServletRequest request) {
        return build(ErrorCode.ERISIM_ENGELLENDI, "Bu işlem için yetkiniz yok.", request);
    }

    /** Veritabani kisiti ihlali: benzersizlik ya da yabanci anahtar. */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(
            DataIntegrityViolationException ex, HttpServletRequest request) {
        log.warn("Veritabani kisiti ihlali: {}", ex.getMostSpecificCause().getMessage());
        return build(
                ErrorCode.KAYIT_ZATEN_VAR, "Bu kayıt mevcut bir kayıtla çakışıyor.", request);
    }

    /** Geri kalan her sey. Detay loga, istemciye genel mesaj. */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpected(
            Exception ex, HttpServletRequest request) {
        log.error("Beklenmeyen hata: {} {}", request.getMethod(), request.getRequestURI(), ex);
        return build(
                ErrorCode.SUNUCU_HATASI,
                "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.",
                request);
    }

    private static ErrorResponse.FieldError toFieldError(FieldError fieldError) {
        String message =
                fieldError.getDefaultMessage() == null
                        ? "Geçersiz değer."
                        : fieldError.getDefaultMessage();
        return new ErrorResponse.FieldError(fieldError.getField(), message);
    }

    private ResponseEntity<ErrorResponse> build(
            ErrorCode code, String message, HttpServletRequest request) {
        return build(code, message, request, List.of());
    }

    private ResponseEntity<ErrorResponse> build(
            ErrorCode code,
            String message,
            HttpServletRequest request,
            List<ErrorResponse.FieldError> fieldErrors) {
        return ResponseEntity.status(code.getHttpStatus())
                .body(ErrorResponse.of(code, message, request.getRequestURI(), fieldErrors));
    }
}
