/**
 * 六月雪个人网页 - 静态站基础交互与特效系统
 */

function initAll() {
  initMobileMenu();
  initContactForm();
  initActiveNavLink();
  initScrollReveal();
  initSkillExplanations();
  initBackToTop();
  initThemeToggle();
  initMusicWidget();
  initDomPlumTrail();
  initInkRipples();
  initSnowLettersPage();
  initHomeLatestSnowLetters();
  initLightParallax();
}

const musicTracks = [
  {
    id: 'qingtian',
    title: '晴天',
    artist: '本地音乐',
    src: 'assets/audio/qingtian.mp3',
    tag: '晴音',
    duration: '本地'
  }
];

window.musicTracks = musicTracks;

const snowLetterPosts = [
  {
    id: 'why-personal-site',
    title: '我为什么开始做这个个人网页',
    category: '项目',
    date: '2026.01.01',
    readTime: '3 分钟',
    excerpt: '从一个空白页面开始，我想给自己搭一个安静的小角落。',
    content: '这是我第一次认真做一个完整的个人网页。它不只是一个展示名字和作品的地方，也像一个可以慢慢记录学习过程的小房间。我希望这里能放下我的前端练习、网页作品、一些风景照片，也放下一些还没有完全想明白的话。'
  },
  {
    id: 'first-web-music',
    title: '第一次让音乐在网页里响起来',
    category: '学习',
    date: '2026.01.02',
    readTime: '2 分钟',
    excerpt: '音乐按钮看起来很小，但里面藏着浏览器限制和交互逻辑。',
    content: '给网页加音乐以后，我才发现浏览器并不总是允许页面自动播放声音。后来我把音乐改成需要点击按钮后播放，这样在电脑和手机上都更稳定。一个小小的按钮，也让我明白网页交互需要尊重用户的操作。'
  },
  {
    id: 'ink-background-thoughts',
    title: '关于中式水墨网页背景的一点想法',
    category: '灵感',
    date: '2026.01.03',
    readTime: '4 分钟',
    excerpt: '水墨风不是简单放一张图，而是留白、层次、墨色和呼吸感。',
    content: '我想要的中式网页背景，不应该只是铺一张模糊图片。它应该像一张慢慢展开的纸：有淡淡的纸纹，有远山一样的墨影，有很轻的水波线，也有恰到好处的留白。背景不应该抢走文字，而应该让文字像落在纸面上一样安静。'
  },
  {
    id: 'words-to-future-self',
    title: '给未来自己的几句话',
    category: '随笔',
    date: '2026.01.04',
    readTime: '2 分钟',
    excerpt: '慢一点也没关系，重要的是一直在走。',
    content: '如果以后再看到这个网页，希望我还能记得现在一点点搭建它的心情。也许那时候我已经学会了更多技术，也许这个网站已经变了很多样子。但我希望它仍然保留一点安静，一点认真，还有一点属于自己的温度。'
  },
  {
    id: 'first-road-of-front-end',
    title: 'HTML、CSS 和 JavaScript 的第一段路',
    category: '学习',
    date: '2026.01.05',
    readTime: '3 分钟',
    excerpt: '网页不是一下子完成的，它是一层一层搭起来的。',
    content: 'HTML 像骨架，CSS 像衣服和气质，JavaScript 则让页面开始回应人的动作。刚开始学的时候，每一部分都很零散，但当它们组合到一个完整页面里，我才真正感觉到前端开发的乐趣。'
  }
];

window.snowLetterPosts = snowLetterPosts;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

/**
 * 移动端导航交互
 */
function initMobileMenu() {
  const burgerBtn = document.querySelector('.burger-btn');
  const navMenu = document.querySelector('.nav-menu');

  if (!burgerBtn || !navMenu) return;

  const openMenu = () => {
    burgerBtn.classList.add('active');
    navMenu.classList.add('active');
    burgerBtn.setAttribute('aria-expanded', 'true');
    burgerBtn.setAttribute('aria-label', '关闭导航菜单');
    document.body.classList.add('menu-open');
  };

  const closeMenu = () => {
    burgerBtn.classList.remove('active');
    navMenu.classList.remove('active');
    burgerBtn.setAttribute('aria-expanded', 'false');
    burgerBtn.setAttribute('aria-label', '打开导航菜单');
    document.body.classList.remove('menu-open');
  };

  burgerBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    if (navMenu.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (event) => {
    if (!navMenu.classList.contains('active')) return;
    if (!navMenu.contains(event.target) && !burgerBtn.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });
}

/**
 * 静态联系人表单模拟提交
 */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('form-name')?.value.trim() || '';
    const email = document.getElementById('form-email')?.value.trim() || '';
    const message = document.getElementById('form-message')?.value.trim() || '';

    if (!name || !email || !message) {
      showToast('请填写完整后再提交');
      return;
    }

    showToast('已模拟提交，当前静态站暂不支持真实发送。');
    contactForm.reset();
  });
}

function showToast(message) {
  let toast = document.querySelector('.toast-notice');

  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/**
 * 导航菜单高亮
 */
function initActiveNavLink() {
  let currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPage === '/' || currentPage === '') {
    currentPage = 'index.html';
  }

  document.querySelectorAll('.nav-item').forEach((item) => {
    const link = item.querySelector('a');
    if (!link) return;

    const href = link.getAttribute('href');
    const isActive = href === currentPage;

    item.classList.toggle('active', isActive);

    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

/**
 * 滚动渐现观察器
 */
function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }

  const revealElements = document.querySelectorAll('.scroll-reveal');
  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(el => {
    observer.observe(el);
  });
}

/**
 * 技能标签点击互动释义
 */
const SKILL_EXPLANATIONS = {
  'HTML': '超文本标记语言。网页的骨骼与墨线，我遵循语义化原则，力求结构清晰、无障碍友好。',
  'CSS': '层叠样式表。网页的设色与笔触，在此用于实践中式留白、淡雅色调及响应式布局。',
  'JavaScript': '网页的生命力。使用原生 JS 实现轻量且无依赖的动画与交互，关注性能。',
  '响应式布局': '随器赋形。确保网站从 320px 手机屏到 2K 显示器都能如卷轴般完美舒展。',
  'GitHub Pages': '行止留痕。将静态代码一键托管，是我的第一个线上发布与版本管理实践。',
  '个人网页设计': '以画入网。探索传统水墨美学在现代数字媒介中的体现，讲究克制与留白。'
};

function initSkillExplanations() {
  const skillTags = document.querySelectorAll('.skill-tag');

  skillTags.forEach(tag => {
    const skillName = tag.textContent.trim();
    const explanation = SKILL_EXPLANATIONS[skillName];
    if (!explanation) return;

    const showExplanation = (e) => {
      e.stopPropagation();

      // 关闭其他提示气泡
      document.querySelectorAll('.skill-tooltip').forEach(tip => {
        tip.classList.remove('show');
      });

      let tooltip = tag.querySelector('.skill-tooltip');
      if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'skill-tooltip';
        tooltip.textContent = explanation;
        tag.appendChild(tooltip);

        // 强制重绘
        tooltip.offsetHeight;
      }

      tooltip.classList.add('show');

      clearTimeout(tag.tooltipTimeout);
      tag.tooltipTimeout = setTimeout(() => {
        tooltip.classList.remove('show');
      }, 3500);
    };

    tag.addEventListener('click', showExplanation);
    tag.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showExplanation(e);
      }
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.skill-tooltip').forEach(tip => {
      tip.classList.remove('show');
    });
  });
}

/**
 * 返回顶部按钮
 */
function initBackToTop() {
  const btn = document.createElement('div');
  btn.className = 'back-to-top';
  btn.id = 'back-to-top';
  btn.setAttribute('role', 'button');
  btn.setAttribute('aria-label', '返回顶部');
  btn.setAttribute('tabindex', '0');
  btn.innerHTML = `<svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  const scrollBack = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  btn.addEventListener('click', scrollBack);
}

/**
 * 1. 白天/夜晚模式切换状态控制
 */
function initThemeToggle() {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  if (toggleBtns.length === 0) return;

  const getTheme = () => {
    return document.documentElement.getAttribute('data-theme') || document.documentElement.dataset.theme || 'light';
  };

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  };

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const nextTheme = getTheme() === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    });
  });
}

/**
 * 2. 听雪小筑音乐挂件播放逻辑
 */
function initMusicWidget() {
  const pendant = document.querySelector('.music-pendant');
  const card = document.querySelector('.music-card');
  const playBtn = document.querySelector('.music-play-btn');
  const volume = document.querySelector('.volume-slider');
  const title = document.querySelector('.music-title');
  const subtitle = document.querySelector('.music-subtitle');

  if (!pendant || !card || !playBtn) return;

  const track = musicTracks[0];

  document.addEventListener('click', (e) => {
    if (!card.contains(e.target) && !pendant.contains(e.target)) {
      card.classList.remove('show');
      pendant.setAttribute('aria-expanded', 'false');
    }
  });

  let audio = document.getElementById('global-audio');
  if (!audio) {
    audio = document.createElement('audio');
    audio.id = 'global-audio';
    audio.loop = true;
    audio.preload = 'none';
    document.body.appendChild(audio);
  }

  if (title) title.textContent = track.title;
  if (subtitle) subtitle.textContent = track.artist + ' · assets/audio/qingtian.mp3';

  audio.addEventListener('error', () => {
    console.log('音频文件未找到，请检查 ' + track.src, audio.error);
    showToast('音频文件未找到，请检查 assets/audio/qingtian.mp3');
    updateMusicUI(false);
  });

  const playIcon = `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
  const pauseIcon = `<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

  function updateMusicUI(playing) {
    playBtn.innerHTML = playing ? pauseIcon : playIcon;
    pendant.classList.toggle('playing', playing);
    playBtn.setAttribute('aria-label', playing ? '暂停音乐' : '播放音乐');
    pendant.setAttribute('aria-label', playing ? '暂停音乐' : '播放音乐');
  }

  function toggleMusic() {
    if (!audio.src || audio.src.endsWith('/') || audio.src === '') {
      audio.src = track.src;
    }

    if (audio.paused) {
      audio.play().then(() => {
        updateMusicUI(true);
      }).catch(err => {
        console.log('音频播放失败，请检查浏览器权限或文件路径 ' + track.src, err);
        showToast('音频文件未找到，请检查 assets/audio/qingtian.mp3');
        updateMusicUI(false);
      });
    } else {
      audio.pause();
      updateMusicUI(false);
    }
  }

  pendant.addEventListener('click', (e) => {
    e.stopPropagation();
    card.classList.add('show');
    pendant.setAttribute('aria-expanded', 'true');
    toggleMusic();
  });

  playBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMusic();
  });

  if (volume) {
    audio.volume = volume.value;
    volume.addEventListener('input', (e) => {
      audio.volume = e.target.value;
    });
  }
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function createPlumPetal(x, y, options) {
  options = options || {};
  var petal = document.createElement('span');
  petal.className = options.className ? 'plum-petal ' + options.className : 'plum-petal';

  var flowers = ['❀', '✿', '❁'];
  var colors = [
    'rgba(204, 67, 67, 0.92)',
    'rgba(216, 70, 84, 0.86)',
    'rgba(251, 202, 208, 0.78)'
  ];
  petal.textContent = flowers[Math.floor(Math.random() * flowers.length)];

  var size = options.size || randomBetween(18, 32);
  var life = options.life || randomBetween(2800, 4200);
  var driftX = typeof options.driftX === 'number' ? options.driftX : ((Math.random() - 0.5) * 86);
  var driftY = typeof options.driftY === 'number' ? options.driftY : (58 + Math.random() * 84);
  var rotate = typeof options.rotate === 'number' ? options.rotate : ((Math.random() - 0.5) * 120);
  var rotateMid = typeof options.rotateMid === 'number' ? options.rotateMid : rotate + 88;
  var rotateEnd = typeof options.rotateEnd === 'number' ? options.rotateEnd : rotate + 180;
  var color = options.color || colors[Math.floor(Math.random() * colors.length)];
  var opacity = typeof options.opacity === 'number' ? options.opacity : randomBetween(0.85, 1);
  var midOpacity = typeof options.midOpacity === 'number' ? options.midOpacity : Math.max(0.5, opacity - 0.14);

  petal.style.left = x + 'px';
  petal.style.top = y + 'px';
  petal.style.fontSize = size + 'px';
  petal.style.display = 'block';
  petal.style.visibility = 'visible';
  petal.style.opacity = '1';
  petal.style.setProperty('--petal-life', life + 'ms');
  petal.style.setProperty('--petal-drift-x', driftX + 'px');
  petal.style.setProperty('--petal-drift-y', driftY + 'px');
  petal.style.setProperty('--petal-mid-x', (driftX * 0.62) + 'px');
  petal.style.setProperty('--petal-mid-y', (driftY * 0.55) + 'px');
  petal.style.setProperty('--petal-rotate', rotate + 'deg');
  petal.style.setProperty('--petal-rotate-mid', rotateMid + 'deg');
  petal.style.setProperty('--petal-rotate-end', rotateEnd + 'deg');
  petal.style.setProperty('--petal-color', color);
  petal.style.setProperty('--petal-peak-opacity', opacity);
  petal.style.setProperty('--petal-mid-opacity', midOpacity);

  document.body.appendChild(petal);

  if (window.__plumTrailState) {
    window.__plumTrailState.petalsCreated += 1;
  }

  var removePetal = function () {
    if (petal.parentNode) {
      petal.remove();
    }
  };

  petal.addEventListener('animationend', removePetal, { once: true });
  window.setTimeout(removePetal, life + 250);
}

function initDomPlumTrail() {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reducedMotion = prefersReducedMotion;
  var hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  var hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  var isPureTouch = hasCoarsePointer && !hasFinePointer;

  var enabled = hasFinePointer && !isPureTouch;
  var trailConfig = reducedMotion ? {
    throttleMin: 180,
    throttleMax: 260,
    durationMin: 3200,
    durationMax: 4800,
    sizeMin: 20,
    sizeMax: 34,
    opacityMin: 0.75,
    opacityMax: 0.95,
    jitter: 12,
    driftX: 42,
    driftYMin: 38,
    driftYMax: 78,
    rotateBase: 46,
    rotateStepMin: 18,
    rotateStepMax: 48
  } : {
    throttleMin: 90,
    throttleMax: 120,
    durationMin: 3200,
    durationMax: 5000,
    sizeMin: 16,
    sizeMax: 32,
    opacityMin: 0.78,
    opacityMax: 0.96,
    jitter: 16,
    driftX: 76,
    driftYMin: 64,
    driftYMax: 132,
    rotateBase: 96,
    rotateStepMin: 58,
    rotateStepMax: 148
  };

  window.__plumTrailState = {
    enabled: enabled,
    prefersReducedMotion: prefersReducedMotion,
    reducedMotion: reducedMotion,
    hasFinePointer: hasFinePointer,
    hasCoarsePointer: hasCoarsePointer,
    isPureTouch: isPureTouch,
    viewportWidth: window.innerWidth,
    throttle: Math.round(randomBetween(trailConfig.throttleMin, trailConfig.throttleMax)),
    lastEventType: null,
    lastX: null,
    lastY: null,
    lastTime: null,
    petalsCreated: 0
  };

  console.log('Plum trail ready', window.__plumTrailState);

  window.__testDomPetals = function () {
    var centerX = window.innerWidth / 2;
    var centerY = window.innerHeight / 2;
    var total = 30;
    for (var i = 0; i < total; i++) {
      (function (idx) {
        setTimeout(function () {
          createPlumPetal(
            centerX + (Math.random() - 0.5) * 220,
            centerY + (Math.random() - 0.5) * 120,
            {
              className: 'plum-petal--test',
              size: randomBetween(26, 40),
              life: randomBetween(4200, 5200),
              driftX: (Math.random() - 0.5) * 110,
              driftY: randomBetween(64, 132),
              rotate: (Math.random() - 0.5) * 70,
              rotateMid: (Math.random() - 0.5) * 120,
              rotateEnd: (Math.random() - 0.5) * 180,
              color: 'rgba(216, 70, 84, 0.95)',
              opacity: 0.95,
              midOpacity: 0.86
            }
          );
        }, idx * 35);
      })(i);
    }
    window.setTimeout(function () {
      console.log('__testDomPetals spawned:', total);
      console.log('current petals:', document.querySelectorAll('.plum-petal').length);
    }, total * 35 + 120);
  };

  if (!enabled) {
    return;
  }

  var lastSpawnTime = 0;
  var spawnInterval = window.__plumTrailState.throttle;

  function buildPetalOptions() {
    var rotate = (Math.random() - 0.5) * trailConfig.rotateBase;
    var rotateStep = randomBetween(trailConfig.rotateStepMin, trailConfig.rotateStepMax);
    var depth = Math.random();
    var depthClass = depth > 0.72 ? 'plum-petal--near' : (depth < 0.34 ? 'plum-petal--far' : '');
    var petalColors = [
      'rgba(204, 67, 67, 0.9)',
      'rgba(188, 58, 72, 0.78)',
      'rgba(251, 202, 208, 0.82)'
    ];

    return {
      className: depthClass,
      size: randomBetween(trailConfig.sizeMin, trailConfig.sizeMax) * (depthClass === 'plum-petal--near' ? 1.08 : 0.92),
      life: randomBetween(trailConfig.durationMin, trailConfig.durationMax) + (depthClass === 'plum-petal--far' ? 400 : 0),
      driftX: (Math.random() - 0.5) * trailConfig.driftX * (depthClass === 'plum-petal--far' ? 0.72 : 1),
      driftY: randomBetween(trailConfig.driftYMin, trailConfig.driftYMax) * (depthClass === 'plum-petal--far' ? 0.78 : 1),
      rotate: rotate,
      rotateMid: rotate + rotateStep * 0.5,
      rotateEnd: rotate + rotateStep,
      opacity: randomBetween(trailConfig.opacityMin, trailConfig.opacityMax) * (depthClass === 'plum-petal--far' ? 0.76 : 1),
      color: petalColors[Math.floor(Math.random() * petalColors.length)]
    };
  }

  function handlePlumMove(event) {
    if (event.pointerType && event.pointerType === 'touch') return;

    var now = Date.now();
    window.__plumTrailState.lastEventType = event.type;
    window.__plumTrailState.lastX = event.clientX;
    window.__plumTrailState.lastY = event.clientY;
    window.__plumTrailState.lastTime = now;

    if (now - lastSpawnTime < spawnInterval) return;
    lastSpawnTime = now;

    createPlumPetal(
      event.clientX + (Math.random() - 0.5) * trailConfig.jitter,
      event.clientY + (Math.random() - 0.5) * trailConfig.jitter,
      buildPetalOptions()
    );
  }

  if (window.PointerEvent) {
    document.addEventListener('pointermove', handlePlumMove, { passive: true, capture: true });
  } else {
    document.addEventListener('mousemove', handlePlumMove, { passive: true, capture: true });
  }
}

/**
 * 4. 按钮点击朱砂涟漪特效
 */
function initInkRipples() {
  const handleClickRipple = (e) => {
    const target = e.target.closest('a, button, .btn, .btn-ink, .nav-item a, .card, .snow-letter-card, .snow-filter-btn, .blog-entry-card, .image-note-card, .gallery-card, .song-card, .skill-tag, .social-icon, .contact-value, .music-card, .music-pendant, .music-play-btn, .playbar-btn, .theme-toggle, .theme-toggle-btn');
    if (!target) return;

    const ripple = document.createElement('span');
    ripple.className = 'ink-ripple';
    
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    
    document.body.appendChild(ripple);
    
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    }, { once: true });
  };

  document.addEventListener('click', handleClickRipple, true);
}

function initLightParallax() {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (reduceMotion || !hasFinePointer) return;

  var root = document.documentElement;
  var ticking = false;
  var lastX = 0;
  var lastY = 0;

  function updateScene() {
    var x = (lastX / window.innerWidth - 0.5) * 2;
    var y = (lastY / window.innerHeight - 0.5) * 2;
    root.style.setProperty('--scene-x', x.toFixed(3));
    root.style.setProperty('--scene-y', y.toFixed(3));
    ticking = false;
  }

  document.addEventListener('pointermove', function (event) {
    if (event.pointerType && event.pointerType === 'touch') return;
    lastX = event.clientX;
    lastY = event.clientY;

    if (!ticking) {
      window.requestAnimationFrame(updateScene);
      ticking = true;
    }
  }, { passive: true });

  document.querySelectorAll('.tilt-card').forEach(function (card) {
    card.addEventListener('pointermove', function (event) {
      if (event.pointerType && event.pointerType === 'touch') return;
      var rect = card.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - 0.5;
      var y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--tilt-x', (x * 5).toFixed(2) + 'deg');
      card.style.setProperty('--tilt-y', (y * -5).toFixed(2) + 'deg');
    }, { passive: true });

    card.addEventListener('pointerleave', function () {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
}

function createSnowLetterCard(post, options) {
  var compact = options && options.compact;
  var article = document.createElement('article');
  article.className = compact ? 'snow-letter-card snow-letter-card--compact tilt-card' : 'snow-letter-card tilt-card';
  article.setAttribute('data-category', post.category);
  article.setAttribute('data-post-id', post.id);

  article.innerHTML = [
    '<div class="snow-letter-card-meta">',
    '<span class="snow-letter-category">' + post.category + '</span>',
    '<span>' + post.date + '</span>',
    '<span>' + post.readTime + '</span>',
    '</div>',
    '<h3 class="snow-letter-card-title">' + post.title + '</h3>',
    '<p class="snow-letter-card-excerpt">' + post.excerpt + '</p>',
    '<button class="snow-letter-read-btn" type="button" data-read-id="' + post.id + '">阅读全文</button>'
  ].join('');

  return article;
}

function renderSnowLetterDetail(post) {
  var detail = document.getElementById('snow-letter-detail');
  if (!detail || !post) return;

  detail.innerHTML = [
    '<div class="snow-letter-detail-meta">',
    '<span class="snow-letter-category">' + post.category + '</span>',
    '<span>' + post.date + '</span>',
    '<span>' + post.readTime + '</span>',
    '</div>',
    '<h2>' + post.title + '</h2>',
    '<p class="snow-letter-detail-excerpt">' + post.excerpt + '</p>',
    '<div class="snow-letter-detail-body"><p>' + post.content + '</p></div>'
  ].join('');
}

function initSnowLettersPage() {
  var list = document.getElementById('snow-letter-list');
  var filters = document.querySelectorAll('[data-snow-filter]');
  var detail = document.getElementById('snow-letter-detail');
  if (!list || !detail) return;

  var currentCategory = '全部';

  function renderList() {
    var posts = currentCategory === '全部'
      ? snowLetterPosts
      : snowLetterPosts.filter(function (post) { return post.category === currentCategory; });

    list.innerHTML = '';
    posts.forEach(function (post) {
      list.appendChild(createSnowLetterCard(post));
    });

    var activePost = posts[0] || snowLetterPosts[0];
    var hashId = decodeURIComponent(window.location.hash.replace('#', ''));
    var hashPost = posts.find(function (post) { return post.id === hashId; });
    renderSnowLetterDetail(hashPost || activePost);
    setActiveCard(hashPost || activePost);
  }

  function setActiveCard(post) {
    list.querySelectorAll('.snow-letter-card').forEach(function (card) {
      card.classList.toggle('active', post && card.getAttribute('data-post-id') === post.id);
    });
  }

  filters.forEach(function (button) {
    button.addEventListener('click', function () {
      currentCategory = button.getAttribute('data-snow-filter') || '全部';
      filters.forEach(function (item) {
        item.classList.toggle('active', item === button);
      });
      renderList();
    });
  });

  list.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-read-id], .snow-letter-card');
    if (!trigger) return;

    var id = trigger.getAttribute('data-read-id') || trigger.getAttribute('data-post-id');
    var post = snowLetterPosts.find(function (item) { return item.id === id; });
    if (!post) return;

    renderSnowLetterDetail(post);
    setActiveCard(post);
    history.replaceState(null, '', '#' + post.id);
    detail.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });

  window.addEventListener('hashchange', function () {
    var id = decodeURIComponent(window.location.hash.replace('#', ''));
    var post = snowLetterPosts.find(function (item) { return item.id === id; });
    if (post) {
      renderSnowLetterDetail(post);
      setActiveCard(post);
    }
  });

  renderList();
}

function initHomeLatestSnowLetters() {
  var container = document.getElementById('latest-snow-list');
  if (!container) return;

  container.innerHTML = '';
  snowLetterPosts.slice(0, 3).forEach(function (post) {
    var card = createSnowLetterCard(post, { compact: true });
    var button = card.querySelector('[data-read-id]');
    if (button) {
      button.textContent = '去雪笺阅读';
      button.addEventListener('click', function () {
        window.location.href = 'articles.html#' + post.id;
      });
    }
    card.addEventListener('click', function (event) {
      if (event.target.closest('button')) return;
      window.location.href = 'articles.html#' + post.id;
    });
    container.appendChild(card);
  });
}
