import { dom, videos } from './state.js';
import { getMediaUrl } from '../cdnConfig.js?v=20261102b';
import { preloadAudio } from '../audioManager.js';

export const PART_CONFIG = {
    1: {
        videos: [
            { id: 'vid-part1-pantai', localSrc: './compressed_ultra-videos/chapter3/part1/PANTAI-5.mp4' },
            { id: 'vid-part1-kerajaan', localSrc: './compressed_ultra-videos/chapter3/part1/KERAJAAN-2.mp4' },
            { id: 'vid-part1-anakkecil', localSrc: './compressed_ultra-videos/chapter3/part1/ANAKKECIL-4.mp4' },
            { id: 'vid-part1-mascot3', localSrc: './compressed_ultra-videos/chapter3/part1/MASCOT-3.mp4' },
            { id: 'vid-part1-mascot1', localSrc: './compressed_ultra-videos/chapter3/part1/MASCOT-1.mp4' }
        ],
        audio: { id: 'sound-v1', localSrc: './sounds/chapter3/output-sounds/sound-v1.mp3' }
    },
    2: {
        videos: [
            { id: 'vid-part2-kerajaan', localSrc: './compressed_ultra-videos/chapter3/part2/KERAJAAN-4.mp4' },
            { id: 'vid-part2-anakkecil', localSrc: './compressed_ultra-videos/chapter3/part2/ANAKKECIL-3.mp4' },
            { id: 'vid-part2-makanan', localSrc: './compressed_ultra-videos/chapter3/part2/MAKANAN-2.mp4' },
            { id: 'vid-part2-tangan', localSrc: './compressed_ultra-videos/chapter3/part2/TANGAN-1.mp4' },
            { id: 'vid-part2-teks', localSrc: './compressed_ultra-videos/chapter3/part2/TEKS-5.mp4' }
        ],
        audio: { id: 'sound-v2', localSrc: './sounds/chapter3/output-sounds/sound-v2.mp3' }
    },
    3: {
        videos: [
            { id: 'vid-part3-kerajaan', localSrc: './compressed_ultra-videos/chapter3/part3/KETAJAAN-2.mp4' },
            { id: 'vid-part3-orang-mascot', localSrc: './compressed_ultra-videos/chapter3/part3/ORANG-MASCOT-1.mp4' },
            { id: 'vid-part3-teks', localSrc: './compressed_ultra-videos/chapter3/part3/TEKS-3.mp4' }
        ],
        audio: { id: 'sound-v3', localSrc: './sounds/chapter3/output-sounds/sound-v3.mp3' }
    },
    4: {
        videos: [
            { id: 'vid-part4-orangtidur', localSrc: './compressed_ultra-videos/chapter3/part4/ORANGTIDUR-1.mp4' },
            { id: 'vid-part4-teks', localSrc: './compressed_ultra-videos/chapter3/part4/TEKS-2.mp4' }
        ],
        audio: { id: 'sound-v4', localSrc: './sounds/chapter3/output-sounds/sound-v4.mp3' }
    },
    5: {
        videos: [
            { id: 'vid-part5-pantai', localSrc: './compressed_ultra-videos/chapter3/part5/PANTAI-4.mp4' },
            { id: 'vid-part5-anaknangis', localSrc: './compressed_ultra-videos/chapter3/part5/ANAKNANGIS-3.mp4' },
            { id: 'vid-part5-mascotselimut', localSrc: './compressed_ultra-videos/chapter3/part5/MASCOTSELIMUT-2.mp4' },
            { id: 'vid-part5-mascot', localSrc: './compressed_ultra-videos/chapter3/part5/MASCOT-1.mp4' },
            { id: 'vid-part5-teks', localSrc: './compressed_ultra-videos/chapter3/part5/TEKS-5.mp4' }
        ],
        audio: { id: 'sound-v5', localSrc: './sounds/chapter3/output-sounds/sound-v5.mp3' }
    },
    6: {
        videos: [
            { id: 'vid-part6-pantai', localSrc: './compressed_ultra-videos/chapter3/part6/PANTAI-3.mp4' },
            { id: 'vid-part6-mascotpantai', localSrc: './compressed_ultra-videos/chapter3/part6/MASCOTPANTAI-2.mp4' },
            { id: 'vid-part6-mascot', localSrc: './compressed_ultra-videos/chapter3/part6/MASCOT-1.mp4' },
            { id: 'vid-part6-teks', localSrc: './compressed_ultra-videos/chapter3/part6/TEKS-4.mp4' }
        ],
        audio: { id: 'sound-v6', localSrc: './sounds/chapter3/output-sounds/sound-v6.mp3' }
    },
    7: {
        videos: [
            { id: 'vid-part7-laut', localSrc: './compressed_ultra-videos/chapter3/part7/LAUT-5.mp4' },
            { id: 'vid-part7-lumut', localSrc: './compressed_ultra-videos/chapter3/part7/LUMUT-4.mp4' },
            { id: 'vid-part7-anakkecil', localSrc: './compressed_ultra-videos/chapter3/part7/ANAKKECIL-3.mp4' },
            { id: 'vid-part7-gelembung', localSrc: './compressed_ultra-videos/chapter3/part7/GELEMBUNG-2.mp4' },
            { id: 'vid-part7-mascot', localSrc: './compressed_ultra-videos/chapter3/part7/MASCOT-1.mp4' },
            { id: 'vid-part7-teks', localSrc: './compressed_ultra-videos/chapter3/part7/TEKS-6.mp4' }
        ],
        audio: { id: 'sound-v7', localSrc: './sounds/chapter3/output-sounds/sound-v7.mp3' }
    },
    8: {
        videos: [
            { id: 'vid-part8-background', localSrc: './compressed_ultra-videos/chapter3/part8/BACKGROUND.mp4' },
            { id: 'vid-part8-batu', localSrc: './compressed_ultra-videos/chapter3/part8/BATU.mp4' },
            { id: 'vid-part8-anakkecil', localSrc: './compressed_ultra-videos/chapter3/part8/ANAKKECIL.mp4' },
            { id: 'vid-part8-mascot', localSrc: './compressed_ultra-videos/chapter3/part8/MASCOT.mp4' },
            { id: 'vid-part8-kalimat', localSrc: './compressed_ultra-videos/chapter3/part8/KALIMAT.mp4' }
        ],
        audio: { id: 'sound-v8', localSrc: './sounds/chapter3/output-sounds/sound-v8.mp3' }
    }
};

const loadedParts = new Set();

/**
 * Resolves media source URL: utilizes local path directly or handles CDN fallback
 */
function resolveUrl(item) {
    if (!item) return '';
    // Gunakan local path langsung jika tersedia
    return item.localSrc || item.src;
}

/**
 * Memuat video dan audio untuk part tertentu secara on-demand / background prefetch
 * @param {number} partNum - Nomor part (1 s/d 8)
 */
export function preloadPart(partNum) {
    if (loadedParts.has(partNum)) return;
    const config = PART_CONFIG[partNum];
    if (!config) return;
    loadedParts.add(partNum);

    console.log(`📥 [Chapter 3 Prefetch] Memulai background prefetch Part ${partNum}...`);

    if (config.audio) {
        const audioSrc = resolveUrl(config.audio);
        preloadAudio(audioSrc);
        const aEl = document.getElementById(config.audio.id);
        if (aEl && (!aEl.src || aEl.src === '' || aEl.src.endsWith('#'))) {
            aEl.src = audioSrc;
            aEl.preload = 'none';
        }
    }

    if (config.videos) {
        config.videos.forEach(v => {
            const vEl = document.getElementById(v.id);
            if (vEl && (!vEl.src || vEl.src === '' || vEl.src.endsWith('#'))) {
                const videoSrc = resolveUrl(v);
                vEl.src = videoSrc;
                vEl.preload = 'auto';
                vEl.load();
            }
        });
    }
}

/**
 * Memastikan part yang akan diputar sudah memiliki src
 */
export function ensurePartLoaded(partNum) {
    preloadPart(partNum);
}

/**
 * Menghentikan dan mengosongkan decoder video dari part yang sudah selesai
 */
export function releasePartVideos(partNum) {
    if (videos['part' + partNum]) {
        videos['part' + partNum].forEach(v => {
            if (v) {
                try {
                    v.pause();
                    v.currentTime = 0;
                } catch (e) { }
            }
        });
    }
}

// Preload audio Part 1 segera di awal agar siap putar dengan 0ms latensi
if (PART_CONFIG[1] && PART_CONFIG[1].audio) {
    preloadAudio(resolveUrl(PART_CONFIG[1].audio));
}
