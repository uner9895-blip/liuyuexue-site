/**
 * 六月雪个人网页 - “听雪小筑”独立音乐页控制逻辑
 */

const PLAYLIST = (window.musicTracks && window.musicTracks.length ? window.musicTracks : [
  {
    id: 'ecoute-cherie',
    title: 'Ecoute Cherie',
    artist: '本地音乐',
    src: 'assets/audio/ecoute-cherie.mp3',
    tag: '雪音',
    duration: '本地'
  },
  {
    id: 'fallin-out',
    title: 'Fallin Out',
    artist: '本地音乐',
    src: 'assets/audio/fallin-out.mp3',
    tag: '风音',
    duration: '本地'
  },
  {
    id: 'hong-san-ke-zhan',
    title: '红伞客栈',
    artist: '本地音乐',
    src: 'assets/audio/hong-san-ke-zhan.mp3',
    tag: '伞音',
    duration: '本地'
  },
  {
    id: 'ji-mo-ji-mo-bu-hao',
    title: '寂寞寂寞不好',
    artist: '本地音乐',
    src: 'assets/audio/ji-mo-ji-mo-bu-hao.mp3',
    tag: '夜音',
    duration: '本地'
  },
  {
    id: 'lan-ting-xu',
    title: '兰亭序',
    artist: '本地音乐',
    src: 'assets/audio/lan-ting-xu.mp3',
    tag: '墨音',
    duration: '本地'
  },
  {
    id: 'lian-ren',
    title: '恋人',
    artist: '本地音乐',
    src: 'assets/audio/lian-ren.mp3',
    tag: '梅音',
    duration: '本地'
  },
  {
    id: 'yin-tian',
    title: '阴天',
    artist: '本地音乐',
    src: 'assets/audio/yin-tian.mp3',
    tag: '雨音',
    duration: '本地'
  }
]).map((song, index) => ({
  id: song.id || index + 1,
  title: song.title || '本地曲目',
  artist: song.artist || '本地音乐',
  src: song.src || 'assets/audio/ecoute-cherie.mp3',
  tag: song.tag || '雪音',
  duration: song.duration || '本地'
}));

let currentIndex = 0;
let isPlaying = false;
let audio = null;

document.addEventListener('DOMContentLoaded', () => {
  initAudioElement();
  renderPlaylist();
  initPlayerControls();
  initDialogEvents();
});

/**
 * 确保全局唯一的 Audio 标签
 */
function initAudioElement() {
  audio = document.getElementById('global-audio');
  if (!audio) {
    audio = document.createElement('audio');
    audio.id = 'global-audio';
    audio.preload = 'metadata';
    document.body.appendChild(audio);
  } else {
    audio.preload = 'metadata';
  }
  
  // 绑定原生错误监听，捕获媒体加载失败
  audio.addEventListener('error', (e) => {
    // 仅在尝试播放时，若加载失败才弹窗，防止一进页面因为 src 为空报错
    if (isPlaying && audio.src) {
      console.log('音频文件未找到，请检查 ' + PLAYLIST[currentIndex].src, e);
      showAudioErrorDialog(PLAYLIST[currentIndex].src);
      pausePlayer();
    }
  });

  // 播放结束自动下一曲
  audio.addEventListener('ended', () => {
    nextSong();
  });
}

/**
 * 渲染歌单卡片列表
 */
function renderPlaylist() {
  const container = document.getElementById('playlist-container');
  if (!container) return;

  container.innerHTML = PLAYLIST.map((song, index) => {
    // 白天/夜晚根据不同歌曲产生不同的中式首字，如“雪”、“雨”、“琴”、“禅”
    const coverChar = song.tag[1] || '音';
    return `
      <div class="song-card scroll-reveal" data-index="${index}" tabindex="0">
        <div class="song-card-cover">${coverChar}</div>
        <div class="song-card-info">
          <h3 class="song-card-title">${song.title}</h3>
          <span class="song-card-artist">${song.artist}</span>
        </div>
        <span class="song-card-tag">${song.tag}</span>
        <div class="song-play-status">
          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </div>
      </div>
    `;
  }).join('');

  // 绑定点击事件
  const cards = container.querySelectorAll('.song-card');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      const idx = parseInt(card.getAttribute('data-index'));
      selectAndPlay(idx, e);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const idx = parseInt(card.getAttribute('data-index'));
        selectAndPlay(idx, e);
      }
    });
  });

  updateActiveCard();
}

/**
 * 更新歌单卡片激活高亮
 */
function updateActiveCard() {
  const cards = document.querySelectorAll('#playlist-container .song-card');
  cards.forEach((card, idx) => {
    if (idx === currentIndex) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
}

/**
 * 选择并播放
 */
function selectAndPlay(index, event) {
  if (index === currentIndex && isPlaying) {
    // 如果点击的是当前正在播放的，则暂停
    pausePlayer();
    return;
  }
  
  currentIndex = index;
  updateActiveCard();
  loadCurrentSong();
  playPlayer(event);
}

/**
 * 加载当前索引的歌曲
 */
function loadCurrentSong() {
  const song = PLAYLIST[currentIndex];
  audio.src = song.src;
  
  // 更新播放栏 UI
  const barTitle = document.getElementById('playbar-title');
  const barArtist = document.getElementById('playbar-artist');
  if (barTitle) barTitle.textContent = song.title;
  if (barArtist) barArtist.textContent = song.artist;
  
  // 重置进度条
  const progressBar = document.getElementById('playbar-progress');
  const curTimeText = document.getElementById('playbar-current-time');
  const totalTimeText = document.getElementById('playbar-total-time');
  
  if (progressBar) progressBar.value = 0;
  if (curTimeText) curTimeText.textContent = '00:00';
  if (totalTimeText) totalTimeText.textContent = song.duration;
}

/**
 * 播放
 */
function playPlayer(event) {
  if (!audio.src) {
    loadCurrentSong();
  }

  isPlaying = true;
  updatePlayButtonUI(true);

  audio.play().catch(err => {
    console.log('音频播放失败，请检查浏览器权限或文件路径 ' + PLAYLIST[currentIndex].src, err);
    showAudioErrorDialog(PLAYLIST[currentIndex].src);
    pausePlayer();
  });
}

/**
 * 暂停
 */
function pausePlayer() {
  isPlaying = false;
  audio.pause();
  updatePlayButtonUI(false);
}

/**
 * 上一首
 */
function prevSong() {
  currentIndex = (currentIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
  updateActiveCard();
  loadCurrentSong();
  playPlayer();
}

/**
 * 下一首
 */
function nextSong() {
  currentIndex = (currentIndex + 1) % PLAYLIST.length;
  updateActiveCard();
  loadCurrentSong();
  playPlayer();
}

/**
 * 更新播放/暂停按钮图标
 */
function updatePlayButtonUI(playing) {
  const playBtn = document.getElementById('playbar-play-btn');
  if (!playBtn) return;

  const playIcon = `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
  const pauseIcon = `<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

  if (playing) {
    playBtn.innerHTML = pauseIcon;
    playBtn.setAttribute('aria-label', '暂停');
  } else {
    playBtn.innerHTML = playIcon;
    playBtn.setAttribute('aria-label', '播放');
  }

  // 同步更新列表中对应卡片的状态图标
  const activeCard = document.querySelector('#playlist-container .song-card.active');
  if (activeCard) {
    const statusIcon = activeCard.querySelector('.song-play-status');
    if (statusIcon) {
      statusIcon.innerHTML = playing ? pauseIcon : playIcon;
    }
  }

  // 重置其他非 active 卡片的状态图标为播放图标
  const inactiveCards = document.querySelectorAll('#playlist-container .song-card:not(.active)');
  inactiveCards.forEach(card => {
    const statusIcon = card.querySelector('.song-play-status');
    if (statusIcon) {
      statusIcon.innerHTML = playIcon;
    }
  });
}

/**
 * 播放器控制栏交互逻辑
 */
function initPlayerControls() {
  const playBtn = document.getElementById('playbar-play-btn');
  const prevBtn = document.getElementById('playbar-prev-btn');
  const nextBtn = document.getElementById('playbar-next-btn');
  const progressBar = document.getElementById('playbar-progress');
  const volumeSlider = document.getElementById('playbar-volume');
  
  const curTimeText = document.getElementById('playbar-current-time');
  const totalTimeText = document.getElementById('playbar-total-time');

  // 播放暂停
  if (playBtn) {
    playBtn.addEventListener('click', (e) => {
      if (isPlaying) {
        pausePlayer();
      } else {
        playPlayer(e);
      }
    });
  }

  // 上下首
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      prevSong();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      nextSong();
    });
  }

  // 声音滑块
  if (volumeSlider) {
    // 初始音量同步
    audio.volume = volumeSlider.value;
    volumeSlider.addEventListener('input', (e) => {
      audio.volume = e.target.value;
    });
  }

  // 进度时间更新
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    
    // 更新进度条的值
    const percent = (audio.currentTime / audio.duration) * 100;
    if (progressBar) progressBar.value = percent;
    
    // 更新当前时间文本
    if (curTimeText) {
      curTimeText.textContent = formatTime(audio.currentTime);
    }
  });

  // 加载元数据时更新总时间
  audio.addEventListener('loadedmetadata', () => {
    if (totalTimeText) {
      totalTimeText.textContent = formatTime(audio.duration);
    }
  });

  // 拖动进度条
  if (progressBar) {
    progressBar.addEventListener('input', (e) => {
      if (!audio.duration) return;
      const newTime = (e.target.value / 100) * audio.duration;
      audio.currentTime = newTime;
    });
  }

  // 默认加载第一首，但不起播
  loadCurrentSong();
}

/**
 * 格式化时间 00:00
 */
function formatTime(seconds) {
  if (isNaN(seconds)) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * 弹出自定义中式警告弹窗
 */
function showAudioErrorDialog(filePath) {
  const dialog = document.getElementById('music-error-dialog');
  const pathCode = document.getElementById('dialog-file-path');
  if (dialog && pathCode) {
    pathCode.textContent = filePath;
    dialog.classList.add('show');
  }
}

/**
 * 弹窗事件绑定
 */
function initDialogEvents() {
  const dialog = document.getElementById('music-error-dialog');
  const closeBtn = document.getElementById('dialog-close-btn');

  if (!dialog || !closeBtn) return;

  const hideDialog = () => {
    dialog.classList.remove('show');
  };

  closeBtn.addEventListener('click', hideDialog);
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      hideDialog();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dialog.classList.contains('show')) {
      hideDialog();
    }
  });
}
