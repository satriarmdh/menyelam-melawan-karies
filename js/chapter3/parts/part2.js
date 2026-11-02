import { state, dom, videos } from '../state.js';
import { fadeInContainer, fadeOutContainer, fadeAudioOut, hideAllContainersExcept, isContainerVisible } from '../utils.js';
import { ensurePartLoaded, preloadPart, releasePartVideos } from '../loader.js';

export async function playPart2() {
    if (state.isPlaying || !state.part1Finished || (state.currentPart !== 1 && state.currentPart !== 2) || state.isTransitioning) {
        console.log('⏹️ [Part 2] Dibatalkan: Sedang memutar part lain atau belum waktunya.');
        return;
    }

    ensurePartLoaded(2);
    preloadPart(3);

    state.isMarkerLocked = true;
    state.lockedMarker = 2;
    state.isTransitioning = true;
    console.log('🔒 [Part 2] Marker LOCKED');

    hideAllContainersExcept(dom.containerPart2);
    fadeAudioOut(dom.soundV1, 300);

    const allContainers = [dom.containerPart1, dom.containerPart3, dom.containerPart4, dom.containerPart5, dom.containerPart6, dom.containerPart7];
    const previousContainer = allContainers.find(c => c && isContainerVisible(c));

    if (previousContainer) {
        fadeOutContainer(previousContainer, 400, async () => {
            await startPart2Videos();
        });
    } else {
        await startPart2Videos();
    }
}

async function startPart2Videos() {
    console.log('🎬 [Part 2] Memulai pemutaran video...');
    const wasVisible = isContainerVisible(dom.containerPart2);
    state.currentPart = 2;
    state.isPlaying = true;

    dom.statusBar.textContent = 'Part 2 diputar';
    dom.statusBar.classList.add('tracking');
    dom.statusBar.classList.remove('finished');

    videos.part2.forEach(v => {
        if (!v) return;
        v.muted = true;
        if (v.currentTime > 0) {
            v.pause();
            v.currentTime = 0;
        }
    });

    if (dom.containerPart2 && !wasVisible) fadeInContainer(dom.containerPart2, 300);
    else if (dom.containerPart2) dom.containerPart2.setAttribute('visible', true);

    const playPromises = videos.part2.map(v => {
        if (!v) return Promise.resolve();
        v.muted = true;
        return v.play().catch(e => console.error('❌ [Part 2] Video play error:', e));
    });
    await Promise.race([Promise.all(playPromises), new Promise(r => setTimeout(r, 600))]);

    // Freeze frame sebelum tamat
    videos.part2.forEach(v => {
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
        if (dom.soundV2) {
            dom.soundV2.pause();
            dom.soundV2.currentTime = 0;
            dom.soundV2.muted = false;
            dom.soundV2.volume = 1.0;
            const p = dom.soundV2.play();
            if (p !== undefined) {
                p.catch((err) => {
                    console.warn('⚠️ [Part 2] Audio play deferred:', err);
                    const resumeAudio = () => {
                        if (state.currentPart === 2 && !state.part2Finished) {
                            dom.soundV2.muted = false;
                            dom.soundV2.volume = 1.0;
                            dom.soundV2.play().catch(() => { });
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
        console.error('❌ [Part 2] Audio error:', e);
    }

    state.isTransitioning = false;

    let hasFinished = false;
    const finishPart2 = () => {
        if (hasFinished) return;
        hasFinished = true;
        clearTimeout(safetyTimer);

        console.log('✅ [Part 2] Selesai!');
        state.isPlaying = false;
        state.part2Finished = true;

        releasePartVideos(2);
        preloadPart(3);
            if (dom.containerPart2) {
            fadeOutContainer(dom.containerPart2, 250, () => {
                releasePartVideos(2);
        preloadPart(3);
            });
        }

        state.isMarkerLocked = false;
        state.lockedMarker = null;

        dom.statusBar.textContent = 'Part 2 selesai! Arahkan kamera ke Marker 3';
        dom.statusBar.classList.remove('tracking');
        dom.statusBar.classList.add('finished');
    };

    if (dom.soundV2) {
        dom.soundV2.onended = finishPart2;
    }

    const soundDur = (dom.soundV2 && Number.isFinite(dom.soundV2.duration) && dom.soundV2.duration > 0) ? dom.soundV2.duration : 15;
    const videoDurs = videos.part2.map(v => (v && Number.isFinite(v.duration) && v.duration > 0) ? v.duration : 0);
    const fallbackDur = Math.max(soundDur, ...videoDurs, 15);
    const safetyTimer = setTimeout(finishPart2, (fallbackDur + 0.5) * 1000);
}

export function initPart2() {
    if (!dom.target2) return;

    dom.target2.addEventListener('targetFound', () => {
        state.isTargetInView[2] = true;
        state.pendingPart = 2;
        if (!state.hasStarted) return;
        if (!state.cameraReady) return;

        const now = Date.now();
        if (now < state.markerIgnoreUntil && state.activeMarkerDetection !== 2) return;

        if (state.isMarkerLocked && state.lockedMarker !== 2) {
            dom.statusBar.textContent = `Tunggu Part ${state.lockedMarker} selesai dulu`;
            return;
        }

        if (state.currentPart > 2) {
            dom.statusBar.textContent = 'Tidak bisa kembali ke Part sebelumnya. Tekan tombol Ulangi jika perlu.';
            if (dom.containerPart2) dom.containerPart2.setAttribute('visible', false);
            return;
        }

        if (state.part1Finished && !state.part2Finished && !state.isPlaying && !state.isTransitioning) {
            state.activeMarkerDetection = 2;
            state.markerIgnoreUntil = now + state.MARKER_IGNORE_DURATION;
            playPart2();
            setTimeout(() => {
                if (!state.isPlaying) state.activeMarkerDetection = null;
            }, state.MARKER_IGNORE_DURATION);
        } else if (!state.part1Finished) {
            dom.statusBar.textContent = 'Selesaikan Part 1 dulu';
        } else if (state.part2Finished && state.currentPart === 2 && !state.isPlaying) {
            dom.statusBar.textContent = 'Tap untuk ulang, atau scan Marker 3';
            state.lastScannedMarker = 2;
        }
    });

    dom.target2.addEventListener('targetLost', () => {
        state.isTargetInView[2] = false;
    });
}
