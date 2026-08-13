import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  /*
   * api, _next ve statik dosyalar disindaki her istek dil cozumlemesinden
   * gecer.
   *
   * Yaygin "icinde nokta olan her yolu atla" kalibi burada calismaz:
   * kullanici adlari nokta iceriyor (deniz.k, mert.y) ve /profile/deniz.k
   * middleware'e ugramadigi icin dil eki alamayip 404 donuyordu. Bu yuzden
   * uzanti listesi acikca yaziliyor ve yalnizca yolun sonundaki uzantiyi
   * elemek icin $ kullaniliyor.
   */
  matcher: [
    "/((?!api|_next|_vercel|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|txt|xml|json|webmanifest|css|js|map)$).*)",
  ],
};
