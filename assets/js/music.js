/**
 * 六月雪个人网页 - “听雪小筑”独立音乐页控制逻辑
 */

(function () {
  if (window.__liuyuexueMusicInitialized) return;

  const MUSIC_PLAYLIST = (window.musicTracks || []).map((song, index) => ({
    id: song.id || 'track-' + (index + 1),
    title: song.title || formatTitleFromPath(song.src || '本地曲目'),
    artist: song.artist || '本地音乐',
    src: song.src,
    tag: song.tag || '雪音',
    duration: song.duration || '--:--'
  })).filter(song => song.src);

  const stateText = {
    idle: '未开始',
    loading: '加载中',
    playing: '正在播放',
    paused: '暂歇',
    ended: '曲终',
    error: '无法播放'
  };

  const atmosphereText = {
    idle: '静待清音……',
    loading: '清音将至……',
    playing: '正在聆听……',
    paused: '暂歇片刻……',
    ended: '曲终余韵……',
    error: '此曲暂不可闻'
  };

  let siteAudio = null;
  let currentTrackIndex = 0;
  let playerState = 'idle';
  let playRequestToken = 0;
  let suppressPauseEvent = false;
  let isSeeking = false;
  let intendedToPlay = false;
  let lastRenderedAtmosphere = '';
  let elements = {};

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMusicPage);
  } else {
    initMusicPage();
  }

  function initMusicPage() {
    if (!document.body.classList.contains('page-music')) return;
    if (!MUSIC_PLAYLIST.length || typeof window.getSiteAudio !== 'function') return;

    window.__liuyuexueMusicInitialized = true;
    document.body.dataset.musicInitialized = 'true';
    siteAudio = window.getSiteAudio();
    siteAudio.preload = 'metadata';
    siteAudio.playsInline = true;
    siteAudio.loop = false;

    cacheElements();
    renderPlaylist();
    bindControls();
    bindAudioEvents();
    restoreVolume();
    ensureTrackSource(false);
    renderPlayerState();
  }

  function cacheElements() {
    elements = {
      playlist: document.getElementById('playlist-container'),
      currentIndex: document.getElementById('music-current-index'),
      currentTitle: document.getElementById('music-current-title'),
      currentMeta: document.getElementById('music-current-meta'),
      currentStatus: document.getElementById('music-current-status'),
      atmosphere: document.getElementById('music-atmosphere'),
      errorMessage: document.getElementById('music-error-message'),
      playbarTitle: document.getElementById('playbar-title'),
      playbarArtist: document.getElementById('playbar-artist'),
      playbarCover: document.querySelector('.playbar-cover'),
      playBtn: document.getElementById('playbar-play-btn'),
      prevBtn: document.getElementById('playbar-prev-btn'),
      nextBtn: document.getElementById('playbar-next-btn'),
      progress: document.getElementById('playbar-progress'),
      currentTime: document.getElementById('playbar-current-time'),
      totalTime: document.getElementById('playbar-total-time'),
      volume: document.getElementById('playbar-volume'),
      dialog: document.getElementById('music-error-dialog'),
      dialogPath: document.getElementById('dialog-file-path'),
      dialogClose: document.getElementById('dialog-close-btn')
    };
  }

  function renderPlaylist() {
    if (!elements.playlist) return;

    elements.playlist.innerHTML = MUSIC_PLAYLIST.map((song, index) => {
      const number = String(index + 1).padStart(2, '0');
      return [
        '<li class="track-item" data-index="' + index + '">',
        '  <button class="track-select" type="button" data-track-index="' + index + '" aria-label="选择 ' + escapeHtml(song.title) + '">',
        '    <span class="track-number">' + number + '</span>',
        '    <span class="track-main">',
        '      <span class="track-title">' + escapeHtml(song.title) + '</span>',
        '      <span class="track-artist">' + escapeHtml(song.artist || '本地音乐') + '</span>',
        '    </span>',
        '    <span class="track-duration" data-duration-for="' + escapeHtml(song.id) + '">' + escapeHtml(song.duration || '--:--') + '</span>',
        '    <span class="track-state"><span class="track-wave" aria-hidden="true"><i></i><i></i><i></i></span><span class="track-state-text">待播放</span></span>',
        '  </button>',
        '</li>'
      ].join('');
    }).join('');
  }

  function bindControls() {
    if (elements.playlist) {
      elements.playlist.addEventListener('click', event => {
        const button = event.target.closest('[data-track-index]');
        if (!button) return;
        toggleTrack(Number(button.getAttribute('data-track-index')));
      });
    }

    if (elements.playBtn) {
      elements.playBtn.addEventListener('click', () => {
        toggleTrack(currentTrackIndex);
      });
    }

    if (elements.prevBtn) {
      elements.prevBtn.addEventListener('click', () => {
        const shouldPlay = playerState === 'playing' || playerState === 'loading';
        switchTrack((currentTrackIndex - 1 + MUSIC_PLAYLIST.length) % MUSIC_PLAYLIST.length, shouldPlay);
      });
    }

    if (elements.nextBtn) {
      elements.nextBtn.addEventListener('click', () => {
        const shouldPlay = playerState === 'playing' || playerState === 'loading';
        switchTrack((currentTrackIndex + 1) % MUSIC_PLAYLIST.length, shouldPlay);
      });
    }

    if (elements.progress) {
      elements.progress.addEventListener('input', event => {
        isSeeking = true;
        updateProgressPreview(Number(event.target.value));
      });

      elements.progress.addEventListener('change', event => {
        commitSeek(Number(event.target.value));
      });

      elements.progress.addEventListener('pointerup', event => {
        commitSeek(Number(event.currentTarget.value));
      });
    }

    if (elements.volume) {
      elements.volume.addEventListener('input', event => {
        const volume = clamp(Number(event.target.value), 0, 1);
        siteAudio.volume = volume;
        siteAudio.muted = volume === 0;
        localStorage.setItem('liuyuexueMusicVolume', String(volume));
        renderVolumeText(volume);
      });
    }

    if (elements.dialog && elements.dialogClose) {
      elements.dialogClose.addEventListener('click', hideErrorDialog);
      elements.dialog.addEventListener('click', event => {
        if (event.target === elements.dialog) hideErrorDialog();
      });
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && elements.dialog.classList.contains('show')) {
          hideErrorDialog();
        }
      });
    }
  }

  function bindAudioEvents() {
    siteAudio.addEventListener('loadedmetadata', () => {
      const song = getCurrentTrack();
      if (song && Number.isFinite(siteAudio.duration) && siteAudio.duration > 0) {
        song.duration = formatTime(siteAudio.duration);
      }
      if (!intendedToPlay && playerState === 'loading') {
        playerState = 'paused';
      }
      renderPlayerState();
      updateProgress();
    });

    siteAudio.addEventListener('durationchange', () => {
      const song = getCurrentTrack();
      if (song && Number.isFinite(siteAudio.duration) && siteAudio.duration > 0) {
        song.duration = formatTime(siteAudio.duration);
      }
      renderPlayerState();
      updateProgress();
    });

    siteAudio.addEventListener('canplay', () => {
      if (playerState === 'loading' && !intendedToPlay) {
        playerState = 'paused';
        renderPlayerState();
      }
    });

    siteAudio.addEventListener('playing', () => {
      if (!intendedToPlay) {
        siteAudio.pause();
        return;
      }
      intendedToPlay = true;
      playerState = 'playing';
      renderPlayerState();
    });

    siteAudio.addEventListener('pause', () => {
      if (suppressPauseEvent) {
        suppressPauseEvent = false;
        return;
      }
      if (siteAudio.ended || playerState === 'ended' || playerState === 'error') return;
      intendedToPlay = false;
      playerState = 'paused';
      renderPlayerState();
    });

    siteAudio.addEventListener('waiting', () => {
      if (intendedToPlay && playerState !== 'ended' && playerState !== 'error') {
        playerState = 'loading';
        renderPlayerState();
      }
    });

    siteAudio.addEventListener('stalled', () => {
      if (intendedToPlay && playerState !== 'ended' && playerState !== 'error') {
        playerState = 'loading';
        renderPlayerState();
      }
    });

    siteAudio.addEventListener('ended', () => {
      intendedToPlay = false;
      playerState = 'ended';
      renderPlayerState();
      switchTrack((currentTrackIndex + 1) % MUSIC_PLAYLIST.length, true);
    });

    siteAudio.addEventListener('error', () => {
      console.error('Audio load failed:', {
        src: siteAudio.currentSrc || siteAudio.src,
        errorCode: siteAudio.error?.code
      });
      intendedToPlay = false;
      playerState = 'error';
      renderPlayerState();
      showErrorDialog(getCurrentTrack().src);
    });

    siteAudio.addEventListener('timeupdate', updateProgress);
  }

  function toggleTrack(index) {
    if (!Number.isInteger(index) || !MUSIC_PLAYLIST[index]) return;

    if (index === currentTrackIndex) {
      if (playerState === 'playing' || playerState === 'loading') {
        playRequestToken += 1;
        intendedToPlay = false;
        siteAudio.pause();
        playerState = 'paused';
        renderPlayerState();
        return;
      }

      playCurrentTrack();
      return;
    }

    switchTrack(index, true);
  }

  function switchTrack(index, shouldPlay) {
    if (!Number.isInteger(index) || !MUSIC_PLAYLIST[index]) return;

    playRequestToken += 1;
    if (!siteAudio.paused) {
      suppressPauseEvent = true;
      siteAudio.pause();
    }

    currentTrackIndex = index;
    intendedToPlay = shouldPlay;
    playerState = 'loading';
    ensureTrackSource(true);
    resetProgress();
    renderPlayerState();

    if (shouldPlay) {
      playCurrentTrack();
    }
  }

  function playCurrentTrack() {
    ensureTrackSource(false);

    const token = ++playRequestToken;
    intendedToPlay = true;
    playerState = 'loading';
    hideErrorMessage();
    renderPlayerState();

    siteAudio.play().then(() => {
      if (token !== playRequestToken) return;
      playerState = 'playing';
      renderPlayerState();
    }).catch(error => {
      if (token !== playRequestToken) return;
      intendedToPlay = false;
      if (error && error.name === 'NotAllowedError') {
        playerState = 'paused';
        renderPlayerState();
        return;
      }
      console.error('Audio play failed:', error);
      playerState = 'error';
      renderPlayerState();
      showErrorDialog(getCurrentTrack().src);
    });
  }

  function ensureTrackSource(forceLoad) {
    const song = getCurrentTrack();
    const targetSrc = new URL(song.src, window.location.href).href;
    if (siteAudio.src !== targetSrc) {
      siteAudio.src = song.src;
      siteAudio.load();
      return;
    }
    if (forceLoad) {
      siteAudio.load();
    }
  }

  function renderPlayerState() {
    const song = getCurrentTrack();
    const duration = getDurationText(song);
    const currentNumber = String(currentTrackIndex + 1).padStart(2, '0');
    const isBusy = playerState === 'loading';
    const isPlaying = playerState === 'playing';

    setText(elements.currentIndex, currentNumber);
    setText(elements.currentTitle, song.title);
    setText(elements.currentMeta, (song.artist || '本地音乐') + ' · ' + duration);
    setText(elements.currentStatus, stateText[playerState] || stateText.idle);
    setText(elements.playbarTitle, song.title);
    setText(elements.playbarArtist, song.artist || '本地音乐');
    setText(elements.totalTime, duration);

    if (elements.playbarCover) {
      elements.playbarCover.textContent = currentNumber;
    }

    if (elements.playBtn) {
      elements.playBtn.innerHTML = isBusy ? loadingIcon() : (isPlaying ? pauseIcon() : playIcon());
      elements.playBtn.classList.toggle('is-loading', isBusy);
      elements.playBtn.setAttribute('aria-label', isPlaying ? '暂停当前歌曲' : (isBusy ? '歌曲加载中' : '播放当前歌曲'));
      elements.playBtn.disabled = false;
    }

    if (elements.atmosphere && lastRenderedAtmosphere !== atmosphereText[playerState]) {
      lastRenderedAtmosphere = atmosphereText[playerState];
      elements.atmosphere.textContent = lastRenderedAtmosphere;
    }

    renderPlaylistState();
    renderErrorMessage();
  }

  function renderPlaylistState() {
    if (!elements.playlist) return;

    elements.playlist.querySelectorAll('.track-item').forEach((item, index) => {
      const button = item.querySelector('.track-select');
      const stateLabel = item.querySelector('.track-state-text');
      const durationLabel = item.querySelector('.track-duration');
      const active = index === currentTrackIndex;
      const itemState = active ? (stateText[playerState] || '待播放') : '待播放';

      item.classList.toggle('is-current', active);
      item.classList.toggle('is-playing', active && playerState === 'playing');
      item.classList.toggle('is-loading', active && playerState === 'loading');
      item.classList.toggle('is-error', active && playerState === 'error');

      if (button) {
        button.setAttribute('aria-current', active ? 'true' : 'false');
        button.setAttribute('aria-label', (active && playerState === 'playing' ? '暂停 ' : '选择 ') + MUSIC_PLAYLIST[index].title);
      }
      if (stateLabel) stateLabel.textContent = itemState;
      if (durationLabel) durationLabel.textContent = getDurationText(MUSIC_PLAYLIST[index]);
    });
  }

  function renderErrorMessage() {
    if (!elements.errorMessage) return;

    if (playerState !== 'error') {
      hideErrorMessage();
      return;
    }

    elements.errorMessage.hidden = false;
    elements.errorMessage.textContent = '此曲暂不可闻，请确认音频文件路径存在：' + getCurrentTrack().src;
  }

  function hideErrorMessage() {
    if (!elements.errorMessage) return;
    elements.errorMessage.hidden = true;
    elements.errorMessage.textContent = '';
  }

  function updateProgress() {
    if (isSeeking) return;

    const duration = Number.isFinite(siteAudio.duration) && siteAudio.duration > 0 ? siteAudio.duration : 0;
    const currentTime = Number.isFinite(siteAudio.currentTime) ? siteAudio.currentTime : 0;
    const value = duration > 0 ? Math.round((currentTime / duration) * 1000) : 0;

    if (elements.progress) {
      elements.progress.value = String(value);
      elements.progress.style.setProperty('--progress', value / 10 + '%');
      elements.progress.setAttribute('aria-valuetext', formatTime(currentTime) + ' / ' + (duration ? formatTime(duration) : getDurationText(getCurrentTrack())));
    }
    setText(elements.currentTime, formatTime(currentTime));
    if (duration) setText(elements.totalTime, formatTime(duration));
  }

  function updateProgressPreview(value) {
    const duration = Number.isFinite(siteAudio.duration) && siteAudio.duration > 0 ? siteAudio.duration : 0;
    const percent = clamp(value, 0, 1000) / 1000;
    const previewTime = duration * percent;

    if (elements.progress) {
      elements.progress.style.setProperty('--progress', (percent * 100).toFixed(2) + '%');
      elements.progress.setAttribute('aria-valuetext', formatTime(previewTime) + ' / ' + (duration ? formatTime(duration) : getDurationText(getCurrentTrack())));
    }
    setText(elements.currentTime, formatTime(previewTime));
  }

  function commitSeek(value) {
    const duration = Number.isFinite(siteAudio.duration) && siteAudio.duration > 0 ? siteAudio.duration : 0;
    if (duration) {
      siteAudio.currentTime = (clamp(value, 0, 1000) / 1000) * duration;
    }
    isSeeking = false;
    updateProgress();
  }

  function resetProgress() {
    isSeeking = false;
    if (elements.progress) {
      elements.progress.value = '0';
      elements.progress.style.setProperty('--progress', '0%');
      elements.progress.setAttribute('aria-valuetext', '00:00 / ' + getDurationText(getCurrentTrack()));
    }
    setText(elements.currentTime, '00:00');
  }

  function restoreVolume() {
    if (!elements.volume) return;

    const savedVolume = Number(localStorage.getItem('liuyuexueMusicVolume'));
    const initialVolume = Number.isFinite(savedVolume) ? clamp(savedVolume, 0, 1) : Number(elements.volume.value || 0.6);
    siteAudio.volume = initialVolume;
    siteAudio.muted = initialVolume === 0;
    elements.volume.value = String(initialVolume);
    elements.volume.style.setProperty('--progress', (initialVolume * 100).toFixed(0) + '%');
    renderVolumeText(initialVolume);
  }

  function renderVolumeText(value) {
    if (!elements.volume) return;
    const percent = Math.round(value * 100);
    elements.volume.style.setProperty('--progress', percent + '%');
    elements.volume.setAttribute('aria-valuetext', value === 0 ? '静音' : '音量 ' + percent + '%');
  }

  function showErrorDialog(filePath) {
    if (elements.dialogPath) elements.dialogPath.textContent = filePath;
    if (elements.dialog) elements.dialog.classList.add('show');
  }

  function hideErrorDialog() {
    if (elements.dialog) elements.dialog.classList.remove('show');
  }

  function getCurrentTrack() {
    return MUSIC_PLAYLIST[currentTrackIndex] || MUSIC_PLAYLIST[0];
  }

  function getDurationText(song) {
    return song && song.duration ? song.duration : '--:--';
  }

  function setText(element, value) {
    if (element) element.textContent = value;
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return String(minutes).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
  }

  function formatTitleFromPath(path) {
    const fileName = String(path).split('/').pop().replace(/\.[^.]+$/, '');
    return fileName
      .split(/[-_\s]+/)
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ') || '本地曲目';
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
  }

  function playIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  }

  function pauseIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg>';
  }

  function loadingIcon() {
    return '<svg class="music-loading-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"></circle><path d="M12 4a8 8 0 0 1 8 8"></path></svg>';
  }
})();
