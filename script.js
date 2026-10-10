// --- 0. THEME SWITCHER LOGIC ---
function setTheme(themeName) {
    document.body.setAttribute('data-theme', themeName);
    localStorage.setItem('frequator_theme', themeName);

    document.querySelectorAll('.theme-circle').forEach(circle => {
        circle.classList.remove('active');
    });

    const activeCircle = document.querySelector(`.theme-${themeName}`);
    if (activeCircle) activeCircle.classList.add('active');
}

(function initTheme() {
    const savedTheme = localStorage.getItem('frequator_theme') || 'onyx';
    setTheme(savedTheme);
})();

// --- 1. MUSIC EXPLOSION BUTTON EFFECT ---
function triggerMusicExplosion(e) {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const monoSvgs = [
        `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`,
        `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z"/></svg>`,
        `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>`,
        `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>`
    ];

    for (let i = 0; i < 18; i++) {
        const particle = document.createElement('div');
        particle.className = 'exploding-tune-icon';
        particle.innerHTML = monoSvgs[Math.floor(Math.random() * monoSvgs.length)];

        const angle = Math.random() * Math.PI * 2;
        const distance = 40 + Math.random() * 80;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        const rot = (Math.random() - 0.5) * 360;

        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        particle.style.setProperty('--rot', `${rot}deg`);

        btn.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
    }
}

// --- 2. DROPDOWN MENU TOGGLE ---
function toggleDropdown(e) {
    e.stopPropagation();
    const menu = document.getElementById('user-dropdown-menu');
    if (menu) menu.classList.toggle('show');
}

window.addEventListener('click', () => {
    const dropdown = document.getElementById('user-dropdown-menu');
    if (dropdown) dropdown.classList.remove('show');
});

// --- 3. HEADER SCROLL COLLAPSE & TYPEWRITER ---
const header = document.getElementById('main-header');
const brandTypewriter = document.getElementById('brand-typewriter');
const fullBrandText = "Frequator";
let isScrolled = false;
let typeTimeout;

function typeText(text, index = 0) {
    if (brandTypewriter && index <= text.length) {
        brandTypewriter.textContent = text.substring(0, index);
        typeTimeout = setTimeout(() => typeText(text, index + 1), 45);
    }
}

window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.scrollY > 40 && !isScrolled) {
        isScrolled = true;
        header.classList.add('scrolled');
        clearTimeout(typeTimeout);
    } else if (window.scrollY <= 40 && isScrolled) {
        isScrolled = false;
        header.classList.remove('scrolled');
        clearTimeout(typeTimeout);
        if (brandTypewriter) brandTypewriter.textContent = "";
        typeText(fullBrandText, 0);
    }
});

// --- 4. SCROLL REVEAL OBSERVER ---
const observerOptions = { threshold: 0.05 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, observerOptions);

function revealElements() {
    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
}

revealElements();
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', revealElements);
}

// --- 5. MP3 PLAYLIST & WEB AUDIO ENGINE ---
const mp3Playlist = [
    "hold tight.mp3",
    "holdup.mp3",
    "pathfinder.mp3",
    "takemetothemoon.mp3"
];

let currentTrackIndex = Math.floor(Math.random() * mp3Playlist.length);
const audioEl = document.getElementById('bg-audio');
const soundBtn = document.getElementById('sound-btn');

let audioCtx = null;
let analyser = null;
let audioSource = null;
let freqData = null;
let isPlaying = false;
let fadeInterval = null;

function loadTrack(index) {
    if (!audioEl) return;
    audioEl.src = mp3Playlist[index];
    audioEl.load();
}

function setupWebAudio() {
    if (audioCtx) return;

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    
    analyser.fftSize = 256; 
    analyser.smoothingTimeConstant = 0.80; 

    audioSource = audioCtx.createMediaElementSource(audioEl);
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);

    freqData = new Uint8Array(analyser.frequencyBinCount);
}

// SMOOTH AUDIO FADE IN / FADE OUT
function fadeInAudio(audio, targetVol = 1.0, duration = 650) {
    clearInterval(fadeInterval);
    audio.volume = 0;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = targetVol / steps;

    fadeInterval = setInterval(() => {
        if (audio.volume + increment >= targetVol) {
            audio.volume = targetVol;
            clearInterval(fadeInterval);
        } else {
            audio.volume += increment;
        }
    }, stepTime);
}

function fadeOutAudio(audio, duration = 650, onComplete) {
    clearInterval(fadeInterval);
    const stepTime = 20;
    const steps = duration / stepTime;
    const decrement = audio.volume / steps;

    fadeInterval = setInterval(() => {
        if (audio.volume - decrement <= 0) {
            audio.volume = 0;
            audio.pause();
            clearInterval(fadeInterval);
            if (onComplete) onComplete();
        } else {
            audio.volume -= decrement;
        }
    }, stepTime);
}

if (audioEl) {
    loadTrack(currentTrackIndex);
    audioEl.addEventListener('ended', () => {
        currentTrackIndex = (currentTrackIndex + 1) % mp3Playlist.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) {
            audioEl.play().then(() => fadeInAudio(audioEl, 1.0, 500));
        }
    });
}

// --- 6. PARTICLES & NEURAL NET CANVAS VISUALIZER ---
const particleContainer = document.getElementById('particles-container');

if (particleContainer) {
    particleContainer.innerHTML = '';

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    particleContainer.appendChild(canvas);

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let mouseActive = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        mouseActive = true;
    });

    window.addEventListener('mouseleave', () => {
        mouseActive = false;
        mouseX = -1000;
        mouseY = -1000;
    });

    const particles = [];
    const particleCount = 55;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8 - 0.2,
            radius: Math.random() * 1.8 + 1
        });
    }

    function getThemeVisualConfig() {
        const bodyTheme = document.body.getAttribute('data-theme') || 'onyx';
        const pRgb = getComputedStyle(document.body).getPropertyValue('--particle-rgb').trim() || '255, 255, 255';
        const isLight = bodyTheme === 'white';

        return { particleRgb: pRgb, isLight };
    }

    function renderAudioReactiveCanvas() {
        ctx.clearRect(0, 0, width, height);
        const { particleRgb, isLight } = getThemeVisualConfig();

        let bassPower = 0;

        if (isPlaying && analyser && freqData && audioEl.volume > 0.05) {
            analyser.getByteFrequencyData(freqData);

            // BASS POWER (Bins 0 & 1 drive dots & lines strictly)
            const rawBass = (freqData[0] + freqData[1]) / 2;
            bassPower = Math.pow(rawBass / 255, 1.4) * audioEl.volume;
        }

        // --- DOTS & LINES (BASS REACTIVE ONLY) ---
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];

            // Displacement driven strictly by bass
            const displacement = bassPower * 1.5;
            p.x += p.vx + (Math.sin(i + performance.now() * 0.003) * displacement);
            p.y += p.vy + (Math.cos(i + performance.now() * 0.003) * displacement);

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            if (mouseActive) {
                const dxM = mouseX - p.x;
                const dyM = mouseY - p.y;
                const distM = Math.sqrt(dxM * dxM + dyM * dyM);
                if (distM < 180 && distM > 10) {
                    p.x += (dxM / distM) * 0.4;
                    p.y += (dyM / distM) * 0.4;
                }
            }

            // Dot sizing driven strictly by bass
            const dynamicRadius = p.radius + (bassPower * 3.5);
            const particleAlpha = isLight ? 0.95 : (0.85 + (bassPower * 0.15));

            ctx.beginPath();
            ctx.arc(p.x, p.y, dynamicRadius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${particleRgb}, ${particleAlpha})`;
            ctx.fill();

            // Mouse lines
            if (mouseActive) {
                const dxM = mouseX - p.x;
                const dyM = mouseY - p.y;
                const distM = Math.sqrt(dxM * dxM + dyM * dyM);

                if (distM < 220) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouseX, mouseY);
                    const mouseOpacity = (1 - distM / 220) * (isLight ? 0.95 : 0.85 + bassPower * 0.15);
                    ctx.strokeStyle = `rgba(${particleRgb}, ${mouseOpacity})`;
                    ctx.lineWidth = 1.4 + (bassPower * 0.8);
                    ctx.stroke();
                }
            }

            // Neural net lines driven strictly by bass
            for (let j = i + 1; j < particles.length; j++) {
                let p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 125) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    
                    const baseLineAlpha = isLight ? 0.50 : 0.28;
                    const netOpacity = ((1 - dist / 125) * baseLineAlpha) + (bassPower * 0.40);
                    
                    ctx.strokeStyle = `rgba(${particleRgb}, ${netOpacity})`;
                    ctx.lineWidth = (isLight ? 1.0 : 0.7) + (bassPower * 1.5);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(renderAudioReactiveCanvas);
    }

    renderAudioReactiveCanvas();
}

// --- 7. MORPHING SOUND BUTTON CONTROLLER ---
if (soundBtn && audioEl) {
    soundBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        setupWebAudio();

        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        if (isPlaying) {
            fadeOutAudio(audioEl, 650, () => {
                isPlaying = false;
                soundBtn.classList.remove('playing');
            });
        } else {
            isPlaying = true;
            soundBtn.classList.add('playing');
            audioEl.play().then(() => {
                fadeInAudio(audioEl, 1.0, 650);
            }).catch(err => {
                console.error("Audio playback error:", err);
                isPlaying = false;
                soundBtn.classList.remove('playing');
            });
        }
    });
}
