// --- CONTINUOUS RANDOM YOUTUBE MUSIC PLAYER ---
const ytPlaylist = ["VLUkhtUH4mA", "n0XqaQWJp1c", "qkKbn7qZSno", "HPOWu76qAAc"];
let player;
let isPlayerReady = false;
let currentTrackIndex = Math.floor(Math.random() * ytPlaylist.length);

// Default to enabled (true) for new visitors, or restore saved preference
let savedSoundPref = localStorage.getItem('frequator_sound');
let isPlaying = savedSoundPref === null ? true : savedSoundPref === 'true';

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
            'autoplay': 1,
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

function attemptPlayAudio() {
    if (!isPlayerReady || !player) return;
    if (isPlaying) {
        player.unMute();
        player.setVolume(100);
        player.playVideo();
    } else {
        player.pauseVideo();
    }
    updateButtonUI(isPlaying);
}

function onPlayerReady(event) {
    isPlayerReady = true;
    updateButtonUI(isPlaying);
    if (isPlaying) {
        attemptPlayAudio();
    }
}

// Global First User Interaction Handler (Unlocks Browser Autoplay Block)
function handleFirstUserInteraction() {
    if (isPlaying && isPlayerReady && player) {
        attemptPlayAudio();
    }
}

// Unblocks audio the second the user clicks/taps anywhere on the website
window.addEventListener('pointerdown', handleFirstUserInteraction, { once: true });
window.addEventListener('keydown', handleFirstUserInteraction, { once: true });

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

// Floating Sound Button Manual Toggle
if (soundBtn) {
    soundBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isPlayerReady || !player) return;

        if (isPlaying) {
            player.pauseVideo();
            isPlaying = false;
        } else {
            isPlaying = true;
            attemptPlayAudio();
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
