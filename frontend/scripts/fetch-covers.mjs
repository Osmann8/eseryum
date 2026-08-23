/**
 * Mock kapaklarini gercek gorsellerle degistirir.
 *
 * Neden build-time script, neden runtime fetch degil: TMDB anahtari
 * tarayiciya dusmemeli. Bu script Node'da kosuyor, ciktisi mock dosyalarina
 * yaziliyor; uygulama calisirken TMDB'ye tek bir istek gitmiyor.
 *
 * Kaynaklar:
 *   FILM / SERIES -> TMDB search  -> https://image.tmdb.org/t/p/w500/...
 *   BOOK          -> OpenLibrary  -> https://covers.openlibrary.org/b/id/...
 *
 * Kullanim:
 *   npm run covers                # hepsini tazele, mock dosyalarini yaz
 *   npm run covers -- --dry-run   # sadece raporla, dosyaya dokunma
 *   npm run covers -- --only=books
 *
 * Anahtar: frontend/.env.local ya da frontend/.env icinde TMDB_API_KEY
 * (v3) veya TMDB_ACCESS_TOKEN (v4 Bearer). Ikisinden biri yeterli.
 * Alinacak yer: themoviedb.org -> Settings -> API (ucretsiz).
 *
 * Bulunamayan kapak hata degil: o kayit yer tutucu SVG'sinde kalir.
 * WorkCover'in bos durumu ve public/covers altindaki SVG'ler duruyor.
 */
import { readFile, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const MOCK_FILES = {
  films: "src/features/films/mock/films-mock.ts",
  series: "src/features/series/mock/series-mock.ts",
  books: "src/features/books/mock/books-mock.ts",
  home: "src/features/home/mock/home-mock.ts",
};

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const OPENLIBRARY_COVER_BASE = "https://covers.openlibrary.org/b/id";
const USER_AGENT = "eseryum-dev-cover-script/1.0 (github.com/Osmann8/eseryum)";

const FEATURE_OF_TYPE = { FILM: "films", SERIES: "series", BOOK: "books" };

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------------------------------------------------------------- ortam

/**
 * Ortam dosyalarini elle okuyoruz; tek script icin dotenv bagimliligi fazla.
 *
 * Next'in kendi sirasini takip ediyoruz: once .env.local, sonra .env. Ilk
 * bulunan kazanir, gercek ortam degiskeni ikisini de yener (CI'da lazim).
 * Ikisi de .gitignore'da - anahtar hangisine yazilirsa yazilsin commit'e
 * girmez.
 */
function loadEnvFiles() {
  for (const name of [".env.local", ".env"]) {
    const file = path.join(ROOT, name);
    if (!existsSync(file)) continue;

    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
      if (!match) continue;
      const value = match[2].replace(/^["']|["']$/g, "");
      // Bos deger sayilmaz: `.env.example`'dan kopyalanmis doldurulmamis
      // satir, gercekten dolu olan dosyayi golgelemesin.
      if (value && !process.env[match[1]]) process.env[match[1]] = value;
    }
  }
}

// ------------------------------------------------------------ mock ayristirma

/**
 * Mock dosyalarindaki eser bloklarini okur.
 *
 * Kapagi zaten uzak bir URL olan kayitlar da donuyor: script tekrar
 * kosturulabilsin, kapaklar tazelenebilsin diye.
 *
 * Dosyalar elle yazildigi icin duzenleri sabit: dizi elemanlari tam iki
 * bosluk girintili `  {` ile acilip `  }` ile kapaniyor. AST parser kurmak
 * yerine bu duzeni varsayiyoruz - bozulursa script sessiz kalmaz, bulunan
 * kayit sayisi duser ve rapor bunu gosterir.
 */
function parseEntries(source) {
  const entries = [];
  let block = null;

  for (const line of source.split(/\r?\n/)) {
    if (line === "  {") {
      block = {};
      continue;
    }
    if (block && /^ {2}\},?$/.test(line)) {
      // `type` sarti liste kapaklarini eliyor: ana sayfadaki haftanin
      // listeleri de coverUrl tasiyor ama onlar eser degil, kendi
      // tasarlanmis gorselleri (/lists/*.svg) var.
      if (block.coverUrl && block.type in FEATURE_OF_TYPE) entries.push(block);
      block = null;
      continue;
    }
    if (!block) continue;

    const field = /^ {4}(\w+): (.*?),?$/.exec(line);
    if (!field) continue;

    const [, key, raw] = field;
    block[key] = /^".*"$/.test(raw) ? raw.slice(1, -1) : raw;
  }

  return entries;
}

// ------------------------------------------------------------------- TMDB

function tmdbAuth() {
  const token = process.env.TMDB_ACCESS_TOKEN;
  const key = process.env.TMDB_API_KEY;
  if (!token && !key) {
    throw new Error(
      "TMDB_API_KEY ya da TMDB_ACCESS_TOKEN yok.\n" +
        "frontend/.env.local ya da frontend/.env dosyasina ekleyin " +
        "(ornek: frontend/.env.example).",
    );
  }
  return { token, key };
}

async function tmdbSearch(kind, params) {
  const { token, key } = tmdbAuth();

  const url = new URL(`https://api.themoviedb.org/3/search/${kind}`);
  for (const [name, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") url.searchParams.set(name, String(value));
  }
  if (!token) url.searchParams.set("api_key", key);

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": USER_AGENT,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    throw new Error(`TMDB ${response.status} ${response.statusText}`);
  }
  return (await response.json()).results ?? [];
}

/**
 * TMDB'de bir film/dizi arar.
 *
 * Once tr-TR ile ariyoruz: Turkce afis varsa onu istiyoruz. Turkce kayitta
 * afis bos olabiliyor, o zaman ayni id'yi en-US sonuclarinda bulup oradaki
 * afisi aliyoruz. Yil filtresi sonuc dondurmezse yilsiz tekrar deniyoruz -
 * mock'taki yil ile TMDB'nin vizyon yili bir yil kayabiliyor.
 */
async function findOnTmdb(entry) {
  const kind = entry.type === "FILM" ? "movie" : "tv";
  const yearParam = kind === "movie" ? "year" : "first_air_date_year";
  const query = entry.originalTitle || entry.title;

  let results = await tmdbSearch(kind, {
    query,
    [yearParam]: entry.year,
    language: "tr-TR",
    include_adult: "false",
  });
  if (results.length === 0) {
    results = await tmdbSearch(kind, {
      query,
      language: "tr-TR",
      include_adult: "false",
    });
  }
  if (results.length === 0) return null;

  const match = results[0];
  if (match.poster_path) return { id: match.id, posterPath: match.poster_path };

  // Turkce kayitta afis yok; ayni id'nin varsayilan afisine dusuyoruz.
  const fallback = await tmdbSearch(kind, {
    query,
    language: "en-US",
    include_adult: "false",
  });
  const same = fallback.find((item) => item.id === match.id);
  return same?.poster_path ? { id: match.id, posterPath: same.poster_path } : null;
}

// ------------------------------------------------------------- OpenLibrary

async function openLibrarySearch(params) {
  const url = new URL("https://openlibrary.org/search.json");
  for (const [name, value] of Object.entries(params)) {
    if (value) url.searchParams.set(name, value);
  }
  url.searchParams.set("limit", "5");
  url.searchParams.set("fields", "title,author_name,cover_i,first_publish_year");

  const response = await fetch(url, {
    headers: { accept: "application/json", "user-agent": USER_AGENT },
  });
  if (!response.ok) {
    throw new Error(`OpenLibrary ${response.status} ${response.statusText}`);
  }
  return (await response.json()).docs ?? [];
}

/**
 * Kitap kapagini OpenLibrary'de arar.
 *
 * Uc deneme, giderek gevseyen: once ozgun baslik (katalog Ingilizce
 * agirlikli, "Die Verwandlung" "Donusum"den cok daha iyi esliyor), sonra
 * Turkce baslik, sonra alt basligi atilmis hali ("Sapiens: Hayvanlardan
 * Tanrilara" -> "Sapiens"). Hicbiri tutmazsa baslik+yazari tek serbest
 * sorguda deniyoruz: Turkce cevirisi baska adla gecen kitaplar (Orhan
 * Pamuk'un "Kar"i katalogda "Snow") ancak boyle bulunuyor.
 */
async function findOnOpenLibrary(entry) {
  const titles = [entry.originalTitle, entry.title]
    .filter(Boolean)
    .flatMap((title) =>
      title.includes(":") ? [title, title.split(":")[0].trim()] : [title],
    );

  for (const title of [...new Set(titles)]) {
    const docs = await openLibrarySearch({ title, author: entry.author });
    const hit = docs.find((doc) => doc.cover_i);
    if (hit) return { coverId: hit.cover_i };
    await sleep(120);
  }

  const docs = await openLibrarySearch({
    q: [entry.title, entry.author].filter(Boolean).join(" "),
  });
  const hit = docs.find((doc) => doc.cover_i);
  return hit ? { coverId: hit.cover_i } : null;
}

// -------------------------------------------------------------------- akis

async function main() {
  loadEnvFiles();

  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const onlyArg = args.find((arg) => arg.startsWith("--only="));
  const only = onlyArg ? onlyArg.slice("--only=".length).split(",") : null;

  // Ayni kapak birden fazla dosyada gecebiliyor (Forrest Gump hem ana
  // sayfada hem Filmler'de). Kapak dosya adiyla tekillestiriyoruz.
  const byCover = new Map();
  const sources = new Map();

  for (const [name, relative] of Object.entries(MOCK_FILES)) {
    const source = await readFile(path.join(ROOT, relative), "utf8");
    sources.set(name, source);
    for (const entry of parseEntries(source)) {
      if (!byCover.has(entry.coverUrl)) byCover.set(entry.coverUrl, entry);
    }
  }

  const targets = [...byCover.values()].filter(
    (entry) => !only || only.includes(FEATURE_OF_TYPE[entry.type]),
  );

  console.log(`${targets.length} kapak aranacak.\n`);

  const resolved = new Map();
  const missed = [];

  for (const entry of targets) {
    try {
      if (entry.type === "BOOK") {
        const hit = await findOnOpenLibrary(entry);
        if (hit) {
          resolved.set(entry.coverUrl, `${OPENLIBRARY_COVER_BASE}/${hit.coverId}-L.jpg`);
        } else {
          missed.push(entry);
        }
        await sleep(150);
      } else {
        const hit = await findOnTmdb(entry);
        if (hit) {
          resolved.set(entry.coverUrl, `${TMDB_IMAGE_BASE}${hit.posterPath}`);
          entry.tmdbId = hit.id;
        } else {
          missed.push(entry);
        }
      }
      console.log(`  ${resolved.has(entry.coverUrl) ? "+" : "-"} ${entry.title} (${entry.year})`);
    } catch (error) {
      missed.push(entry);
      console.log(`  ! ${entry.title} (${entry.year}) -> ${error.message}`);
    }
  }

  console.log(`\n${resolved.size} bulundu, ${missed.length} bulunamadi.`);
  if (missed.length > 0) {
    console.log("Yer tutucu SVG'sinde kalanlar:");
    for (const entry of missed) console.log(`  ${entry.title} -> ${entry.coverUrl}`);
  }

  // TMDB id'leri ileride backend'in seed migration'ina lazim olacak
  // (film_detail.tmdb_id / series_detail.tmdb_id); simdilik rapora yaziyoruz.
  const withIds = targets.filter((entry) => entry.tmdbId);
  if (withIds.length > 0) {
    console.log("\nTMDB id'leri (ileride backend seed'i icin):");
    for (const entry of withIds) {
      console.log(`  ${entry.title} (${entry.year}) = ${entry.tmdbId}`);
    }
  }

  if (dryRun) {
    console.log("\n--dry-run: dosyalar degistirilmedi.");
    return;
  }

  for (const [name, relative] of Object.entries(MOCK_FILES)) {
    const before = sources.get(name);
    let after = before;
    for (const [coverUrl, imageUrl] of resolved) {
      after = after.split(`"${coverUrl}"`).join(`"${imageUrl}"`);
    }
    if (after !== before) {
      await writeFile(path.join(ROOT, relative), after, "utf8");
      console.log(`yazildi: ${relative}`);
    }
  }
}

main().catch((error) => {
  console.error(`\n${error.message}`);
  process.exit(1);
});
