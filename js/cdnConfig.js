/**
 * Konfigurasi Media Web AR (Local Files & Cloudflare R2 CDN)
 * 
 * - Suara / Audio: SELALU menggunakan file lokal (tidak dimasukkan ke CDN).
 * - Video: Secara default menggunakan file lokal dari repository untuk stabilitas maksimal.
 *          Dapat dialihkan ke CDN Cloudflare R2 dengan mengubah USE_CDN = true.
 */

// Ubah ke true jika ingin streaming video dari CDN Cloudflare R2
export const USE_CDN = false;

// URL CDN Cloudflare R2 untuk video
export const CDN_BASE = "https://pub-0ccbad8d976b4ef88dc10936c8837b7f.r2.dev";

/**
 * Mengubah path media lokal menjadi URL yang sesuai:
 * - Audio/Sound -> Selalu mengembalikan path lokal (./sounds/... atau ./compressed_ultra-videos/.../sound/...)
 * - Video       -> Mengembalikan path lokal jika USE_CDN = false, atau CDN_BASE jika USE_CDN = true
 */
export function getMediaUrl(path) {
    if (!path) return path;

    // Bersihkan path dari awalan ./ atau /
    const cleanPath = path.replace(/^\.\//, "").replace(/^\//, "");

    // 1. Suara / Audio SELALU gunakan file lokal sesuai instruksi
    if (
        cleanPath.startsWith("sounds/") ||
        cleanPath.includes("/sound/") ||
        cleanPath.toLowerCase().endsWith(".mp3") ||
        cleanPath.toLowerCase().endsWith(".wav") ||
        cleanPath.toLowerCase().endsWith(".ogg")
    ) {
        return `./${cleanPath}`;
    }

    // 2. Jika USE_CDN mati, gunakan file lokal
    if (!USE_CDN) {
        return `./${cleanPath}`;
    }

    // 3. Jika path sudah berupa URL absolut HTTP/HTTPS, jangan ubah
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }

    // 4. Jika USE_CDN aktif, arahkan video ke CDN
    return `${CDN_BASE}/${cleanPath}`;
}

if (typeof window !== "undefined") {
    window.USE_CDN = USE_CDN;
    window.CDN_BASE = CDN_BASE;
    window.getMediaUrl = getMediaUrl;
}
