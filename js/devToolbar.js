// Floating Dev / Test Toolbar for Quick Part Testing
// Memungkinkan penguji untuk langsung melompat ke Part manapun tanpa scan dari awal.

(function () {
    const isChapter1 = window.location.pathname.includes('chapter1');
    const isChapter2 = window.location.pathname.includes('chapter2');
    const isChapter3 = window.location.pathname.includes('chapter3');

    if (!isChapter1 && !isChapter2 && !isChapter3) return;

    const maxParts = 8;
    const chapterName = isChapter1 ? 'Chapter 1' : (isChapter2 ? 'Chapter 2' : 'Chapter 3');

    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
        .dev-test-toggle-btn {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 9999;
            background: linear-gradient(135deg, #ff007f 0%, #7928ca 100%);
            color: #ffffff;
            font-size: 13px;
            font-weight: 700;
            padding: 10px 18px;
            border-radius: 30px;
            border: 2px solid rgba(255, 255, 255, 0.6);
            cursor: pointer;
            box-shadow: 0 4px 18px rgba(0, 0, 0, 0.4), 0 0 15px rgba(255, 0, 127, 0.4);
            display: flex;
            align-items: center;
            gap: 6px;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            user-select: none;
        }
        .dev-test-toggle-btn:active {
            transform: scale(0.95);
        }
        .dev-test-panel {
            position: fixed;
            bottom: 72px;
            left: 20px;
            z-index: 9999;
            background: rgba(10, 20, 40, 0.95);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 2px solid #00e5ff;
            border-radius: 18px;
            padding: 16px;
            width: min(340px, 90vw);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 229, 255, 0.3);
            color: #ffffff;
            font-family: system-ui, -apple-system, sans-serif;
            display: none;
            flex-direction: column;
            gap: 12px;
            user-select: none;
        }
        .dev-test-panel.show {
            display: flex;
            animation: devPanelPop 0.2s ease-out;
        }
        @keyframes devPanelPop {
            from { opacity: 0; transform: translateY(8px) scale(0.96); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .dev-test-title {
            font-size: 14px;
            font-weight: 800;
            color: #00e5ff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.15);
            padding-bottom: 8px;
            margin: 0;
        }
        .dev-test-close {
            background: transparent;
            border: none;
            color: #ffffff;
            font-size: 18px;
            cursor: pointer;
            padding: 0 4px;
            line-height: 1;
            opacity: 0.7;
        }
        .dev-test-close:hover {
            opacity: 1;
        }
        .dev-test-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
        }
        .dev-test-part-btn {
            background: rgba(255, 255, 255, 0.12);
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.25);
            border-radius: 10px;
            padding: 9px 4px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            text-align: center;
            transition: all 0.15s ease;
        }
        .dev-test-part-btn:hover {
            background: #00e5ff;
            color: #000000;
            border-color: #00e5ff;
        }
        .dev-test-part-btn:active {
            transform: scale(0.92);
        }
        .dev-test-actions {
            display: flex;
            flex-direction: column;
            gap: 6px;
            border-top: 1px solid rgba(255, 255, 255, 0.15);
            padding-top: 8px;
        }
        .dev-test-sub-btn {
            background: rgba(255, 255, 255, 0.08);
            color: #e0f7fa;
            border: 1px dashed rgba(0, 229, 255, 0.4);
            border-radius: 8px;
            padding: 7px 10px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            text-decoration: none;
        }
        .dev-test-sub-btn:hover {
            background: rgba(0, 229, 255, 0.2);
            border-color: #00e5ff;
        }
    `;
    document.head.appendChild(style);

    // Create DOM elements
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'dev-test-toggle-btn';
    toggleBtn.innerHTML = '🧪 <span>Test Part</span> ⚡';
    toggleBtn.title = 'Buka menu testing untuk melompat ke Part manapun';

    const panel = document.createElement('div');
    panel.className = 'dev-test-panel';

    let gridHtml = '';
    for (let i = 1; i <= maxParts; i++) {
        gridHtml += `<button class="dev-test-part-btn" data-part="${i}">Part ${i}</button>`;
    }

    panel.innerHTML = `
        <div class="dev-test-title">
            <span>⚡ Lompat Part (${chapterName})</span>
            <button class="dev-test-close" id="devTestClose">✕</button>
        </div>
        <div class="dev-test-grid">
            ${gridHtml}
        </div>
        <div class="dev-test-actions">
            ${isChapter1 ? '<a href="./quiz.html" class="dev-test-sub-btn">🐚 Lompat Langsung ke Kuis</a>' : `<button class="dev-test-sub-btn" id="devJumpQuizSeamless">🐚 Lompat Langsung ke Kuis (${chapterName})</button>`}
            <button class="dev-test-sub-btn" id="devUnlockAll">🔓 Buka & Izinkan Semua Marker</button>
            <a href="./test.html" class="dev-test-sub-btn">📋 Buka Halaman Test Hub Lengkap</a>
        </div>
    `;

    document.body.appendChild(toggleBtn);
    document.body.appendChild(panel);

    // Toggle menu
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('show');
    });

    document.getElementById('devTestClose').addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.remove('show');
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && e.target !== toggleBtn) {
            panel.classList.remove('show');
        }
    });

    // Handle part buttons
    panel.querySelectorAll('.dev-test-part-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const partNum = parseInt(btn.getAttribute('data-part'), 10);
            panel.classList.remove('show');

            // Jika start button loading overlay masih ada, auto-click
            const startBtn = document.getElementById('startButton');
            if (startBtn && !document.getElementById('arScene').classList.contains('ready')) {
                startBtn.click();
            }

            setTimeout(() => {
                if (typeof window.jumpToPart === 'function') {
                    window.jumpToPart(partNum);
                } else {
                    alert(`Fungsi jumpToPart belum siap. Silakan klik Mulai terlebih dahulu.`);
                }
            }, 300);
        });
    });

    // Unlock all markers
    const devUnlockAll = document.getElementById('devUnlockAll');
    if (devUnlockAll) {
        devUnlockAll.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.remove('show');
            if (typeof window.unlockAllParts === 'function') {
                window.unlockAllParts();
            } else {
                alert('Semua marker diizinkan discan secara bebas.');
            }
        });
    }

    // Jump to Quiz for Chapter 2 & Chapter 3
    const devJumpQuizSeamless = document.getElementById('devJumpQuizSeamless');
    if (devJumpQuizSeamless) {
        devJumpQuizSeamless.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.remove('show');
            const startBtn = document.getElementById('startButton');
            if (startBtn && !document.getElementById('arScene').classList.contains('ready')) {
                startBtn.click();
            }
            setTimeout(() => {
                if (window.__startQuizSeamless) {
                    window.__startQuizSeamless(1);
                } else if (typeof window.jumpToPart === 'function') {
                    window.jumpToPart(8);
                }
            }, 300);
        });
    }
})();
