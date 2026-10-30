import { state, dom, videos } from '../state.js';
import { fadeInContainer, fadeOutContainer, hideAllContainersExcept, isContainerVisible } from '../utils.js';
import { releasePartVideos, preloadPart } from '../loader.js';

export async function playPart7() {
    if (state.isPlaying || !state.part6Finished || (state.currentPart !== 6 && state.currentPart !== 7) || state.isTransitioning) {
        console.log('⏹️ [Part 7] Dibatalkan: Sedang memutar part lain atau belum waktunya.');
        return;
    }

    state.isMarkerLocked = true;
    state.lockedMarker = 7;
    state.isTransitioning = true;
    console.log('🔒 [Part 7] Marker LOCKED');

    hideAllContainersExcept(dom.containerPart7);

    const allContainers = [dom.containerPart1, dom.containerPart2, dom.containerPart3, dom.containerPart4, dom.containerPart5, dom.containerPart6];
    const previousContainer = allContainers.find(c => c && isContainerVisible(c));

    if (previousContainer) {
        fadeOutContainer(previousContainer, 400, async () => {
            await startPart7Videos();
        });
    } else {
        await startPart7Videos();
    }
}

async function startPart7Videos() {
    console.log('🎬 [Part 7] Memulai pemutaran video...');
    const wasVisible = isContainerVisible(dom.containerPart7);
    state.currentPart = 7;
    state.isPlaying = true;

    dom.statusBar.textContent = 'Part 7 diputar';
    dom.statusBar.classList.add('tracking');
    dom.statusBar.classList.remove('finished');

    videos.part7.forEach(v => {
        if (!v) return;
        v.muted = true;
        if (v.currentTime > 0) {
            v.pause();
            v.currentTime = 0;
        }
    });

    if (dom.containerPart7 && !wasVisible) fadeInContainer(dom.containerPart7, 300);
    else if (dom.containerPart7) dom.containerPart7.setAttribute('visible', true);

    const playPromises = videos.part7.map(v => {
        if (!v) return Promise.resolve();
        v.muted = true;
        return v.play().catch(e => console.error('❌ [Part 7] Video play error:', e));
    });
    await Promise.race([Promise.all(playPromises), new Promise(r => setTimeout(r, 600))]);

    videos.part7.forEach(v => {
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
        if (dom.soundV7) {
            dom.soundV7.pause();
            dom.soundV7.currentTime = 0;
            dom.soundV7.muted = false;
            dom.soundV7.volume = 1.0;
            const p = dom.soundV7.play();
            if (p !== undefined) {
                p.catch((err) => {
                    console.warn('⚠️ [Part 7] Audio play deferred:', err);
                    const resumeAudio = () => {
                        if (state.currentPart === 7 && !state.part7Finished) {
                            dom.soundV7.muted = false;
                            dom.soundV7.volume = 1.0;
                            dom.soundV7.play().catch(() => { });
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
        console.error('❌ [Part 7] Audio error:', e);
    }

    state.isTransitioning = false;

    let hasFinished = false;
    const finishPart7 = () => {
        if (hasFinished) return;
        hasFinished = true;
        clearTimeout(safetyTimer);

        console.log('✅ [Part 7] Selesai!');
        state.isPlaying = false;
        state.part7Finished = true;

        releasePartVideos(7);
        preloadPart(8);

        if (dom.containerPart7) {
            fadeOutContainer(dom.containerPart7, 250, () => {
                releasePartVideos(7);
            });
        }

        state.isMarkerLocked = false;
        state.lockedMarker = null;

        dom.statusBar.textContent = 'Part 7 selesai! Arahkan kamera ke Marker 8';
        dom.statusBar.classList.remove('tracking');
        dom.statusBar.classList.add('finished');
    };

    if (dom.soundV7) {
        dom.soundV7.onended = finishPart7;
    }

    const soundDur = (dom.soundV7 && Number.isFinite(dom.soundV7.duration) && dom.soundV7.duration > 0) ? dom.soundV7.duration : 15;
    const videoDurs = videos.part7.map(v => (v && Number.isFinite(v.duration) && v.duration > 0) ? v.duration : 0);
    const fallbackDur = Math.max(soundDur, ...videoDurs, 15);
    const safetyTimer = setTimeout(finishPart7, (fallbackDur + 0.5) * 1000);
}

export function initPart7() {
    if (!dom.target7) return;

    dom.target7.addEventListener('targetFound', () => {
        state.isTargetInView[7] = true;
        state.pendingPart = 7;
        if (!state.hasStarted) return;
        if (!state.cameraReady) return;

        const now = Date.now();
        if (now < state.markerIgnoreUntil && state.activeMarkerDetection !== 7) return;

        if (state.isMarkerLocked && state.lockedMarker !== 7) {
            dom.statusBar.textContent = `Tunggu Part ${state.lockedMarker} selesai dulu`;
            return;
        }

        if (state.currentPart > 7) {
            dom.statusBar.textContent = 'Tidak bisa kembali ke Part sebelumnya. Tekan tombol Ulangi jika perlu.';
            if (dom.containerPart7) dom.containerPart7.setAttribute('visible', false);
            return;
        }

        if (state.part6Finished && !state.part7Finished && !state.isPlaying && !state.isTransitioning) {
            state.activeMarkerDetection = 7;
            state.markerIgnoreUntil = now + state.MARKER_IGNORE_DURATION;
            playPart7();
            setTimeout(() => {
                if (!state.isPlaying) state.activeMarkerDetection = null;
            }, state.MARKER_IGNORE_DURATION);
        } else if (!state.part6Finished) {
            dom.statusBar.textContent = 'Selesaikan Part 6 dulu';
        } else if (state.part7Finished && state.currentPart === 7 && !state.isPlaying) {
            dom.statusBar.textContent = 'Tap untuk ulang, atau scan Marker 8';
            state.lastScannedMarker = 7;
        }
    });

    dom.target7.addEventListener('targetLost', () => {
        state.isTargetInView[7] = false;
    });
}
