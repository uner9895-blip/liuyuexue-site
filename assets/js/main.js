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
}

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

  if (!pendant || !card || !playBtn) return;

  pendant.addEventListener('click', (e) => {
    e.stopPropagation();
    card.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!card.contains(e.target) && !pendant.contains(e.target)) {
      card.classList.remove('show');
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

  const playIcon = `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
  const pauseIcon = `<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

  playBtn.addEventListener('click', () => {
    if (!audio.src || audio.src.endsWith('/') || audio.src === '') {
      audio.src = 'assets/audio/bgm.mp3';
    }

    if (audio.paused) {
      audio.play().then(() => {
        playBtn.innerHTML = pauseIcon;
        pendant.classList.add('playing');
        playBtn.setAttribute('aria-label', '暂停音乐');
      }).catch(err => {
        showToast("未检测到音频，可以在本地 assets/audio/ 部署 bgm.mp3 文件。");
      });
    } else {
      audio.pause();
      playBtn.innerHTML = playIcon;
      pendant.classList.remove('playing');
      playBtn.setAttribute('aria-label', '播放音乐');
    }
  });

  if (volume) {
    volume.addEventListener('input', (e) => {
      audio.volume = e.target.value;
    });
  }
}

/**
 * 3. DOM 文字花瓣鼠标轨迹 - 文字花瓣版（✿ ❀ ✽）
 */

function createPlumPetal(x, y, options) {
  options = options || {};
  var petal = document.createElement('span');
  petal.className = 'plum-petal';

  var flowers = ['❀', '✿', '❄'];
  petal.textContent = flowers[Math.floor(Math.random() * flowers.length)];

  var size = options.size || (24 + Math.random() * 12);

  petal.style.left = x + 'px';
  petal.style.top = y + 'px';
  petal.style.fontSize = size + 'px';

  document.body.appendChild(petal);

  if (window.__plumTrailState) {
    window.__plumTrailState.petalsCreated += 1;
  }

  console.log('Plum petal created:', {
    className: petal.className,
    text: petal.textContent,
    left: petal.style.left,
    top: petal.style.top,
    count: document.querySelectorAll('.plum-petal').length
  });

  var removePetal = function () {
    if (petal.parentNode) {
      petal.remove();
    }
  };

  petal.addEventListener('animationend', removePetal, { once: true });
  window.setTimeout(removePetal, 2200);
}

function initDomPlumTrail() {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  var hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  var isPureTouch = hasCoarsePointer && !hasFinePointer;

  var enabled = !prefersReducedMotion;

  window.__plumTrailState = {
    enabled: enabled,
    prefersReducedMotion: prefersReducedMotion,
    hasFinePointer: hasFinePointer,
    hasCoarsePointer: hasCoarsePointer,
    isPureTouch: isPureTouch,
    viewportWidth: window.innerWidth,
    lastEventType: null,
    lastX: null,
    lastY: null,
    lastTime: null,
    petalsCreated: 0
  };

  console.log('Plum trail state:', {
    enabled: enabled,
    prefersReducedMotion: prefersReducedMotion,
    hasFinePointer: hasFinePointer,
    hasCoarsePointer: hasCoarsePointer,
    isPureTouch: isPureTouch,
    viewportWidth: window.innerWidth
  });

  window.__testDomPetals = function () {
    var centerX = window.innerWidth / 2;
    var centerY = window.innerHeight / 2;
    var total = 30;
    console.log('__testDomPetals active! Spawning 30 visible text petals at center.');
    for (var i = 0; i < 30; i++) {
      (function (idx) {
        setTimeout(function () {
          createPlumPetal(
            centerX + (Math.random() - 0.5) * 260,
            centerY + (Math.random() - 0.5) * 150,
            { size: 28 + Math.random() * 14 }
          );
        }, idx * 35);
      })(i);
    }
    window.setTimeout(function () {
      console.log('__testDomPetals spawned:', total);
    }, total * 35 + 30);
  };

  // 右下角测试按钮
  var testBtn = document.getElementById('test-petals-btn');
  if (!testBtn) {
    testBtn = document.createElement('button');
    testBtn.id = 'test-petals-btn';
    testBtn.textContent = '测试花瓣';
    testBtn.style.cssText = [
      'position:fixed',
      'bottom:20px',
      'right:90px',
      'z-index:999999',
      'padding:8px 16px',
      'background:rgba(214,92,116,0.95)',
      'color:#fff',
      'border:none',
      'border-radius:4px',
      'cursor:pointer',
      'font-size:13px',
      'box-shadow:0 4px 12px rgba(214,92,116,0.3)',
      'transition:background 0.2s'
    ].join(';');
    testBtn.addEventListener('mouseenter', function () {
      testBtn.style.background = 'rgba(185,50,80,0.95)';
    });
    testBtn.addEventListener('mouseleave', function () {
      testBtn.style.background = 'rgba(214,92,116,0.95)';
    });
    testBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      window.__testDomPetals();
    });
    document.body.appendChild(testBtn);
  }

  if (!enabled) {
    return;
  }

  var lastSpawnTime = 0;

  function handlePlumMove(event) {
    var now = Date.now();
    window.__plumTrailState.lastEventType = event.type;
    window.__plumTrailState.lastX = event.clientX;
    window.__plumTrailState.lastY = event.clientY;
    window.__plumTrailState.lastTime = now;

    if (now - lastSpawnTime < 55) return;
    lastSpawnTime = now;

    var count = 1 + Math.floor(Math.random() * 2);
    for (var i = 0; i < count; i++) {
      createPlumPetal(
        event.clientX + (Math.random() - 0.5) * 28,
        event.clientY + (Math.random() - 0.5) * 28
      );
    }
  }

  document.addEventListener('pointermove', handlePlumMove, { passive: true, capture: true });
  document.addEventListener('mousemove', handlePlumMove, { passive: true, capture: true });

  console.log('DOM plum trail initialized:', window.__plumTrailState);
}

/**
 * 4. 按钮点击朱砂涟漪特效
 */
function initInkRipples() {
  const handleClickRipple = (e) => {
    const target = e.target.closest('a, button, .btn, .btn-ink, .nav-link, .card, .gallery-card, .music-card, .track-card, .theme-toggle, .theme-toggle-btn');
    if (!target) return;

    const ripple = document.createElement('span');
    ripple.className = 'click-ripple';
    
    // 内联基础定位与样式，确保可靠展现
    ripple.style.position = 'fixed';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    ripple.style.zIndex = '10000';
    ripple.style.pointerEvents = 'none';
    
    // 移除之前的涟漪，避免高频连点时元素堆叠
    document.querySelectorAll('.click-ripple').forEach(item => item.remove());
    
    document.body.appendChild(ripple);
    
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  };

  document.addEventListener('click', handleClickRipple, true);
}
