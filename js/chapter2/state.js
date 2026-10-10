import { createWebAudioPlayer } from '../audioManager.js';

export const state = {
    videosLoaded: 0,
    videosBuffered: 0,
    allReady: false,
    allFullyBuffered: false,
    audioEnabled: false,
    currentPart: 0,
    isPlaying: false,
    isTransitioning: false,
    part1Finished: false,
    part2Finished: false,
    part3Finished: false,
    part4Finished: false,
    part5Finished: false,
    part6Finished: false,
    part7Finished: false,
    part8Finished: false,
    lastScannedMarker: 0,
    isMarkerLocked: false,
    lockedMarker: null,
    activeMarkerDetection: null,
    markerIgnoreUntil: 0,
    MARKER_IGNORE_DURATION: 1000,
    cameraReady: false,
    isTargetInView: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false }
};

export const dom = {
    statusBar: document.getElementById('statusBar'),
    resetButton: document.getElementById('resetButton'),
    arScene: document.getElementById('arScene'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    loadingProgress: document.getElementById('loadingProgress'),
    startButton: document.getElementById('startButton'),
    
    containerPart1: document.querySelector('#video-container-part1'),
    containerPart2: document.querySelector('#video-container-part2'),
    containerPart3: document.querySelector('#video-container-part3'),
    containerPart4: document.querySelector('#video-container-part4'),
    containerPart5: document.querySelector('#video-container-part5'),
    containerPart6: document.querySelector('#video-container-part6'),
    containerPart7: document.querySelector('#video-container-part7'),
    containerPart8: document.querySelector('#video-container-part8'),
    
    target1: document.getElementById('target1'),
    target2: document.getElementById('target2'),
    target3: document.getElementById('target3'),
    target4: document.getElementById('target4'),
    target5: document.getElementById('target5'),
    target6: document.getElementById('target6'),
    target7: document.getElementById('target7'),
    target8: document.getElementById('target8'),
    
    soundV1: createWebAudioPlayer('sound-v1'),
    soundV2: createWebAudioPlayer('sound-v2'),
    soundV3: createWebAudioPlayer('sound-v3'),
    soundV4: createWebAudioPlayer('sound-v4'),
    soundV5: createWebAudioPlayer('sound-v5'),
    soundV6: createWebAudioPlayer('sound-v6'),
    soundV7: createWebAudioPlayer('sound-v7'),
    soundV8: createWebAudioPlayer('sound-v8'),

    btnPlayPart8_3D: document.getElementById('btn-play-part8-3d'),
    btnPlayPart8_Plane: document.getElementById('btn-play-part8-plane')
};

export const videos = {
    part1: [
        document.getElementById('vid-bakteri-part1-v1'), document.getElementById('vid-balon-bebek-part1-v1'),
        document.getElementById('vid-kolam-renang-part1-v1'), document.getElementById('vid-mascot-part1-v1'),
        document.getElementById('vid-muntah-part1-v1'), document.getElementById('vid-orang-gigi-part1-v1')
    ],
    part2: [
        document.getElementById('vid-muntah-part2-v1'), document.getElementById('vid-orang-makan-part2-v1'),
        document.getElementById('vid-kue-part2-v1'), document.getElementById('vid-mascot-part2-v1'),
        document.getElementById('vid-mascot-part2-v2')
    ],
    part3: [
        document.getElementById('vid-balon-bebek-part3-v1'), document.getElementById('vid-badan-orang-part3-v1'),
        document.getElementById('vid-gigi-orang-part3-v1'), document.getElementById('vid-tangan-part3-v1'), 
        document.getElementById('vid-kertas-biru-part3-v1'), document.getElementById('vid-mascot-part3-v1'),
        document.getElementById('vid-teks-part3')
    ],
    part4: [
        document.getElementById('vid-gigi-orang-part4-v1'), document.getElementById('vid-bakteri-part4-v1'), 
        document.getElementById('vid-bakteri-part4-v2'), document.getElementById('vid-teks-part4')
    ].filter(Boolean),
    part5: [
        document.getElementById('vid-air-part5-v1'), document.getElementById('vid-mascot-part5-v1'), 
        document.getElementById('vid-bola-part5-v1'), document.getElementById('vid-orang-naik-balon-part5-v1'),
        document.getElementById('vid-teks-part5')
    ],
    part6: [
        document.getElementById('vid-air-part6-v1'), document.getElementById('vid-gigi-part6-v1'),
        document.getElementById('vid-mascot-dan-orang-part6-v1'), document.getElementById('vid-teks-part6')
    ],
    part7: [
        document.getElementById('vid-air-part7-v1'), document.getElementById('vid-bebek-part7-v1'),
        document.getElementById('vid-orang-part7-v1'), document.getElementById('vid-mascot-part7-v1')
    ],
    part8: [
        document.getElementById('vid-kolam-part8'),
        document.getElementById('vid-anak-kecil-part8'),
        document.getElementById('vid-mascot-part8'),
        document.getElementById('vid-teks-part8')
    ].filter(Boolean)
};

export const allVideos = [
    ...videos.part1, ...videos.part2, ...videos.part3, ...videos.part4,
    ...videos.part5, ...videos.part6, ...videos.part7, ...videos.part8
].filter(Boolean);