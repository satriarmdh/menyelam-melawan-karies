import { state, dom, videos } from '../state.js';
import { fadeInContainer, fadeOutContainer, hideAllContainersExcept, isContainerVisible } from '../utils.js';
import { preloadPart, releasePartVideos } from '../loader.js';

export async function playPart4() {
    if (state.isPlaying || !state.part3Finished || (state.currentPart !== 3 && state.currentPart !== 4) || state.isTransitioning) {
        console.log('⏹️ [Part 4] Dibatalkan: Sedang memutar part lain atau belum waktunya.');
        return;
    }

    preloadPart(5);

    state.isMarkerLocked = true;
    state.lockedMarker = 4;
    state.isTransitioning = true;
    console.log('🔒 [Part 4] Marker LOCKED');

    hideAllContainersExcept(dom.containerPart4);

    const allContainers = [dom.containerPart1, dom.containerPart2, dom.containerPart3, dom.containerPart5, dom.containerPart6, dom.containerPart7];
    const previousContainer = allContainers.find(c => c && isContainerVisible(c));

    if (previousContainer) {
        fadeOutContainer(previousContainer, 400, async () => {
            await startPart4Videos();
        });
    } else {
        await startPart4Videos();
    }
}

async function startPart4Videos() {
    console.log('🎬 [Part 4] Memulai pemutaran video...');
    const wasVisible = isContainerVisible(dom.containerPart4);
    state.currentPart = 4;
    state.isPlaying = true;

    dom.statusBar.textContent = 'Part 4 diputar';
    dom.statusBar.classList.add('tracking');
    dom.statusBar.classList.remove('finished');

    videos.part4.forEach(v => {
        if (!v) return;
        v.muted = true;
        if (v.currentTime > 0) {
            v.pause();
            v.currentTime = 0;
        }
    });

    if (dom.containerPart4 && !wasVisible) fadeInContainer(dom.containerPart4, 300);
    else if (dom.containerPart4) dom.containerPart4.setAttribute('visible', true);

    const playPromises = videos.part4.map(v => {
        if (!v) return Promise.resolve();
        v.muted = true;
        return v.play().catch(e => console.error('❌ [Part 4] Video play error:', e));
    });
    await Promise.race([Promise.all(playPromises), new Promise(r => setTimeout(r, 600))]);

    videos.part4.forEach(v => {
        if (!v) return;
        const preventBlackScreen = function () {
            if (this.duration && this.currentTime > 1.0 && (this.duration - this.currentTime <= 0.5)) {
                this.pause();
                this.removeEventListener('timeupdate', preventBlackScreen);
            }
        };
        v.addEventListener('timeupdate', preventBlackScreen);
    });

    try {
        if (dom.soundV4) {
            dom.soundV4.pause();
            dom.soundV4.currentTime = 0;
            dom.soundV4.muted = false;
            dom.soundV4.volume = 1.0;
            const p = dom.soundV4.play();
            if (p !== undefined) {
                p.catch((err) => {
                    console.warn('⚠️ [Part 4] Audio play deferred:', err);
                    const resumeAudio = () => {
                        if (state.currentPart === 4 && !state.part4Finished) {
                            dom.soundV4.muted = false;
                            dom.soundV4.volume = 1.0;
                            dom.soundV4.play().catch(() => { });
                        }
                        window.removeEventListener('click', resumeAudio, true);
                        window.removeEventListener('touchend', resumeAudio, true);
                    };
                    window.addEventListener('click', resumeAudio, { once: true, capture: true });
                    window.addEventListener('touchend', resumeAudio, { once: true, capture: true });
                });
            }
        }
    } catch (e) {
        console.error('❌ [Part 4] Audio error:', e);
    }

    state.isTransitioning = false;

    let hasFinished = false;
    const finishPart4 = () => {
        if (hasFinished) return;
        hasFinished = true;
        clearTimeout(safetyTimer);

        console.log('✅ [Part 4] Selesai!');
        state.isPlaying = false;
        state.part4Finished = true;

        releasePartVideos(4);
        preloadPart(5);

        if (dom.containerPart4) {
            fadeOutContainer(dom.containerPart4, 250, () => {
                releasePartVideos(4);
            });
        }

        state.isMarkerLocked = false;
        state.lockedMarker = null;

        dom.statusBar.textContent = 'Part 4 selesai! Arahkan kamera ke Marker 5';
        dom.statusBar.classList.remove('tracking');
        dom.statusBar.classList.add('finished');
    };

    if (dom.soundV4) {
        dom.soundV4.onended = finishPart4;
    }

    const soundDur = (dom.soundV4 && Number.isFinite(dom.soundV4.duration) && dom.soundV4.duration > 0) ? dom.soundV4.duration : 15;
    const videoDurs = videos.part4.map(v => (v && Number.isFinite(v.duration) && v.duration > 0) ? v.duration : 0);
    const fallbackDur = Math.max(soundDur, ...videoDurs, 15);
    const safetyTimer = setTimeout(finishPart4, (fallbackDur + 0.5) * 1000);
}

export function initPart4() {
    if (!dom.target4) return;

    dom.target4.addEventListener('targetFound', () => {
        state.isTargetInView[4] = true;
        state.pendingPart = 4;
        if (!state.hasStarted) return;
        if (!state.cameraReady) return;

        const now = Date.now();
        if (now < state.markerIgnoreUntil && state.activeMarkerDetection !== 4) return;

        if (state.isMarkerLocked && state.lockedMarker !== 4) {
            dom.statusBar.textContent = `Tunggu Part ${state.lockedMarker} selesai dulu`;
            return;
        }

        if (state.currentPart > 4) {
            dom.statusBar.textContent = 'Tidak bisa kembali ke Part sebelumnya. Tekan tombol Ulangi jika perlu.';
            if (dom.containerPart4) dom.containerPart4.setAttribute('visible', false);
            return;
        }

        if (state.part3Finished && !state.part4Finished && !state.isPlaying && !state.isTransitioning) {
            state.activeMarkerDetection = 4;
            state.markerIgnoreUntil = now + state.MARKER_IGNORE_DURATION;
            playPart4();
            setTimeout(() => {
                if (!state.isPlaying) state.activeMarkerDetection = null;
            }, state.MARKER_IGNORE_DURATION);
        } else if (!state.part3Finished) {
            dom.statusBar.textContent = 'Selesaikan Part 3 dulu';
        } else if (state.part4Finished && state.currentPart === 4 && !state.isPlaying) {
            dom.statusBar.textContent = 'Tap untuk ulang, atau scan Marker 5';
            state.lastScannedMarker = 4;
        }
    });

    dom.target4.addEventListener('targetLost', () => {
        state.isTargetInView[4] = false;
    });
}
