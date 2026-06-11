/**
 * 六月雪个人网页 - “听雪小筑”独立音乐页控制逻辑
 */

const PLAYLIST = (window.musicTracks || []).map((song, index) => ({
  id: song.id || 'track-' + (index + 1),
  title: song.title || '本地曲目',
  artist: song.artist || '本地音乐',
  src: song.src,
  tag: song.tag || '雪音',
  duration: song.duration || '00:00'
})).filter(song => song.src);

let currentIndex = 0;
let isPlaying = false;
let isBuffering = false;
let playToken = 0;
let siteAudio = null;

document.addEventListener('DOMContentLoaded', () => {
  if (!PLAYLIST.length || typeof window.getSiteAudio !== 'function') return;

  siteAudio = window.getSiteAudio();
  siteAudio.preload = 'metadata';
  siteAudio.playsInline = true;
  siteAudio.loop = false;

  renderPlaylist();
  initPlayerControls();
  initDialogEvents();
  bindAudioEvents();
  updateNowPlaying('等待播放');
});

function renderPlaylist() {
  const container = document.getElementById('playlist-container');
  if (!container) return;

  container.innerHTML = PLAYLIST.map((song, index) => {
    const number = String(index + 1).padStart(2, '0');
    return `
      <article class="song-card scroll-reveal" data-index="${index}" tabindex="0" aria-label="播放 ${song.title}">
        <span class="song-card-number">${number}</span>
        <div class="song-card-info">
          <h3 class="song-card-title">${song.title}</h3>
          <div class="song-card-meta">
            <span class="song-card-artist">${song.artist || '本地音乐'}</span>
            <span class="song-card-state">待播放</span>
          </div>
        </div>
        <span class="song-card-duration">${song.duration}</span>
        <button class="song-play-status" type="button" aria-label="播放 ${song.title}">
          ${playIcon()}
        </button>
      </article>
    `;
  }).join('');

  container.querySelectorAll('.song-card').forEach(card => {
    const idx = Number(card.getAttribute('data-index'));
    card.addEventListener('click', event => {
      if (event.target.closest('button') || event.currentTarget === card) {
        toggleSong(idx);
      }
    });
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleSong(idx);
      }
    });
  });

  updatePlaylistState();
}

function initPlayerControls() {
  const playBtn = document.getElementById('playbar-play-btn');
  const prevBtn = document.getElementById('playbar-prev-btn');
  const nextBtn = document.getElementById('playbar-next-btn');
  const progressBar = document.getElementById('playbar-progress');
  const volumeSlider = document.getElementById('playbar-volume');

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      toggleSong(currentIndex);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      switchSong((currentIndex - 1 + PLAYLIST.length) % PLAYLIST.length, true);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      switchSong((currentIndex + 1) % PLAYLIST.length, true);
    });
  }

  if (progressBar) {
    progressBar.addEventListener('input', event => {
      if (!Number.isFinite(siteAudio.duration) || siteAudio.duration <= 0) return;
      siteAudio.currentTime = (Number(event.target.value) / 100) * siteAudio.duration;
    });
  }

  if (volumeSlider) {
    siteAudio.volume = Number(volumeSlider.value || 0.6);
    volumeSlider.addEventListener('input', event => {
      siteAudio.volume = Number(event.target.value);
    });
  }
}

function bindAudioEvents() {
  siteAudio.addEventListener('loadedmetadata', () => {
    const song = PLAYLIST[currentIndex];
    if (Number.isFinite(siteAudio.duration)) {
      song.duration = formatTime(siteAudio.duration);
    }
    updateProgress();
    updateNowPlaying(isPlaying ? '正在播放' : '已就绪');
  });

  siteAudio.addEventListener('canplay', () => {
    isBuffering = false;
    updateNowPlaying(isPlaying ? '正在播放' : '已就绪');
  });

  siteAudio.addEventListener('playing', () => {
    isPlaying = true;
    isBuffering = false;
    updateNowPlaying('正在播放');
  });

  siteAudio.addEventListener('pause', () => {
    isPlaying = false;
    isBuffering = false;
    updateNowPlaying('已暂停');
  });

  siteAudio.addEventListener('waiting', () => {
    isBuffering = true;
    updateNowPlaying('缓冲中');
  });

  siteAudio.addEventListener('stalled', () => {
    isBuffering = true;
    updateNowPlaying('加载停滞');
  });

  siteAudio.addEventListener('ended', () => {
    switchSong((currentIndex + 1) % PLAYLIST.length, true);
  });

  siteAudio.addEventListener('error', () => {
    console.error('Audio load failed:', {
      src: siteAudio.currentSrc || siteAudio.src,
      errorCode: siteAudio.error?.code
    });
    isPlaying = false;
    isBuffering = false;
    updateNowPlaying('加载失败');
    showAudioErrorDialog(PLAYLIST[currentIndex].src);
  });

  siteAudio.addEventListener('timeupdate', updateProgress);
}

function toggleSong(index) {
  if (index === currentIndex && isPlaying) {
    siteAudio.pause();
    return;
  }

  switchSong(index, true);
}

function switchSong(index, shouldPlay) {
  currentIndex = index;
  ensureSongSource();
  updateProgress(true);
  updateNowPlaying(shouldPlay ? '准备播放' : '等待播放');

  if (shouldPlay) {
    playCurrent();
  }
}

function ensureSongSource() {
  const song = PLAYLIST[currentIndex];
  const targetSrc = new URL(song.src, window.location.href).href;

  if (siteAudio.src !== targetSrc) {
    siteAudio.src = song.src;
    siteAudio.load();
  }
}

function playCurrent() {
  ensureSongSource();

  const token = ++playToken;
  isBuffering = true;
  updateNowPlaying('缓冲中');

  siteAudio.play().then(() => {
    if (token !== playToken) return;
    isPlaying = true;
    isBuffering = false;
    updateNowPlaying('正在播放');
  }).catch(error => {
    if (token !== playToken) return;
    isPlaying = false;
    isBuffering = false;
    console.error('Audio play failed:', error);
    updateNowPlaying('播放失败');
    showAudioErrorDialog(PLAYLIST[currentIndex].src);
  });
}

function updateNowPlaying(statusText) {
  const song = PLAYLIST[currentIndex];
  const title = document.getElementById('playbar-title');
  const artist = document.getElementById('playbar-artist');
  const totalTime = document.getElementById('playbar-total-time');
  const introTitle = document.getElementById('music-current-title');
  const introMeta = document.getElementById('music-current-meta');
  const introStatus = document.getElementById('music-current-status');

  if (title) title.textContent = song.title;
  if (artist) artist.textContent = song.artist || '本地音乐';
  if (totalTime) totalTime.textContent = song.duration;
  if (introTitle) introTitle.textContent = song.title;
  if (introMeta) introMeta.textContent = (song.artist || '本地音乐') + ' · ' + song.duration;
  if (introStatus) introStatus.textContent = statusText;

  updatePlayButtonUI(isPlaying || isBuffering);
  updatePlaylistState(statusText);
}

function updatePlaylistState(statusText) {
  const cards = document.querySelectorAll('#playlist-container .song-card');
  cards.forEach((card, idx) => {
    const active = idx === currentIndex;
    const state = card.querySelector('.song-card-state');
    const statusBtn = card.querySelector('.song-play-status');
    const song = PLAYLIST[idx];

    card.classList.toggle('active', active);
    card.setAttribute('aria-current', active ? 'true' : 'false');
    if (state) state.textContent = active ? (statusText || (isPlaying ? '正在播放' : '待播放')) : '待播放';
    if (statusBtn) {
      statusBtn.innerHTML = active && isPlaying ? pauseIcon() : playIcon();
      statusBtn.setAttribute('aria-label', active && isPlaying ? '暂停 ' + song.title : '播放 ' + song.title);
    }
  });
}

function updatePlayButtonUI(showPause) {
  const playBtn = document.getElementById('playbar-play-btn');
  if (!playBtn) return;

  playBtn.innerHTML = showPause ? pauseIcon() : playIcon();
  playBtn.setAttribute('aria-label', showPause ? '暂停' : '播放');
}

function updateProgress(reset) {
  const progressBar = document.getElementById('playbar-progress');
  const curTimeText = document.getElementById('playbar-current-time');
  const totalTimeText = document.getElementById('playbar-total-time');

  if (reset) {
    if (progressBar) progressBar.value = 0;
    if (curTimeText) curTimeText.textContent = '00:00';
  }

  if (Number.isFinite(siteAudio.duration) && siteAudio.duration > 0) {
    if (progressBar) progressBar.value = (siteAudio.currentTime / siteAudio.duration) * 100;
    if (curTimeText) curTimeText.textContent = formatTime(siteAudio.currentTime);
    if (totalTimeText) totalTimeText.textContent = formatTime(siteAudio.duration);
  } else if (totalTimeText) {
    totalTimeText.textContent = PLAYLIST[currentIndex].duration;
  }
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return String(minutes).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
}

function playIcon() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
}

function pauseIcon() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
}

function showAudioErrorDialog(filePath) {
  const dialog = document.getElementById('music-error-dialog');
  const pathCode = document.getElementById('dialog-file-path');
  if (dialog && pathCode) {
    pathCode.textContent = filePath;
    dialog.classList.add('show');
  }
}

function initDialogEvents() {
  const dialog = document.getElementById('music-error-dialog');
  const closeBtn = document.getElementById('dialog-close-btn');

  if (!dialog || !closeBtn) return;

  const hideDialog = () => {
    dialog.classList.remove('show');
  };

  closeBtn.addEventListener('click', hideDialog);
  dialog.addEventListener('click', event => {
    if (event.target === dialog) hideDialog();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && dialog.classList.contains('show')) {
      hideDialog();
    }
  });
}
