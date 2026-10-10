// --- CONTINUOUS RANDOM YOUTUBE MUSIC PLAYER WITH FADE EFFECTS ---
const ytPlaylist = ["VLUkhtUH4mA", "n0XqaQWJp1c", "qkKbn7qZSno", "HPOWu76qAAc"];
let player;
let isPlayerReady = false;
let isPlaying = false;
let currentTrackIndex = Math.floor(Math.random() * ytPlaylist.length);
let fadeInterval = null;

const soundBtn = document.getElementById('sound-btn');
const soundBtnOff = document.getElementById('sound-btn-off');
const soundBtnOn = document.getElementById('sound-btn-on');

function getRandomTrackId() {
    if (ytPlaylist.length <= 1) return ytPlaylist[0];
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * ytPlaylist.length);
    } while (newIndex === currentTrackIndex);
    
    currentTrackIndex = newIndex;
    return ytPlaylist[currentTrackIndex];
}

// Global YouTube API Ready Callback
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
            'onReady': () => { isPlayerReady = true; },
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
};

// Smooth Volume Fade In
function fadeInAudio(targetVol = 100, duration = 700) {
    if (!player || typeof player.setVolume !== 'function') return;
    clearInterval(fadeInterval);
    
    player.unMute();
    player.setVolume(0);
    player.playVideo();

    let currentVol = 0;
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = targetVol / steps;

    fadeInterval = setInterval(() => {
        currentVol += increment;
        if (currentVol >= targetVol) {
            player.setVolume(targetVol);
            clearInterval(fadeInterval);
        } else {
            player.setVolume(Math.round(currentVol));
        }
    }, stepTime);
}

// Smooth Volume Fade Out
function fadeOutAudio(duration = 700) {
    if (!player || typeof player.setVolume !== 'function') return;
    clearInterval(fadeInterval);

    let currentVol = player.getVolume ? player.getVolume() : 100;
    const stepTime = 30;
    const steps = duration / stepTime;
    const decrement = currentVol / steps;

    fadeInterval = setInterval(() => {
        currentVol -= decrement;
        if (currentVol <= 0) {
            player.setVolume(0);
            player.pauseVideo();
            clearInterval(fadeInterval);
        } else {
            player.setVolume(Math.round(currentVol));
        }
    }, stepTime);
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        const nextTrack = getRandomTrackId();
        player.loadVideoById(nextTrack);
    }
}

function onPlayerError() {
    const nextTrack = getRandomTrackId();
    if (player && player.loadVideoById) {
        player.loadVideoById(nextTrack);
    }
}

// Button Click Event Toggle
if (soundBtn) {
    soundBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isPlayerReady || !player) return;

        if (isPlaying) {
            // Turn Off: Fade out volume then pause
            fadeOutAudio(600);
            isPlaying = false;
        } else {
            // Turn On: Start unmuted with smooth fade-in
            fadeInAudio(100, 700);
            isPlaying = true;
        }

        updateSoundUI(isPlaying);
    });
}

function updateSoundUI(playing) {
    if (playing) {
        if (soundBtnOff) soundBtnOff.style.display = 'none';
        if (soundBtnOn) soundBtnOn.style.display = 'flex';
        if (soundBtn) soundBtn.classList.add('playing');
    } else {
        if (soundBtnOff) soundBtnOff.style.display = 'flex';
        if (soundBtnOn) soundBtnOn.style.display = 'none';
        if (soundBtn) soundBtn.classList.remove('playing');
    }
}
