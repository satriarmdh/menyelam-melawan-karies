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
    hasStarted: false,
    pendingPart: null,
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

    btnPlayPart8_3D: document.getElementById('btn-play-part8-3d'),
    btnPlayPart8_Plane: document.getElementById('btn-play-part8-plane'),

    soundV1: createWebAudioPlayer('sound-v1'),
    soundV2: createWebAudioPlayer('sound-v2'),
    soundV3: createWebAudioPlayer('sound-v3'),
    soundV4: createWebAudioPlayer('sound-v4'),
    soundV5: createWebAudioPlayer('sound-v5'),
    soundV6: createWebAudioPlayer('sound-v6'),
    soundV7: createWebAudioPlayer('sound-v7'),
    soundV8: createWebAudioPlayer('sound-v8')
};

export const videos = {
    part1: [
        document.getElementById('vid-part1-pantai'),
        document.getElementById('vid-part1-kerajaan'),
        document.getElementById('vid-part1-anakkecil'),
        document.getElementById('vid-part1-mascot3'),
        document.getElementById('vid-part1-mascot1')
    ].filter(Boolean),
    part2: [
        document.getElementById('vid-part2-kerajaan'),
        document.getElementById('vid-part2-anakkecil'),
        document.getElementById('vid-part2-makanan'),
        document.getElementById('vid-part2-tangan'),
        document.getElementById('vid-part2-teks')
    ].filter(Boolean),
    part3: [
        document.getElementById('vid-part3-kerajaan'),
        document.getElementById('vid-part3-orang-mascot'),
        document.getElementById('vid-part3-teks')
    ].filter(Boolean),
    part4: [
        document.getElementById('vid-part4-orangtidur'),
        document.getElementById('vid-part4-teks')
    ].filter(Boolean),
    part5: [
        document.getElementById('vid-part5-pantai'),
        document.getElementById('vid-part5-anaknangis'),
        document.getElementById('vid-part5-mascotselimut'),
        document.getElementById('vid-part5-mascot'),
        document.getElementById('vid-part5-teks')
    ].filter(Boolean),
    part6: [
        document.getElementById('vid-part6-pantai'),
        document.getElementById('vid-part6-mascotpantai'),
        document.getElementById('vid-part6-mascot'),
        document.getElementById('vid-part6-teks')
    ].filter(Boolean),
    part7: [
        document.getElementById('vid-part7-laut'),
        document.getElementById('vid-part7-lumut'),
        document.getElementById('vid-part7-anakkecil'),
        document.getElementById('vid-part7-gelembung'),
        document.getElementById('vid-part7-mascot'),
        document.getElementById('vid-part7-teks')
    ].filter(Boolean),
    part8: [
        document.getElementById('vid-part8-background'),
        document.getElementById('vid-part8-batu'),
        document.getElementById('vid-part8-anakkecil'),
        document.getElementById('vid-part8-mascot'),
        document.getElementById('vid-part8-kalimat')
    ].filter(Boolean)
};

export const allVideos = [
    ...videos.part1, ...videos.part2, ...videos.part3, ...videos.part4,
    ...videos.part5, ...videos.part6, ...videos.part7, ...videos.part8
].filter(Boolean);
