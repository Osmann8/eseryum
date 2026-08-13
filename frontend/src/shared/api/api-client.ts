/**
 * Backend ile tek temas noktasi. Her cagri buradan gecer ki hata sekli,
 * base URL ve varsayilan header'lar tek yerde dursun.
 *
 * Backend'in hata govdesi durum kodundan bagimsiz olarak hep ayni
 * (bkz. common/response/ErrorResponse.java); bu yuzden istemci tarafinda da
 * tek bir hata tipi yeterli.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

/** Backend'in ErrorCode enum'u ile birebir. Isimler sozlesmedir, degismez. */
export type ErrorCode =
  | "KAYIT_BULUNAMADI"
  | "DOGRULAMA_HATASI"
  | "GECERSIZ_ISTEK"
  | "KAYIT_ZATEN_VAR"
  | "YETKISIZ_ERISIM"
  | "ERISIM_ENGELLENDI"
  | "METOD_DESTEKLENMIYOR"
  | "SUNUCU_HATASI";

export interface FieldError {
  field: string;
  message: string;
}

export interface ErrorResponseBody {
  timestamp: string;
  status: number;
  code: ErrorCode;
  message: string;
  path: string;
  fieldErrors: FieldError[];
}

/** Sayfali cevaplar Spring `Page` sekliyle gelir. */
export interface Page<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: ErrorCode | "AG_HATASI";
  readonly fieldErrors: FieldError[];

  constructor(
    status: number,
    code: ErrorCode | "AG_HATASI",
    message: string,
    fieldErrors: FieldError[] = [],
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  /** Sorgu parametreleri; undefined olanlar URL'e yazilmaz. */
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(path, API_BASE_URL);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

export async function apiFetch<T>(
  path: string,
  { query, body, headers, ...init }: RequestOptions = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(buildUrl(path, query), {
      ...init,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    // Backend ayakta degilse fetch reddeder; bunu da ApiError'a cevirelim ki
    // cagiran taraf iki farkli hata tipi ayirt etmek zorunda kalmasin.
    throw new ApiError(0, "AG_HATASI", "Sunucuya ulaşılamadı.", []);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const error = payload as ErrorResponseBody | null;
    throw new ApiError(
      response.status,
      error?.code ?? "SUNUCU_HATASI",
      error?.message ?? "Beklenmeyen bir hata oluştu.",
      error?.fieldErrors ?? [],
    );
  }

  return payload as T;
}
