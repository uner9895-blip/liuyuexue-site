/**
 * 六月雪个人网页 - “听雪小筑”独立音乐页控制逻辑
 */

(function () {
  if (window.__liuyuexueMusicInitialized) return;

  const plumTrackCopy = {
    'ecoute-cherie': {
      title: '一枝雪：月下轻语',
      branch: '一枝雪',
      note: '月光先落在低枝，像一句很轻的开场。'
    },
    'fallin-out': {
      title: '二枝雪：坠入风外',
      branch: '二枝雪',
      note: '风从枝梢掠过，旧雪在暗处慢慢发亮。'
    },
    'hong-san-ke-zhan': {
      title: '三枝雪：红山客栈',
      branch: '三枝雪',
      note: '远灯照着来路，梅影像一封未拆的信。'
    },
    'ji-mo-ji-mo-bu-hao': {
      title: '四枝雪：寂寞不声',
      branch: '四枝雪',
      note: '雪压低了檐声，花却替沉默开了一点。'
    },
    'lan-ting-xu': {
      title: '五枝雪：兰亭旧序',
      branch: '五枝雪',
      note: '墨痕在月下回温，枝头留着旧日行书。'
    },
    'lian-ren': {
      title: '六枝雪：恋人未远',
      branch: '六枝雪',
      note: '一朵梅向夜里倾身，像还没走远的人。'
    },
    'yin-tian': {
      title: '七枝雪：阴天听雪',
      branch: '七枝雪',
      note: '云色压低，仍有一盏暖音悬在枝上。'
    }
  };

  const MUSIC_PLAYLIST = (window.musicTracks || []).map((song, index) => ({
    id: song.id || 'track-' + (index + 1),
    title: getPlumCopy(song, index).title,
    branch: getPlumCopy(song, index).branch,
    originalTitle: song.title || formatTitleFromPath(song.src || '本地曲目'),
    fileName: getFileName(song.src || ''),
    note: getPlumCopy(song, index).note,
    artist: song.artist || '本地音乐',
    src: song.src,
    tag: song.tag || '雪音',
    duration: song.duration || '--:--'
  })).filter(song => song.src);

  const stateText = {
    idle: '未开始',
    loading: '启封中',
    playing: '正在听',
    paused: '已暂停',
    ended: '曲终',
    error: '加载失败'
  };

  const atmosphereText = {
    idle: '静待清音……',
    loading: '梅上清音将至……',
    playing: '雪落枝头，正在听……',
    paused: '清音暂歇，梅灯仍在……',
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
  let hasSelectedTrack = false;
  const listenedTrackIds = new Set();
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
      currentOriginal: document.getElementById('music-current-original'),
      currentMeta: document.getElementById('music-current-meta'),
      currentStatus: document.getElementById('music-current-status'),
      currentCopy: document.getElementById('music-current-copy'),
      atmosphere: document.getElementById('music-atmosphere'),
      errorMessage: document.getElementById('music-error-message'),
      trackIndex: document.getElementById('music-track-index'),
      playbar: document.getElementById('playbar-container'),
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
        '  <button class="track-select" type="button" data-track-index="' + index + '" aria-label="播放 ' + escapeHtml(song.title) + '">',
        '    <span class="track-branch-mark" aria-hidden="true"></span>',
        '    <span class="track-blossom" aria-hidden="true">',
        '      <span class="track-petal track-petal-1"></span>',
        '      <span class="track-petal track-petal-2"></span>',
        '      <span class="track-petal track-petal-3"></span>',
        '      <span class="track-petal track-petal-4"></span>',
        '      <span class="track-petal track-petal-5"></span>',
        '      <span class="track-blossom-heart"></span>',
        '    </span>',
        '    <span class="track-number">' + number + '</span>',
        '    <span class="track-main">',
        '      <span class="track-title">' + escapeHtml(song.title) + '</span>',
        '      <span class="track-artist">' + escapeHtml(song.originalTitle || song.fileName || '本地音乐') + '</span>',
        '    </span>',
        '    <span class="track-duration" data-duration-for="' + escapeHtml(song.id) + '">' + escapeHtml(song.duration || '--:--') + '</span>',
        '    <span class="track-state"><span class="track-wave" aria-hidden="true"><i></i><i></i><i></i></span><span class="track-state-text">待启封</span></span>',
        '  </button>',
        '</li>'
      ].join('');
    }).join('');

    renderTrackIndex();
  }

  function renderTrackIndex() {
    if (!elements.trackIndex) return;

    elements.trackIndex.innerHTML = MUSIC_PLAYLIST.map((song, index) => {
      const number = String(index + 1).padStart(2, '0');
      return [
        '<li class="music-index-item" data-index="' + index + '">',
        '  <button class="music-index-select" type="button" data-track-index="' + index + '" aria-label="播放 ' + escapeHtml(song.title) + '">',
        '    <span class="music-index-number">' + number + '</span>',
        '    <span class="music-index-name">' + escapeHtml(song.title) + '</span>',
        '    <span class="music-index-duration">' + escapeHtml(song.duration || '--:--') + '</span>',
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
        selectTrack(Number(button.getAttribute('data-track-index')));
      });
    }

    if (elements.trackIndex) {
      elements.trackIndex.addEventListener('click', event => {
        const button = event.target.closest('[data-track-index]');
        if (!button) return;
        selectTrack(Number(button.getAttribute('data-track-index')));
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
        hasSelectedTrack = true;
        switchTrack((currentTrackIndex - 1 + MUSIC_PLAYLIST.length) % MUSIC_PLAYLIST.length, shouldPlay);
      });
    }

    if (elements.nextBtn) {
      elements.nextBtn.addEventListener('click', () => {
        const shouldPlay = playerState === 'playing' || playerState === 'loading';
        hasSelectedTrack = true;
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
      listenedTrackIds.add(getCurrentTrack().id);
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
      console.warn('Audio load failed:', {
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

  function selectTrack(index) {
    if (!Number.isInteger(index) || !MUSIC_PLAYLIST[index]) return;
    hasSelectedTrack = true;
    revealPlaybar();

    if (index === currentTrackIndex) {
      if (playerState === 'playing' || playerState === 'loading') {
        renderPlayerState();
        return;
      }
      playCurrentTrack();
      return;
    }

    switchTrack(index, true);
  }

  function toggleTrack(index) {
    if (!Number.isInteger(index) || !MUSIC_PLAYLIST[index]) return;
    hasSelectedTrack = true;
    revealPlaybar();

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
      console.warn('Audio play failed:', error);
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

    if (hasSelectedTrack) {
      setText(elements.currentIndex, song.branch || currentNumber);
      setText(elements.currentTitle, song.title);
      setText(elements.currentOriginal, (song.originalTitle || song.fileName || '本地曲目') + ' · ' + (song.fileName || '本地音频'));
      setText(elements.currentMeta, (song.artist || '本地音乐') + ' · ' + duration);
      setText(elements.currentStatus, stateText[playerState] || stateText.idle);
      setText(elements.currentCopy, getCurrentCopy(song));
      setText(elements.playbarTitle, song.title);
      setText(elements.playbarArtist, song.originalTitle ? song.originalTitle + ' · ' + (song.artist || '本地音乐') : (song.artist || '本地音乐'));
    } else {
      setText(elements.currentIndex, '未启');
      setText(elements.currentTitle, '静待选曲');
      setText(elements.currentOriginal, '选择一朵梅花');
      setText(elements.currentMeta, '本地音乐 · --:--');
      setText(elements.currentStatus, stateText.idle);
      setText(elements.currentCopy, '月下微灯未启，先让雪声落满枝头。');
      setText(elements.playbarTitle, '静待选曲');
      setText(elements.playbarArtist, '本地音乐');
    }
    setText(elements.totalTime, duration);

    if (elements.playbarCover) {
      elements.playbarCover.textContent = hasSelectedTrack ? currentNumber : '梅';
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
    renderTrackIndexState();
    renderErrorMessage();
  }

  function renderPlaylistState() {
    if (!elements.playlist) return;

    elements.playlist.querySelectorAll('.track-item').forEach((item, index) => {
      const button = item.querySelector('.track-select');
      const stateLabel = item.querySelector('.track-state-text');
      const durationLabel = item.querySelector('.track-duration');
      const active = hasSelectedTrack && index === currentTrackIndex;
      const song = MUSIC_PLAYLIST[index];
      const listened = listenedTrackIds.has(song.id);
      const itemState = active ? (stateText[playerState] || '待启封') : (listened ? '已听过' : '待启封');

      item.classList.toggle('is-current', active);
      item.classList.toggle('is-playing', active && playerState === 'playing');
      item.classList.toggle('is-paused', active && playerState === 'paused');
      item.classList.toggle('is-loading', active && playerState === 'loading');
      item.classList.toggle('is-error', active && playerState === 'error');
      item.classList.toggle('is-listened', listened);

      if (button) {
        button.setAttribute('aria-current', active ? 'true' : 'false');
        button.setAttribute('aria-label', (active && playerState === 'playing' ? '正在听 ' : '播放 ') + song.title);
      }
      if (stateLabel) stateLabel.textContent = itemState;
      if (durationLabel) durationLabel.textContent = getDurationText(song);
    });
  }

  function renderTrackIndexState() {
    if (!elements.trackIndex) return;

    elements.trackIndex.querySelectorAll('.music-index-item').forEach((item, index) => {
      const button = item.querySelector('.music-index-select');
      const durationLabel = item.querySelector('.music-index-duration');
      const active = hasSelectedTrack && index === currentTrackIndex;
      const listened = listenedTrackIds.has(MUSIC_PLAYLIST[index].id);

      item.classList.toggle('is-current', active);
      item.classList.toggle('is-playing', active && playerState === 'playing');
      item.classList.toggle('is-listened', listened);
      if (button) button.setAttribute('aria-current', active ? 'true' : 'false');
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
    elements.errorMessage.textContent = '这枝梅暂时没有声音，换一朵试试。当前路径：' + getCurrentTrack().src;
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

  function getCurrentCopy(song) {
    if (playerState === 'error') return '这枝梅暂时没有声音，换一朵试试。';
    if (playerState === 'loading') return '纸笺轻动，正在把这枝梅里的声音启封。';
    if (playerState === 'paused') return '曲声暂歇，花光仍留在枝头。';
    if (playerState === 'ended') return '一曲落尽，余温还在旧纸边上。';
    return song.note || '月下微灯已启，雪声落在枝头。';
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

  function getFileName(path) {
    return String(path).split('/').pop() || '';
  }

  function getPlumCopy(song, index) {
    const id = song.id || 'track-' + (index + 1);
    return plumTrackCopy[id] || {
      title: song.title || formatTitleFromPath(song.src || '本地曲目'),
      branch: String(index + 1).padStart(2, '0'),
      note: '月下微灯已启，雪声落在枝头。'
    };
  }

  function revealPlaybar() {
    if (!elements.playbar) return;
    elements.playbar.classList.remove('is-awaiting-selection');
    elements.playbar.classList.add('is-revealed');
    elements.playbar.dataset.revealed = 'true';
    document.body.classList.add('music-playbar-revealed');
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
