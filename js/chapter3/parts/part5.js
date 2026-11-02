import { state, dom, videos } from '../state.js';
import { fadeInContainer, fadeOutContainer, fadeAudioOut, hideAllContainersExcept, isContainerVisible } from '../utils.js';
import { ensurePartLoaded, preloadPart, releasePartVideos } from '../loader.js';

export async function playPart5() {
    if (state.isPlaying || !state.part4Finished || (state.currentPart !== 4 && state.currentPart !== 5) || state.isTransitioning) {
        console.log('⏹️ [Part 5] Dibatalkan: Sedang memutar part lain atau belum waktunya.');
        return;
    }

    ensurePartLoaded(5);
    preloadPart(6);

    state.isMarkerLocked = true;
    state.lockedMarker = 5;
    state.isTransitioning = true;
    console.log('🔒 [Part 5] Marker LOCKED');

    hideAllContainersExcept(dom.containerPart5);
    fadeAudioOut(dom.soundV4, 300);

    const allContainers = [dom.containerPart1, dom.containerPart2, dom.containerPart3, dom.containerPart4, dom.containerPart6, dom.containerPart7];
    const previousContainer = allContainers.find(c => c && isContainerVisible(c));

    if (previousContainer) {
        fadeOutContainer(previousContainer, 400, async () => {
            await startPart5Videos();
        });
    } else {
        await startPart5Videos();
    }
}

async function startPart5Videos() {
    console.log('🎬 [Part 5] Memulai pemutaran video...');
    const wasVisible = isContainerVisible(dom.containerPart5);
    state.currentPart = 5;
    state.isPlaying = true;

    dom.statusBar.textContent = 'Part 5 diputar';
    dom.statusBar.classList.add('tracking');
    dom.statusBar.classList.remove('finished');

    videos.part5.forEach(v => {
        if (!v) return;
        v.muted = true;
        if (v.currentTime > 0) {
            v.pause();
            v.currentTime = 0;
        }
    });

    if (dom.containerPart5 && !wasVisible) fadeInContainer(dom.containerPart5, 300);
    else if (dom.containerPart5) dom.containerPart5.setAttribute('visible', true);

    const playPromises = videos.part5.map(v => {
        if (!v) return Promise.resolve();
        v.muted = true;
        return v.play().catch(e => console.error('❌ [Part 5] Video play error:', e));
    });
    await Promise.race([Promise.all(playPromises), new Promise(r => setTimeout(r, 600))]);

    videos.part5.forEach(v => {
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
        if (dom.soundV5) {
            dom.soundV5.pause();
            dom.soundV5.currentTime = 0;
            dom.soundV5.muted = false;
            dom.soundV5.volume = 1.0;
            const p = dom.soundV5.play();
            if (p !== undefined) {
                p.catch((err) => {
                    console.warn('⚠️ [Part 5] Audio play deferred:', err);
                    const resumeAudio = () => {
                        if (state.currentPart === 5 && !state.part5Finished) {
                            dom.soundV5.muted = false;
                            dom.soundV5.volume = 1.0;
                            dom.soundV5.play().catch(() => { });
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
        console.error('❌ [Part 5] Audio error:', e);
    }

    state.isTransitioning = false;

    let hasFinished = false;
    const finishPart5 = () => {
        if (hasFinished) return;
        hasFinished = true;
        clearTimeout(safetyTimer);

        console.log('✅ [Part 5] Selesai!');
        state.isPlaying = false;
        state.part5Finished = true;

        releasePartVideos(5);
        preloadPart(6);
            if (dom.containerPart5) {
            fadeOutContainer(dom.containerPart5, 250, () => {
                releasePartVideos(5);
        preloadPart(6);
            });
        }

        state.isMarkerLocked = false;
        state.lockedMarker = null;

        dom.statusBar.textContent = 'Part 5 selesai! Arahkan kamera ke Marker 6';
        dom.statusBar.classList.remove('tracking');
        dom.statusBar.classList.add('finished');
    };

    if (dom.soundV5) {
        dom.soundV5.onended = finishPart5;
    }

    const soundDur = (dom.soundV5 && Number.isFinite(dom.soundV5.duration) && dom.soundV5.duration > 0) ? dom.soundV5.duration : 15;
    const videoDurs = videos.part5.map(v => (v && Number.isFinite(v.duration) && v.duration > 0) ? v.duration : 0);
    const fallbackDur = Math.max(soundDur, ...videoDurs, 15);
    const safetyTimer = setTimeout(finishPart5, (fallbackDur + 0.5) * 1000);
}

export function initPart5() {
    if (!dom.target5) return;

    dom.target5.addEventListener('targetFound', () => {
        state.isTargetInView[5] = true;
        state.pendingPart = 5;
        if (!state.hasStarted) return;
        if (!state.cameraReady) return;

        const now = Date.now();
        if (now < state.markerIgnoreUntil && state.activeMarkerDetection !== 5) return;

        if (state.isMarkerLocked && state.lockedMarker !== 5) {
            dom.statusBar.textContent = `Tunggu Part ${state.lockedMarker} selesai dulu`;
            return;
        }

        if (state.currentPart > 5) {
            dom.statusBar.textContent = 'Tidak bisa kembali ke Part sebelumnya. Tekan tombol Ulangi jika perlu.';
            if (dom.containerPart5) dom.containerPart5.setAttribute('visible', false);
            return;
        }

        if (state.part4Finished && !state.part5Finished && !state.isPlaying && !state.isTransitioning) {
            state.activeMarkerDetection = 5;
            state.markerIgnoreUntil = now + state.MARKER_IGNORE_DURATION;
            playPart5();
            setTimeout(() => {
                if (!state.isPlaying) state.activeMarkerDetection = null;
            }, state.MARKER_IGNORE_DURATION);
        } else if (!state.part4Finished) {
            dom.statusBar.textContent = 'Selesaikan Part 4 dulu';
        } else if (state.part5Finished && state.currentPart === 5 && !state.isPlaying) {
            dom.statusBar.textContent = 'Tap untuk ulang, atau scan Marker 6';
            state.lastScannedMarker = 5;
        }
    });

    dom.target5.addEventListener('targetLost', () => {
        state.isTargetInView[5] = false;
    });
}
