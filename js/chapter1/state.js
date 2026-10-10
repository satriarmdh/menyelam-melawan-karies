import { createWebAudioPlayer } from '../audioManager.js';

export const state = {
    videosLoaded: 0,
    videosBuffered: 0,
    allReady: false,
    allFullyBuffered: false,
    audioEnabled: false,
    hasStarted: false,
    pendingPart: null,
    isTargetInView: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
    currentPart: 0,
    isPlaying: false,
    isTransitioning: false,
    part1Finished: false,
    part2Finished: false,
    part3Finished: false,
    part3Paused: false,
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
    cameraReady: false
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
        document.getElementById('vid-laut'), document.getElementById('vid-kapal'),
        document.getElementById('vid-batu'), document.getElementById('vid-gelembung'),
        document.getElementById('vid-mascot')
    ],
    part2: [
        document.getElementById('vid-batu2'), document.getElementById('vid-gelembung2'),
        document.getElementById('vid-mascot2'), document.getElementById('vid-gosok'),
        document.getElementById('vid-orang'), document.getElementById('vid-text2')
    ],
    part3: [
        document.getElementById('vid-kapal3'), document.getElementById('vid-mascot3'),
        document.getElementById('vid-sikat'), document.getElementById('vid-teks-part3')
    ],
    part4: [
        document.getElementById('vid-kapal4'), document.getElementById('vid-mascot4'),
        document.getElementById('vid-sikat4'), document.getElementById('vid-teks-part4')
    ],
    part5: [
        document.getElementById('vid-orang5'), document.getElementById('vid-tangan'),
        document.getElementById('vid-teks-part5')
    ],
    part6: [
        document.getElementById('vid-kapal6'), document.getElementById('vid-mascot2-6'),
        document.getElementById('vid-mascot6')
    ],
    part7: [
        document.getElementById('vid-coral7'), document.getElementById('vid-laut7'),
        document.getElementById('vid-mascot7'), document.getElementById('vid-orang7'),
        document.getElementById('vid-teks-part7')
    ],
    part8: [
        document.getElementById('vid-air-part8-v1'),
        document.getElementById('vid-rumput-part8-v1'),
        document.getElementById('vid-kerang-part8-v1'),
        document.getElementById('vid-kapal-part8-v1'),
        document.getElementById('vid-teks-quiz-part8-v1')
    ]
};

export const allVideos = [
    ...videos.part1, ...videos.part2, ...videos.part3, 
    ...videos.part4, ...videos.part5, ...videos.part6, ...videos.part7,
    ...videos.part8
];