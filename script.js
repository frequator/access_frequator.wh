// --- LOADING SCREEN DISMISSAL ---
window.addEventListener('load', () => {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        setTimeout(() => {
            overlay.classList.add('fade-out');
            setTimeout(() => overlay.remove(), 800);
        }, 400);
    }
});

// --- MUSIC EXPLOSION BUTTON EFFECT ---
function triggerMusicExplosion(e) {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const monoSvgs = [
        `<svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`,
        `<svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff"><path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z"/></svg>`,
        `<svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>`,
        `<svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>`
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

// --- DROPDOWN MENU TOGGLE ---
function toggleDropdown(e) {
    e.stopPropagation();
    document.getElementById('user-dropdown-menu').classList.toggle('show');
}

window.addEventListener('click', () => {
    const dropdown = document.getElementById('user-dropdown-menu');
    if (dropdown) dropdown.classList.remove('show');
});

// --- HEADER SCROLL COLLAPSE & TYPEWRITER ---
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

// --- RECURRING SCROLL REVEAL TRANSITIONS ---
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        } else {
            entry.target.classList.remove('is-visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

// --- NEURAL NETWORK BRAINWORK CANVAS PARTICLE SYSTEM ---
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

    function drawNeuralNetwork() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

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

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.fill();

            if (mouseActive) {
                const dxM = mouseX - p.x;
                const dyM = mouseY - p.y;
                const distM = Math.sqrt(dxM * dxM + dyM * dyM);

                if (distM < 220) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouseX, mouseY);
                    const opacity = (1 - distM / 220) * 0.9;
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = 1.3;
                    ctx.stroke();
                }
            }

            for (let j = i + 1; j < particles.length; j++) {
                let p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - dist / 120) * 0.3})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(drawNeuralNetwork);
    }

    drawNeuralNetwork();
}

// --- CONTINUOUS RANDOM YOUTUBE MUSIC PLAYER ---
const ytPlaylist = ["VLUkhtUH4mA", "n0XqaQWJp1c", "qkKbn7qZSno", "HPOWu76qAAc"];
let player;
let isPlayerReady = false;
let currentTrackIndex = Math.floor(Math.random() * ytPlaylist.length);
let isPlaying = localStorage.getItem('frequator_sound') === 'true';

const soundBtn = document.getElementById('sound-btn');
const iconMute = document.getElementById('icon-mute');
const iconPlay = document.getElementById('icon-play');

function getRandomTrackId() {
    if (ytPlaylist.length <= 1) return ytPlaylist[0];
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * ytPlaylist.length);
    } while (newIndex === currentTrackIndex);
    
    currentTrackIndex = newIndex;
    return ytPlaylist[currentTrackIndex];
}

// Global API Callback triggered by YouTube API in head
window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('yt-player', {
        height: '200',
        width: '300',
        videoId: ytPlaylist[currentTrackIndex],
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'disablekb': 1,
            'fs': 0,
            'modestbranding': 1,
            'playsinline': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
};

function onPlayerReady(event) {
    isPlayerReady = true;
    updateButtonUI(isPlaying);
    if (isPlaying) {
        event.target.unMute();
        event.target.setVolume(100);
        event.target.playVideo();
    }
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        const nextTrack = getRandomTrackId();
        player.loadVideoById(nextTrack);
    }
}

function onPlayerError(event) {
    const nextTrack = getRandomTrackId();
    if (player && player.loadVideoById) {
        player.loadVideoById(nextTrack);
    }
}

// Sound Button Toggle
if (soundBtn) {
    soundBtn.addEventListener('click', () => {
        if (!isPlayerReady || !player) return;

        if (isPlaying) {
            player.pauseVideo();
            isPlaying = false;
        } else {
            player.unMute();
            player.setVolume(100);
            player.playVideo();
            isPlaying = true;
        }
        
        localStorage.setItem('frequator_sound', isPlaying);
        updateButtonUI(isPlaying);
    });
}

function updateButtonUI(playing) {
    if (playing) {
        if (iconMute) iconMute.style.display = 'none';
        if (iconPlay) iconPlay.style.display = 'block';
        if (soundBtn) soundBtn.classList.add('playing');
    } else {
        if (iconMute) iconMute.style.display = 'block';
        if (iconPlay) iconPlay.style.display = 'none';
        if (soundBtn) soundBtn.classList.remove('playing');
    }
}
