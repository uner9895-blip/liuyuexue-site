/**
 * “听雪”月下梅树音乐页。
 * 复用 main.js 暴露的单一 Audio 实例；本文件只负责本页场景、状态和控制。
 */

(function () {
  if (window.__liuyuexueMusicInitialized) return;

  const plumTrackCopy = {
    'you-wo-ne': {
      title: '一枝雪：有我呢',
      branch: '一枝雪',
      note: '有我呢，风雪再远，也有人与你并肩。'
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

  const trackPoints = [
    { desktop: [8.2, 73.5], mobile: [13.0, 70.5] },
    { desktop: [18.3, 51.2], mobile: [18.0, 52.0] },
    { desktop: [30.6, 37.4], mobile: [30.1, 35.0] },
    { desktop: [44.3, 21.5], mobile: [48.5, 23.0] },
    { desktop: [46.2, 61.2], mobile: [66.0, 49.1] },
    { desktop: [77.2, 23.1], mobile: [79.0, 19.0] },
    { desktop: [81.0, 52.6], mobile: [85.5, 32.0] }
  ];

  const MUSIC_PLAYLIST = (window.musicTracks || []).map((song, index) => {
    const copy = getPlumCopy(song, index);
    const point = trackPoints[index] || trackPoints[0];
    return {
      id: song.id || 'track-' + (index + 1),
      title: copy.title,
      branch: copy.branch,
      originalTitle: song.title || formatTitleFromPath(song.src || '本地曲目'),
      fileName: getFileName(song.src || ''),
      note: copy.note,
      artist: song.artist || '本地音乐',
      src: song.src,
      duration: song.duration || '--:--',
      point: point
    };
  }).filter(song => song.src);

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
  let intendedToPlay = false;
  let suppressPauseEvent = false;
  let isScrubbing = false;
  let wasPlayingBeforeScrub = false;
  let activeScrubPointerId = null;
  let pendingSeekTarget = null;
  let hasSelectedTrack = false;
  let noteMoveTimer = 0;
  let resizeFrame = 0;
  let trackPositionFrame = 0;
  let stageResizeObserver = null;
  let lastDialogFocus = null;
  const listenedTrackIds = new Set();
  const bloomTimers = new Map();
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
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
    removeMusicCompanion();
    window.requestAnimationFrame(removeMusicCompanion);
    siteAudio = window.getSiteAudio();
    siteAudio.preload = 'metadata';
    siteAudio.playsInline = true;
    siteAudio.loop = false;

    cacheElements();
    renderPlaylist();
    renderTrackIndex();
    scheduleTrackPositions();
    bindControls();
    bindAudioEvents();
    restoreVolume();
    updateReducedMotionState();
    ensureTrackSource(false);
    renderPlayerState();
  }

  function cacheElements() {
    elements = {
      stage: document.getElementById('music-stage'),
      sceneImage: document.querySelector('.music-scene-image'),
      playlist: document.getElementById('playlist-container'),
      currentIndex: document.getElementById('music-current-index'),
      currentTitle: document.getElementById('music-note-title'),
      currentOriginal: document.getElementById('music-current-original'),
      currentMeta: document.getElementById('music-current-meta'),
      currentStatus: document.getElementById('music-current-status'),
      currentCopy: document.getElementById('music-current-copy'),
      atmosphere: document.getElementById('music-atmosphere'),
      errorMessage: document.getElementById('music-error-message'),
      note: document.getElementById('music-note'),
      heading: document.querySelector('.music-scene-heading'),
      trackIndex: document.getElementById('music-track-index'),
      indexDrawer: document.querySelector('.music-index-drawer'),
      indexToggle: document.getElementById('music-index-toggle'),
      indexPanel: document.getElementById('music-index-panel'),
      playbar: document.getElementById('playbar-container'),
      playbarTitle: document.getElementById('playbar-title'),
      playbarArtist: document.getElementById('playbar-artist'),
      playerState: document.getElementById('music-player-state'),
      playBtn: document.getElementById('playbar-play-btn'),
      prevBtn: document.getElementById('playbar-prev-btn'),
      nextBtn: document.getElementById('playbar-next-btn'),
      progress: document.getElementById('playbar-progress'),
      currentTime: document.getElementById('playbar-current-time'),
      totalTime: document.getElementById('playbar-total-time'),
      volumeToggle: document.getElementById('music-volume-toggle'),
      volumePanel: document.getElementById('music-volume-panel'),
      volume: document.getElementById('playbar-volume'),
      dialog: document.getElementById('music-error-dialog'),
      dialogPath: document.getElementById('dialog-file-path'),
      dialogClose: document.getElementById('dialog-close-btn')
    };
  }

  function removeMusicCompanion() {
    document.querySelectorAll('[data-companion-cat]').forEach(cat => cat.remove());
  }

  function renderPlaylist() {
    if (!elements.playlist) return;

    elements.playlist.innerHTML = MUSIC_PLAYLIST.map((song, index) => {
      const point = song.point;
      const style = [
        '--track-x:' + point.desktop[0] + '%',
        '--track-y:' + point.desktop[1] + '%',
        '--track-x-mobile:' + point.mobile[0] + '%',
        '--track-y-mobile:' + point.mobile[1] + '%'
      ].join(';');
      return [
        '<li class="track-item track-item--variant-' + ((index % 4) + 1) + '" data-index="' + index + '" data-desktop-x="' + point.desktop[0] + '" data-desktop-y="' + point.desktop[1] + '" data-mobile-x="' + point.mobile[0] + '" data-mobile-y="' + point.mobile[1] + '" style="' + style + '">',
        '  <button class="track-select" type="button" data-track-index="' + index + '" aria-label="播放 ' + escapeHtml(song.title) + '">',
        buildBloomMarkup(),
        '    <span class="sr-only track-state-text">待启封</span>',
        '  </button>',
        '</li>'
      ].join('');
    }).join('');
  }

  function buildBloomMarkup() {
    const petals = '<i></i><i></i><i></i><i></i><i></i>';
    return [
      '    <span class="track-bloom" aria-hidden="true">',
      '      <span class="bloom-stem"></span>',
      '      <span class="bloom-veil"></span>',
      '      <span class="bloom-petal-ring bloom-petal-ring--outer">' + petals + '</span>',
      '      <span class="bloom-petal-ring bloom-petal-ring--inner">' + petals + '</span>',
      '      <span class="bloom-core"><i></i></span>',
      '      <span class="bloom-fall"><i></i><i></i><i></i></span>',
      '    </span>'
    ].join('');
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
        '    <span class="music-index-duration">' + escapeHtml(song.duration) + '</span>',
        '  </button>',
        '</li>'
      ].join('');
    }).join('');
  }

  function bindControls() {
    if (elements.playlist) {
      elements.playlist.addEventListener('click', event => {
        const button = event.target.closest('[data-track-index]');
        if (button) selectTrack(Number(button.dataset.trackIndex));
      });
    }

    if (elements.trackIndex) {
      elements.trackIndex.addEventListener('click', event => {
        const button = event.target.closest('[data-track-index]');
        if (!button) return;
        selectTrack(Number(button.dataset.trackIndex));
        if (window.innerWidth <= 820) setIndexOpen(false);
      });
    }

    if (elements.indexToggle) {
      elements.indexToggle.addEventListener('click', () => {
        setIndexOpen(elements.indexToggle.getAttribute('aria-expanded') !== 'true');
      });
    }

    if (elements.volumeToggle) {
      elements.volumeToggle.addEventListener('click', () => {
        setVolumeOpen(elements.volumeToggle.getAttribute('aria-expanded') !== 'true');
      });
    }

    if (elements.playBtn) {
      elements.playBtn.addEventListener('click', () => toggleTrack(currentTrackIndex));
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
      elements.progress.step = '0.01';
      elements.progress.addEventListener('pointerdown', event => {
        if (!hasSelectedTrack || !Number.isFinite(siteAudio.duration) || siteAudio.duration <= 0) return;
        event.preventDefault();
        beginScrub();
        activeScrubPointerId = event.pointerId;
        elements.progress.setPointerCapture(event.pointerId);
        updateScrubFromPointer(event);
      });
      elements.progress.addEventListener('pointermove', event => {
        if (!isScrubbing || event.pointerId !== activeScrubPointerId) return;
        event.preventDefault();
        updateScrubFromPointer(event);
      });
      elements.progress.addEventListener('pointerup', event => {
        if (!isScrubbing || event.pointerId !== activeScrubPointerId) return;
        event.preventDefault();
        updateScrubFromPointer(event);
        if (elements.progress.hasPointerCapture(event.pointerId)) {
          elements.progress.releasePointerCapture(event.pointerId);
        }
        activeScrubPointerId = null;
        elements.progress.dispatchEvent(new Event('change', { bubbles: true }));
      });
      elements.progress.addEventListener('pointercancel', event => {
        if (event.pointerId !== activeScrubPointerId) return;
        activeScrubPointerId = null;
        isScrubbing = false;
        wasPlayingBeforeScrub = false;
        updateProgress();
      });
      elements.progress.addEventListener('input', event => {
        if (!isScrubbing) beginScrub();
        updateProgressPreview(Number(event.currentTarget.value));
      });
      elements.progress.addEventListener('change', event => {
        if (!isScrubbing) return;
        commitScrub(Number(event.currentTarget.value));
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
    }

    document.addEventListener('keydown', event => {
      if (handleRangeKeydown(event)) return;
      if (event.target instanceof HTMLButtonElement && (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar')) {
        event.preventDefault();
        event.target.click();
        return;
      }
      if (event.key !== 'Escape') return;
      if (elements.dialog && elements.dialog.classList.contains('show')) {
        hideErrorDialog();
        return;
      }
      if (elements.indexToggle && elements.indexToggle.getAttribute('aria-expanded') === 'true') {
        setIndexOpen(false);
        elements.indexToggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      scheduleNotePosition();
      scheduleTrackPositions();
    }, { passive: true });
    if (elements.sceneImage) {
      elements.sceneImage.addEventListener('load', () => {
        scheduleNotePosition();
        scheduleTrackPositions();
      });
    }
    if (typeof ResizeObserver === 'function' && elements.stage) {
      stageResizeObserver = new ResizeObserver(scheduleTrackPositions);
      stageResizeObserver.observe(elements.stage);
      if (elements.sceneImage) stageResizeObserver.observe(elements.sceneImage);
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(scheduleTrackPositions);
    }
    window.setTimeout(scheduleTrackPositions, 160);
    if (typeof reducedMotionQuery.addEventListener === 'function') {
      reducedMotionQuery.addEventListener('change', updateReducedMotionState);
    }
  }

  function handleRangeKeydown(event) {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.type !== 'range') return false;
    if (input === elements.progress) {
      const duration = Number.isFinite(siteAudio.duration) ? siteAudio.duration : 0;
      if (!hasSelectedTrack || duration <= 0) return false;
      const current = Number.isFinite(input.valueAsNumber) ? input.valueAsNumber : siteAudio.currentTime;
      let next = current;

      if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = duration;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = current - 5;
      else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = current + 5;
      else if (event.key === 'PageDown') next = current - 30;
      else if (event.key === 'PageUp') next = current + 30;
      else return false;

      event.preventDefault();
      beginScrub();
      input.value = String(clamp(next, 0, duration));
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }

    const min = Number(input.min || 0);
    const max = Number(input.max || 100);
    const step = Number(input.step || 1);
    const current = Number(input.value);
    let next = current;

    if (event.key === 'Home') next = min;
    else if (event.key === 'End') next = max;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = current - step;
    else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = current + step;
    else if (event.key === 'PageDown') next = current - step * 10;
    else if (event.key === 'PageUp') next = current + step * 10;
    else return false;

    event.preventDefault();
    input.value = String(clamp(next, min, max));
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  function scheduleTrackPositions() {
    window.cancelAnimationFrame(trackPositionFrame);
    trackPositionFrame = window.requestAnimationFrame(positionTrackNodes);
  }

  function positionTrackNodes() {
    if (!elements.stage || !elements.sceneImage || !elements.playlist) return;
    const image = elements.sceneImage;
    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;
    if (!naturalWidth || !naturalHeight) return;

    const stageRect = elements.stage.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    const boxWidth = image.clientWidth;
    const boxHeight = image.clientHeight;
    const scale = Math.max(boxWidth / naturalWidth, boxHeight / naturalHeight);
    const renderedWidth = naturalWidth * scale;
    const renderedHeight = naturalHeight * scale;
    const objectPosition = getComputedStyle(image).objectPosition.split(/\s+/);
    const positionX = parseObjectPosition(objectPosition[0]);
    const positionY = parseObjectPosition(objectPosition[1] || objectPosition[0]);
    const imageOffsetX = imageRect.left - stageRect.left + (boxWidth - renderedWidth) * positionX;
    const imageOffsetY = imageRect.top - stageRect.top + (boxHeight - renderedHeight) * positionY;
    const mobile = window.matchMedia('(max-width: 820px)').matches;

    elements.playlist.querySelectorAll('.track-item').forEach(item => {
      const pointX = Number(mobile ? item.dataset.mobileX : item.dataset.desktopX);
      const pointY = Number(mobile ? item.dataset.mobileY : item.dataset.desktopY);
      item.style.setProperty('--track-left', (imageOffsetX + renderedWidth * pointX / 100).toFixed(2) + 'px');
      item.style.setProperty('--track-top', (imageOffsetY + renderedHeight * pointY / 100).toFixed(2) + 'px');
    });
  }

  function parseObjectPosition(value) {
    if (!value) return 0.5;
    if (value === 'left' || value === 'top') return 0;
    if (value === 'right' || value === 'bottom') return 1;
    if (value === 'center') return 0.5;
    const numeric = parseFloat(value);
    return Number.isFinite(numeric) ? clamp(numeric / 100, 0, 1) : 0.5;
  }

  function bindAudioEvents() {
    siteAudio.addEventListener('loadedmetadata', () => {
      updateAudioDiagnostics();
      updateProgressBounds();
      const song = getCurrentTrack();
      if (song && (!song.duration || song.duration === '--:--') && Number.isFinite(siteAudio.duration) && siteAudio.duration > 0) {
        song.duration = formatTime(siteAudio.duration);
      }
      if (!intendedToPlay && playerState === 'loading') playerState = 'paused';
      renderPlayerState();
      updateProgress();
    });

    siteAudio.addEventListener('durationchange', () => {
      updateAudioDiagnostics();
      updateProgressBounds();
      const song = getCurrentTrack();
      if (song && (!song.duration || song.duration === '--:--') && Number.isFinite(siteAudio.duration) && siteAudio.duration > 0) {
        song.duration = formatTime(siteAudio.duration);
        renderTrackIndexState();
      }
      updateProgress();
    });

    siteAudio.addEventListener('canplay', () => {
      updateAudioDiagnostics();
      if (playerState === 'loading' && !intendedToPlay) {
        playerState = 'paused';
        renderPlayerState();
      }
    });

    siteAudio.addEventListener('playing', () => {
      updateAudioDiagnostics();
      if (!intendedToPlay) return;
      playerState = 'playing';
      listenedTrackIds.add(getCurrentTrack().id);
      renderPlayerState();
    });

    siteAudio.addEventListener('pause', () => {
      if (suppressPauseEvent) {
        suppressPauseEvent = false;
        return;
      }
      if (playerState === 'ended' || playerState === 'error') return;
      intendedToPlay = false;
      playerState = hasSelectedTrack ? 'paused' : 'idle';
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
      listenedTrackIds.add(getCurrentTrack().id);
      renderPlayerState();
    });

    siteAudio.addEventListener('error', () => {
      updateAudioDiagnostics();
      if (!hasSelectedTrack) return;
      playRequestToken += 1;
      intendedToPlay = false;
      playerState = 'error';
      document.body.dataset.musicErrorCode = siteAudio.error ? String(siteAudio.error.code) : 'unknown';
      document.body.dataset.musicErrorName = 'media-error';
      document.body.dataset.musicPlayResult = 'media-error';
      showInlineMessage('媒体加载失败（MediaError ' + (siteAudio.error ? siteAudio.error.code : 'unknown') + '）。');
      renderPlayerState();
      showErrorDialog(getCurrentTrack().src);
    });

    siteAudio.addEventListener('seeked', () => {
      if (pendingSeekTarget != null) {
        const actualTime = Number.isFinite(siteAudio.currentTime) ? siteAudio.currentTime : 0;
        const error = Math.abs(actualTime - pendingSeekTarget);
        document.body.dataset.musicSeekActual = String(actualTime);
        document.body.dataset.musicSeekError = String(error);
        if (error <= 1) {
          document.body.dataset.musicSeekResult = 'resolved';
          hideErrorMessage();
        } else {
          document.body.dataset.musicSeekResult = 'unsupported-by-server';
          showInlineMessage('当前静态服务器不支持音频区间定位；请使用支持 HTTP Range 的本地服务器。');
        }
      }
      pendingSeekTarget = null;
      updateProgress();
    });

    siteAudio.addEventListener('timeupdate', updateProgress);
  }

  function selectTrack(index) {
    if (!Number.isInteger(index) || !MUSIC_PLAYLIST[index]) return;
    if (hasSelectedTrack && index === currentTrackIndex) {
      triggerBloom(index);
      toggleTrack(index);
      return;
    }
    switchTrack(index, true);
  }

  function toggleTrack(index) {
    if (!Number.isInteger(index) || !MUSIC_PLAYLIST[index]) return;
    hasSelectedTrack = true;
    revealPlayer();
    revealNote();

    if (index !== currentTrackIndex) {
      switchTrack(index, true);
      return;
    }

    if (playerState === 'playing' || playerState === 'loading') {
      playRequestToken += 1;
      intendedToPlay = false;
      siteAudio.pause();
      playerState = 'paused';
      renderPlayerState();
      return;
    }

    if (playerState === 'ended' && Number.isFinite(siteAudio.duration)) siteAudio.currentTime = 0;
    playCurrentTrack();
  }

  function switchTrack(index, shouldPlay) {
    if (!Number.isInteger(index) || !MUSIC_PLAYLIST[index]) return;
    playRequestToken += 1;
    currentTrackIndex = index;
    hasSelectedTrack = true;
    intendedToPlay = shouldPlay;
    delete document.body.dataset.musicErrorCode;
    delete document.body.dataset.musicErrorName;
    hideErrorMessage();
    revealPlayer();
    revealNote();
    resetProgress();
    ensureTrackSource(true);
    playerState = shouldPlay ? 'loading' : 'paused';
    renderPlayerState();
    moveNoteToCurrentTrack();
    triggerBloom(index);

    if (shouldPlay) {
      playCurrentTrack();
    } else {
      suppressPauseEvent = true;
      siteAudio.pause();
    }
  }

  function playCurrentTrack() {
    ensureTrackSource(false);
    const token = ++playRequestToken;
    intendedToPlay = true;
    playerState = 'loading';
    document.body.dataset.musicPlayCalls = String((Number(document.body.dataset.musicPlayCalls) || 0) + 1);
    document.body.dataset.musicPlayResult = 'pending';
    document.body.dataset.musicPlaySrc = new URL(getCurrentTrack().src, window.location.href).href;
    delete document.body.dataset.musicPlayError;
    renderPlayerState();

    let playPromise;
    try {
      playPromise = siteAudio.play();
    } catch (error) {
      handlePlayFailure(error, token);
      return;
    }

    Promise.resolve(playPromise).then(() => {
      if (token !== playRequestToken) return;
      delete document.body.dataset.musicErrorCode;
      delete document.body.dataset.musicErrorName;
      document.body.dataset.musicPlayResult = 'resolved';
      playerState = 'playing';
      listenedTrackIds.add(getCurrentTrack().id);
      renderPlayerState();
    }).catch(error => handlePlayFailure(error, token));
  }

  function handlePlayFailure(error, token) {
    if (token !== playRequestToken) return;
    const errorName = error && error.name ? error.name : 'PlayError';
    const errorMessage = error && error.message ? error.message : '浏览器未提供错误详情';
    intendedToPlay = false;
    document.body.dataset.musicErrorCode = siteAudio.error ? String(siteAudio.error.code) : 'play-rejected';
    document.body.dataset.musicErrorName = errorName;
    document.body.dataset.musicPlayResult = 'rejected';
    document.body.dataset.musicPlayError = errorName + ': ' + errorMessage;
    showInlineMessage('播放失败（' + errorName + '）：' + errorMessage);
    playerState = errorName === 'NotAllowedError' ? 'paused' : 'error';
    renderPlayerState();
    if (errorName !== 'NotAllowedError') showErrorDialog(getCurrentTrack().src);
  }

  function ensureTrackSource(forceLoad) {
    const song = getCurrentTrack();
    if (!song || !song.src) return;
    const expectedUrl = new URL(song.src, window.location.href).href;
    const sourceChanged = siteAudio.currentSrc !== expectedUrl && siteAudio.src !== expectedUrl;
    if (!sourceChanged && !forceLoad) return;

    if (!siteAudio.paused) {
      suppressPauseEvent = true;
      siteAudio.pause();
    }
    if (sourceChanged) siteAudio.src = song.src;
    siteAudio.load();
    updateAudioDiagnostics();
  }

  function renderPlayerState() {
    const song = getCurrentTrack();
    const status = stateText[hasSelectedTrack ? playerState : 'idle'];
    const isPlaying = hasSelectedTrack && playerState === 'playing';
    const isBusy = hasSelectedTrack && playerState === 'loading';

    setText(elements.currentIndex, hasSelectedTrack ? song.branch : '未启');
    setText(elements.currentTitle, hasSelectedTrack ? song.title : '静待选曲');
    setText(elements.currentOriginal, hasSelectedTrack ? (song.originalTitle || song.fileName) : '选择一朵梅花');
    setText(elements.currentMeta, hasSelectedTrack ? song.artist + ' · ' + getDurationText(song) : '本地音乐 · --:--');
    setText(elements.currentStatus, status);
    setText(elements.currentCopy, hasSelectedTrack ? song.note : '月下微灯未启，先让雪声落满枝头。');
    setText(elements.atmosphere, atmosphereText[hasSelectedTrack ? playerState : 'idle']);
    setText(elements.playbarTitle, hasSelectedTrack ? song.title : '静待选曲');
    setText(elements.playbarArtist, hasSelectedTrack ? song.originalTitle + ' · ' + song.artist : '本地音乐');
    setText(elements.playerState, status);
    setText(elements.totalTime, getDurationText(song));

    if (elements.playBtn) {
      elements.playBtn.innerHTML = isPlaying ? pauseIcon() : (isBusy ? loadingIcon() : playIcon());
      elements.playBtn.classList.toggle('is-loading', isBusy);
      elements.playBtn.setAttribute('aria-label', isPlaying ? '暂停当前歌曲' : (isBusy ? '歌曲加载中' : '播放当前歌曲'));
    }

    renderSceneState();
    renderPlaylistState();
    renderTrackIndexState();
    if (hasSelectedTrack) scheduleNotePosition();
  }

  function renderSceneState() {
    document.body.classList.toggle('music-has-selection', hasSelectedTrack);
    document.body.classList.toggle('music-is-playing', hasSelectedTrack && playerState === 'playing');
    document.body.dataset.musicPlayerState = hasSelectedTrack ? playerState : 'idle';
    if (elements.stage) {
      elements.stage.dataset.currentTrack = hasSelectedTrack ? String(currentTrackIndex) : '';
      elements.stage.dataset.playerState = hasSelectedTrack ? playerState : 'idle';
    }
  }

  function renderPlaylistState() {
    if (!elements.playlist) return;
    elements.playlist.querySelectorAll('.track-item').forEach((item, index) => {
      const button = item.querySelector('.track-select');
      const stateLabel = item.querySelector('.track-state-text');
      const song = MUSIC_PLAYLIST[index];
      const active = hasSelectedTrack && index === currentTrackIndex;
      const listened = listenedTrackIds.has(song.id);

      item.classList.toggle('is-current', active);
      item.classList.toggle('is-playing', active && playerState === 'playing');
      item.classList.toggle('is-paused', active && playerState === 'paused');
      item.classList.toggle('is-loading', active && playerState === 'loading');
      item.classList.toggle('is-ended', active && playerState === 'ended');
      item.classList.toggle('is-error', active && playerState === 'error');
      item.classList.toggle('is-listened', listened);
      if (stateLabel) stateLabel.textContent = active ? stateText[playerState] : (listened ? '已听过' : '待启封');
      if (button) {
        button.setAttribute('aria-current', active ? 'true' : 'false');
        button.setAttribute('aria-label', (active && playerState === 'playing' ? '暂停 ' : '播放 ') + song.title);
      }
    });
  }

  function triggerBloom(index) {
    if (!elements.playlist) return;
    const item = elements.playlist.querySelector('.track-item[data-index="' + index + '"]');
    if (!item) return;
    const previousTimer = bloomTimers.get(index);
    if (previousTimer) window.clearTimeout(previousTimer);
    item.classList.remove('is-blooming');
    void item.offsetWidth;
    item.classList.add('is-blooming');
    const timer = window.setTimeout(() => {
      item.classList.remove('is-blooming');
      bloomTimers.delete(index);
    }, prefersReducedMotion() ? 0 : 1050);
    bloomTimers.set(index, timer);
  }

  function renderTrackIndexState() {
    if (!elements.trackIndex) return;
    elements.trackIndex.querySelectorAll('.music-index-item').forEach((item, index) => {
      const button = item.querySelector('.music-index-select');
      const duration = item.querySelector('.music-index-duration');
      const active = hasSelectedTrack && index === currentTrackIndex;
      const listened = listenedTrackIds.has(MUSIC_PLAYLIST[index].id);
      item.classList.toggle('is-current', active);
      item.classList.toggle('is-playing', active && playerState === 'playing');
      item.classList.toggle('is-listened', listened);
      if (button) button.setAttribute('aria-current', active ? 'true' : 'false');
      if (duration) duration.textContent = getDurationText(MUSIC_PLAYLIST[index]);
    });
  }

  function revealPlayer() {
    if (!elements.playbar) return;
    elements.playbar.classList.remove('is-awaiting-selection');
    elements.playbar.classList.add('is-revealed');
    elements.playbar.dataset.revealed = 'true';
  }

  function revealNote() {
    if (!elements.note) return;
    elements.note.hidden = false;
    elements.note.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => elements.note.classList.add('is-visible'));
  }

  function moveNoteToCurrentTrack() {
    if (!elements.note || !hasSelectedTrack) return;
    window.clearTimeout(noteMoveTimer);
    if (prefersReducedMotion() || !elements.note.classList.contains('is-visible')) {
      positionNoteNearTrack();
      elements.note.classList.add('is-visible');
      return;
    }

    elements.note.classList.add('is-moving');
    noteMoveTimer = window.setTimeout(() => {
      positionNoteNearTrack();
      requestAnimationFrame(() => elements.note.classList.remove('is-moving'));
    }, 150);
  }

  function scheduleNotePosition() {
    if (!hasSelectedTrack || !elements.note || elements.note.hidden) return;
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(positionNoteNearTrack);
  }

  function positionNoteNearTrack() {
    if (!elements.stage || !elements.note || !elements.playlist || window.innerWidth <= 820) {
      if (elements.note) {
        elements.note.style.removeProperty('--note-x');
        elements.note.style.removeProperty('--note-y');
      }
      return;
    }

    const activeButton = elements.playlist.querySelector('.track-item.is-current .track-select');
    if (!activeButton) return;

    const stageRect = elements.stage.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();
    const noteWidth = elements.note.offsetWidth;
    const noteHeight = elements.note.offsetHeight;
    const safe = 14;
    const gap = 18;
    const node = {
      left: buttonRect.left - stageRect.left,
      right: buttonRect.right - stageRect.left,
      top: buttonRect.top - stageRect.top,
      bottom: buttonRect.bottom - stageRect.top,
      cx: buttonRect.left - stageRect.left + buttonRect.width / 2,
      cy: buttonRect.top - stageRect.top + buttonRect.height / 2
    };
    const preferLeft = node.cx > stageRect.width * 0.62;
    const candidates = preferLeft ? [
      { x: node.left - noteWidth - gap, y: node.cy - noteHeight * 0.34 },
      { x: node.right + gap, y: node.cy - noteHeight * 0.34 },
      { x: node.cx - noteWidth / 2, y: node.bottom + gap },
      { x: node.cx - noteWidth / 2, y: node.top - noteHeight - gap }
    ] : [
      { x: node.right + gap, y: node.cy - noteHeight * 0.34 },
      { x: node.left - noteWidth - gap, y: node.cy - noteHeight * 0.34 },
      { x: node.cx - noteWidth / 2, y: node.bottom + gap },
      { x: node.cx - noteWidth / 2, y: node.top - noteHeight - gap }
    ];

    const blockers = [elements.playbar, elements.heading];
    if (elements.indexPanel && !elements.indexPanel.hidden) blockers.push(elements.indexPanel);
    const blockerRects = blockers.filter(Boolean).map(element => {
      const rect = element.getBoundingClientRect();
      return {
        x: rect.left - stageRect.left - 8,
        y: rect.top - stageRect.top - 8,
        width: rect.width + 16,
        height: rect.height + 16
      };
    });

    const fits = candidate => (
      candidate.x >= safe &&
      candidate.y >= safe &&
      candidate.x + noteWidth <= stageRect.width - safe &&
      candidate.y + noteHeight <= stageRect.height - safe
    );
    const clear = candidate => !blockerRects.some(rect => rectanglesOverlap(
      { x: candidate.x, y: candidate.y, width: noteWidth, height: noteHeight },
      rect
    ));

    let selected = candidates.find(candidate => fits(candidate) && clear(candidate));
    if (!selected) selected = candidates.find(fits) || candidates[0];
    const x = clamp(selected.x, safe, stageRect.width - noteWidth - safe);
    const y = clamp(selected.y, safe, stageRect.height - noteHeight - safe);
    elements.note.style.setProperty('--note-x', Math.round(x) + 'px');
    elements.note.style.setProperty('--note-y', Math.round(y) + 'px');
  }

  function rectanglesOverlap(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  }

  function setIndexOpen(open) {
    if (!elements.indexToggle || !elements.indexPanel || !elements.indexDrawer) return;
    elements.indexToggle.setAttribute('aria-expanded', String(open));
    elements.indexPanel.hidden = !open;
    elements.indexDrawer.classList.toggle('is-open', open);
    scheduleNotePosition();
  }

  function setVolumeOpen(open) {
    if (!elements.volumeToggle || !elements.volumePanel) return;
    elements.volumeToggle.setAttribute('aria-expanded', String(open));
    elements.volumeToggle.setAttribute('aria-label', open ? '收起音量控制' : '展开音量控制');
    elements.volumePanel.hidden = !open;
  }

  function updateProgress() {
    if (!siteAudio || isScrubbing) return;
    const duration = Number.isFinite(siteAudio.duration) ? siteAudio.duration : 0;
    const actualTime = Number.isFinite(siteAudio.currentTime) ? siteAudio.currentTime : 0;
    const current = pendingSeekTarget == null ? actualTime : clamp(pendingSeekTarget, 0, duration || pendingSeekTarget);
    if (elements.progress) {
      elements.progress.value = String(current);
      elements.progress.setAttribute('aria-valuetext', formatTime(current) + ' / ' + getDurationText(getCurrentTrack()));
    }
    setText(elements.currentTime, formatTime(current));
    setText(elements.totalTime, getDurationText(getCurrentTrack()));
  }

  function updateProgressPreview(value) {
    const duration = Number.isFinite(siteAudio.duration) ? siteAudio.duration : 0;
    const previewTime = duration > 0 ? clamp(value, 0, duration) : 0;
    setText(elements.currentTime, formatTime(previewTime));
    if (elements.progress) {
      elements.progress.setAttribute('aria-valuetext', formatTime(previewTime) + ' / ' + getDurationText(getCurrentTrack()));
    }
  }

  function beginScrub() {
    if (isScrubbing) return;
    isScrubbing = true;
    wasPlayingBeforeScrub = !siteAudio.paused && playerState !== 'ended';
    pendingSeekTarget = null;
  }

  function updateScrubFromPointer(event) {
    if (!elements.progress) return;
    const duration = Number.isFinite(siteAudio.duration) ? siteAudio.duration : 0;
    if (duration <= 0) return;
    const rect = elements.progress.getBoundingClientRect();
    const ratio = rect.width > 0 ? clamp((event.clientX - rect.left) / rect.width, 0, 1) : 0;
    elements.progress.value = String(ratio * duration);
    elements.progress.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function commitScrub(value) {
    const duration = Number.isFinite(siteAudio.duration) ? siteAudio.duration : 0;
    const targetTime = duration > 0 && Number.isFinite(value) ? clamp(value, 0, duration) : null;
    const shouldResume = wasPlayingBeforeScrub;
    isScrubbing = false;
    wasPlayingBeforeScrub = false;
    if (targetTime == null) {
      pendingSeekTarget = null;
      updateProgress();
      return;
    }

    pendingSeekTarget = targetTime;
    document.body.dataset.musicSeekTarget = String(targetTime);
    document.body.dataset.musicSeekResult = 'pending';
    delete document.body.dataset.musicSeekActual;
    delete document.body.dataset.musicSeekError;
    if (elements.progress) {
      elements.progress.value = String(targetTime);
      elements.progress.setAttribute('aria-valuetext', formatTime(targetTime) + ' / ' + getDurationText(getCurrentTrack()));
    }
    setText(elements.currentTime, formatTime(targetTime));
    setText(elements.totalTime, getDurationText(getCurrentTrack()));
    siteAudio.currentTime = targetTime;

    if (shouldResume && siteAudio.paused && !siteAudio.ended) {
      intendedToPlay = true;
      Promise.resolve(siteAudio.play()).catch(error => {
        const errorName = error && error.name ? error.name : 'PlayError';
        const errorMessage = error && error.message ? error.message : '浏览器未提供错误详情';
        showInlineMessage('定位后继续播放失败（' + errorName + '）：' + errorMessage);
      });
    }
  }

  function updateProgressBounds() {
    if (!elements.progress) return;
    const duration = Number.isFinite(siteAudio.duration) && siteAudio.duration > 0 ? siteAudio.duration : 0;
    elements.progress.min = '0';
    elements.progress.max = String(duration);
    elements.progress.step = '0.01';
  }

  function resetProgress() {
    isScrubbing = false;
    wasPlayingBeforeScrub = false;
    activeScrubPointerId = null;
    pendingSeekTarget = null;
    if (elements.progress) {
      elements.progress.value = '0';
      elements.progress.max = '0';
      elements.progress.step = '0.01';
      elements.progress.setAttribute('aria-valuetext', '00:00 / ' + getDurationText(getCurrentTrack()));
    }
    setText(elements.currentTime, '00:00');
    setText(elements.totalTime, getDurationText(getCurrentTrack()));
  }

  function restoreVolume() {
    if (!elements.volume) return;
    const saved = Number(localStorage.getItem('liuyuexueMusicVolume'));
    const volume = Number.isFinite(saved) && saved >= 0 && saved <= 1 ? saved : 0.6;
    elements.volume.value = String(volume);
    siteAudio.volume = volume;
    siteAudio.muted = volume === 0;
    renderVolumeText(volume);
  }

  function renderVolumeText(value) {
    if (!elements.volume) return;
    const percent = Math.round(clamp(value, 0, 1) * 100);
    elements.volume.setAttribute('aria-valuetext', value === 0 ? '静音' : '音量 ' + percent + '%');
  }

  function updateReducedMotionState() {
    document.body.dataset.reducedMotion = prefersReducedMotion() ? 'reduce' : 'no-preference';
  }

  function updateAudioDiagnostics() {
    document.body.dataset.musicAudioReadyState = String(siteAudio.readyState);
    document.body.dataset.musicAudioNetworkState = String(siteAudio.networkState);
    document.body.dataset.musicAudioSrc = siteAudio.currentSrc || siteAudio.src || '';
  }

  function prefersReducedMotion() {
    return reducedMotionQuery.matches;
  }

  function showErrorDialog(filePath) {
    lastDialogFocus = document.activeElement;
    setText(elements.dialogPath, filePath || '未知路径');
    if (!elements.dialog) return;
    elements.dialog.classList.add('show');
    elements.dialog.setAttribute('aria-hidden', 'false');
    if (elements.dialogClose) elements.dialogClose.focus();
  }

  function hideErrorDialog() {
    if (!elements.dialog) return;
    elements.dialog.classList.remove('show');
    elements.dialog.setAttribute('aria-hidden', 'true');
    if (lastDialogFocus && typeof lastDialogFocus.focus === 'function') lastDialogFocus.focus();
  }

  function hideErrorMessage() {
    if (!elements.errorMessage) return;
    elements.errorMessage.hidden = true;
    elements.errorMessage.textContent = '';
  }

  function showInlineMessage(message) {
    if (!elements.errorMessage) return;
    elements.errorMessage.textContent = message;
    elements.errorMessage.hidden = false;
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
    const remaining = Math.floor(seconds % 60);
    return String(minutes).padStart(2, '0') + ':' + String(remaining).padStart(2, '0');
  }

  function formatTitleFromPath(path) {
    return getFileName(path).replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
  }

  function getFileName(path) {
    return String(path || '').split('/').pop() || '本地曲目';
  }

  function getPlumCopy(song, index) {
    return plumTrackCopy[song.id] || {
      title: String(index + 1) + '枝雪：' + (song.title || '未名清音'),
      branch: String(index + 1) + '枝雪',
      note: '雪声沿着枝影慢慢落下。'
    };
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
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
