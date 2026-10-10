// js/audioManager.js - Web Audio API Engine for WebAR iOS/Android/Desktop
// Mengatasi kebijakan Autoplay iOS Safari secara permanen dengan memanfaatkan
// AudioContext hardware session yang dibuka saat tombol "Mulai" ditekan.

let globalAudioCtx = null;
const audioBufferCache = new Map();
const activePlayers = new Set();

/**
 * Mengambil atau membuat AudioContext singleton
 */
export function getAudioContext() {
    if (!globalAudioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
            globalAudioCtx = window.__globalAudioCtx || new AudioCtx();
            window.__globalAudioCtx = globalAudioCtx;
        }
    }
    return globalAudioCtx;
}

/**
 * Membuka kunci hardware audio output di browser mobile (khususnya iOS Safari)
 * Wajib dipanggil saat interaksi sentuh pertama kali (seperti klik tombol Mulai)
 */
export function unlockAudioContext() {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
    }

    try {
        // Mainkan 1-sampel silent buffer untuk mengaktifkan pipeline audio hardware di iOS
        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);
    } catch (e) {
        console.warn('⚠️ [AudioManager] Silent buffer trigger warning:', e);
    }
}

/**
 * Mengambil dan mendecode file audio ke AudioBuffer (dengan cache memori)
 * Kompatibel dengan semua versi WebKit / Safari (Promise & Callback syntax)
 */
export async function loadAudioBuffer(url) {
    if (!url) return null;
    if (audioBufferCache.has(url)) {
        return audioBufferCache.get(url);
    }
    const ctx = getAudioContext();
    if (!ctx) return null;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();

        const audioBuffer = await new Promise((resolve, reject) => {
            let isResolved = false;
            try {
                const res = ctx.decodeAudioData(
                    arrayBuffer,
                    (buf) => {
                        if (!isResolved) {
                            isResolved = true;
                            resolve(buf);
                        }
                    },
                    (err) => {
                        if (!isResolved) {
                            isResolved = true;
                            reject(err);
                        }
                    }
                );
                if (res && typeof res.then === 'function') {
                    res.then(resolve).catch(reject);
                }
            } catch (err) {
                reject(err);
            }
        });

        audioBufferCache.set(url, audioBuffer);
        return audioBuffer;
    } catch (err) {
        console.warn(`⚠️ [AudioManager] Gagal decode audio via WebAudio (${url}):`, err);
        return null;
    }
}

/**
 * Preload audio buffer di latar belakang agar siap putar dengan latensi 0ms
 */
export function preloadAudio(url) {
    if (!url) return;
    loadAudioBuffer(url).catch(() => {});
}

/**
 * Menghentikan semua pemutar Web Audio yang sedang aktif (misalnya saat tombol Home atau transisi)
 */
export function stopAllWebAudio() {
    activePlayers.forEach((player) => {
        try {
            player.pause();
            player.currentTime = 0;
        } catch (e) {}
    });
}

/**
 * Wrapper transparan yang menyediakan API identik dengan HTMLAudioElement
 * Mengalihkan pemutaran dari tag <audio> ke Web Audio API yang bebas blokir autoplay di iOS
 */
export class WebAudioPlayer {
    constructor(elementOrId) {
        this.element = typeof elementOrId === 'string'
            ? document.getElementById(elementOrId)
            : elementOrId;

        this._src = this.element ? (this.element.src || this.element.getAttribute('src')) : '';
        this._sourceNode = null;
        this._gainNode = null;
        this._startTime = 0;
        this._pauseOffset = 0;
        this._isPlaying = false;
        this._muted = false;
        this._volume = 1.0;
        this._buffer = null;
        this.onended = null;
        this._endedListeners = new Set();

        activePlayers.add(this);

        if (this.element) {
            this.element._webAudioWrapper = this;
        }
    }

    get src() {
        if (this.element && this.element.src) return this.element.src;
        return this._src;
    }

    set src(val) {
        if (this._src !== val) {
            this._src = val;
            this._buffer = null;
            if (this.element) {
                this.element.src = val;
            }
        }
    }

    get duration() {
        if (this._buffer) return this._buffer.duration;
        if (this.element && Number.isFinite(this.element.duration) && this.element.duration > 0) {
            return this.element.duration;
        }
        return 0;
    }

    get currentTime() {
        if (!this._isPlaying) return this._pauseOffset;
        const ctx = getAudioContext();
        if (!ctx) return this._pauseOffset;
        const elapsed = ctx.currentTime - this._startTime;
        const dur = this.duration || 9999;
        return Math.min(dur, this._pauseOffset + elapsed);
    }

    set currentTime(val) {
        const target = Math.max(0, Number(val) || 0);
        this._pauseOffset = target;
        if (this._isPlaying) {
            this._startSource(target);
        }
        if (this.element) {
            try { this.element.currentTime = target; } catch (e) {}
        }
    }

    get volume() {
        return this._volume;
    }

    set volume(val) {
        this._volume = Math.max(0, Math.min(1, Number(val) || 0));
        this._updateGain();
        if (this.element) {
            try { this.element.volume = this._volume; } catch (e) {}
        }
    }

    get muted() {
        return this._muted;
    }

    set muted(val) {
        this._muted = Boolean(val);
        this._updateGain();
        if (this.element) {
            try { this.element.muted = this._muted; } catch (e) {}
        }
    }

    _updateGain() {
        if (this._gainNode) {
            const ctx = getAudioContext();
            const targetVal = this._muted ? 0 : this._volume;
            if (ctx) {
                this._gainNode.gain.setValueAtTime(targetVal, ctx.currentTime);
            } else {
                this._gainNode.gain.value = targetVal;
            }
        }
    }

    async _getBuffer() {
        if (this._buffer) return this._buffer;
        const currentSrc = this.src;
        if (!currentSrc) return null;
        this._buffer = await loadAudioBuffer(currentSrc);
        return this._buffer;
    }

    _stopSource() {
        if (this._sourceNode) {
            try {
                this._sourceNode.onended = null;
                this._sourceNode.stop();
            } catch (e) {}
            this._sourceNode = null;
        }
    }

    _startSource(offset = 0) {
        const ctx = getAudioContext();
        if (!ctx || !this._buffer) return;

        this._stopSource();

        const source = ctx.createBufferSource();
        source.buffer = this._buffer;

        const gain = ctx.createGain();
        const targetVal = this._muted ? 0 : this._volume;
        gain.gain.setValueAtTime(targetVal, ctx.currentTime);

        source.connect(gain);
        gain.connect(ctx.destination);

        this._sourceNode = source;
        this._gainNode = gain;
        this._startTime = ctx.currentTime;
        this._pauseOffset = offset;
        this._isPlaying = true;

        source.onended = () => {
            if (this._sourceNode === source) {
                this._isPlaying = false;
                this._pauseOffset = 0;
                this._sourceNode = null;
                if (typeof this.onended === 'function') {
                    try { this.onended(); } catch (err) { console.error('Error onended:', err); }
                }
                this._endedListeners.forEach(listener => {
                    try { listener(); } catch (err) { console.error('Error ended listener:', err); }
                });
            }
        };

        const safeOffset = Math.min(Math.max(0, offset), Math.max(0, this._buffer.duration - 0.02));
        source.start(0, Math.max(0, safeOffset));
    }

    async play() {
        unlockAudioContext();
        const ctx = getAudioContext();

        // 1. Coba putar dengan Web Audio API (Kebal pemblokiran autoplay di iOS)
        if (ctx) {
            try {
                const buffer = await this._getBuffer();
                if (buffer) {
                    this._startSource(this._pauseOffset);
                    return Promise.resolve();
                }
            } catch (e) {
                console.warn('⚠️ [AudioManager] Web Audio play failed, falling back to HTMLAudioElement:', e);
            }
        }

        // 2. Fallback ke elemen HTML5 <audio> jika Web Audio buffer belum siap atau gagal
        if (this.element) {
            try {
                this.element.currentTime = this._pauseOffset;
                this.element.volume = this._volume;
                this.element.muted = this._muted;
                return this.element.play();
            } catch (err) {
                return Promise.reject(err);
            }
        }

        return Promise.resolve();
    }

    pause() {
        if (this._isPlaying) {
            const ctx = getAudioContext();
            if (ctx) {
                const elapsed = ctx.currentTime - this._startTime;
                this._pauseOffset = Math.min(this.duration || 9999, this._pauseOffset + elapsed);
            }
            this._stopSource();
            this._isPlaying = false;
        }
        if (this.element) {
            try { this.element.pause(); } catch (e) {}
        }
    }

    addEventListener(event, listener) {
        if (event === 'ended') {
            this._endedListeners.add(listener);
        }
        if (this.element) {
            this.element.addEventListener(event, listener);
        }
    }

    removeEventListener(event, listener) {
        if (event === 'ended') {
            this._endedListeners.delete(listener);
        }
        if (this.element) {
            this.element.removeEventListener(event, listener);
        }
    }
}

/**
 * Helper factory untuk membuat WebAudioPlayer
 */
export function createWebAudioPlayer(elementOrId) {
    return new WebAudioPlayer(elementOrId);
}
